/* 内容装载（站点层）
 *
 * 读取内容库、套上本站的分类与筛选规则，并把结果缓存起来——
 * 构建时每个页面模块都会调用，缓存保证内容只读一次。
 *
 * 通用的装载与解析在 lishui-kit：来源层与成果层读取、front-matter 解析、
 * Markdown 渲染、来源与关联解析。这里只做本分站特有的四件事：
 * 八个类别的归属、跨涉镇街与称号的筛选键、海拔与景区等级的分档、按类别取用。
 *
 * 筛选键一律取语言中立的取值：枚举（feature_type／basin／reservoir_class／
 * route_mode）本身就是中文取值，中英两份相同；镇街、称号、景区等级三个字段
 * 中英写法不同（英文稿按计划 4.1 不得含中文），故一律从中文稿推出键，
 * 界面文字再按词表译出——这样语言切换时地址栏里的筛选值不会失配。
 */

import { existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContent, forLang } from 'lishui-kit';
import { entryPath } from 'lishui-kit/i18n/paths.mjs';
import { SITE, CATEGORIES, ELEVATION_BANDS, SCENERY_LEVELS } from './config.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
export const SITE_ROOT = resolve(HERE, '..', '..');

/** 内容库位置：环境变量优先，其次站点库内的 content/ 子模块，最后同级目录。
    探测标志是内容库的站点登记 schema/sites.json——合库后它才是内容库的标志文件。 */
export function resolveContentDir() {
  const candidates = [
    process.env.LISHUI_CONTENT_DIR,
    join(SITE_ROOT, 'content'),
    resolve(SITE_ROOT, '..', 'lishui'),
  ].filter(Boolean);
  for (const dir of candidates) {
    if (existsSync(join(dir, 'schema', 'sites.json'))) return dir;
  }
  throw new Error(
    '找不到内容库。请设置 LISHUI_CONTENT_DIR，或在站点库内放置 content/ 子模块，'
    + '或把 lishui 内容库放在同级目录。',
  );
}

/* ---------- 本站分类规则 ---------- */

/* 八个类别由实体类型、feature_type 与 genre 推出，规则固定，不额外维护字段。
   山板块只有「山丘」一类；水板块按 feature_type 分河流、湖库、圩区堤闸；
   文章按体裁分游线、节事与体验、格局与源流（综述）、生态与保护。 */
const FEATURE_CATEGORY = {
  山丘: 'shanqiu',
  河流: 'heliu',
  湖库: 'huku',
  圩区堤闸: 'weiqu',
};
const GENRE_CATEGORY = {
  游线: 'youxian',
  节事: 'jieshi',
  综述: 'geju',
  生态: 'shengtai',
};

function deriveCategory(entry) {
  if (entry.type === 'article') return GENRE_CATEGORY[entry.genre] || 'geju';
  return FEATURE_CATEGORY[entry.feature_type] || 'shanqiu';
}

/** 中文稿：中英两份的镇街、称号、景区等级都以它为准推出筛选键。 */
const zhOf = (content, entry) => content.byId.get(entry.id)?.zh || entry;

/** 称号的筛选键：去掉括注里的年份与月份，「国家森林公园（2015 年 1 月）」→「国家森林公园」。 */
const stripYear = (v) => String(v).replace(/[（(][^）)]*[）)]\s*$/, '').trim();

/** 海拔分档：100 米以下 / 100–200 米 / 200 米以上。 */
function elevationBand(m) {
  if (typeof m !== 'number' || !Number.isFinite(m)) return null;
  if (m < 100) return 'low';
  if (m <= 200) return 'mid';
  return 'high';
}

/** 景区等级的筛选键：「国家 4A 级旅游景区（2019 年）」→「4A」。 */
function sceneryLevel(grade) {
  const m = String(grade || '').match(/(\dA)\b/i);
  return m ? m[1].toUpperCase() : null;
}

/* ---------- 装载与缓存 ---------- */

let cached = null;

export function siteContent() {
  if (cached) return cached;

  const content = loadContent({ contentDir: resolveContentDir(), siteId: SITE.id });
  for (const entry of content.entries) {
    const zh = zhOf(content, entry);
    entry.category = deriveCategory(entry);
    entry.path = entryPath(entry);
    entry.district_town_keys = Array.isArray(zh.district_towns) ? zh.district_towns : null;
    entry.designation_keys = Array.isArray(zh.designation)
      ? zh.designation.map(stripYear).filter(Boolean) : null;
    entry.scenery_level = sceneryLevel(zh.scenery_grade);
    entry.elevation_band = elevationBand(entry.elevation_m);
  }

  const updated = content.entries.map((e) => e.updated).filter(Boolean).sort().pop() || '';
  SITE.contentUpdated = updated;
  cached = { ...content, updated };
  return cached;
}

/* ---------- 取用 ---------- */

export const ofSection = (entries, lang, dirName) =>
  entries.filter((e) => e.lang === lang && e.dirName === dirName);

export const ofCategory = (entries, lang, key) =>
  entries.filter((e) => e.lang === lang && e.category === key);

export const byTitle = (a, b) => String(a.title).localeCompare(String(b.title), 'zh');

export const byUpdated = (a, b) =>
  String(b.updated || '').localeCompare(String(a.updated || ''))
  || byTitle(a, b);

/** 筛选取值排序：类别按本站八类顺序，枚举按取值表顺序，海拔与景区等级按分档顺序，
    称号与标签按字面，跨涉镇街按字面（街镇分站的顺序不跨库读取）。 */
export function sortFilterValues(values, group, content) {
  if (group === 'category') {
    const order = CATEGORIES.map((c) => c.key);
    return values.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }
  const table = {
    featuretype: content.enums.featureType,
    basin: content.enums.basin,
    reservoirclass: content.enums.reservoirClass,
    routemode: content.enums.routeMode,
  }[group];
  if (table) return values.sort((a, b) => table.indexOf(a) - table.indexOf(b));
  if (group === 'elevation') {
    const order = ELEVATION_BANDS.order;
    return values.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }
  if (group === 'scenerygrade') {
    const order = SCENERY_LEVELS.order;
    return values.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }
  return values.sort((a, b) => String(a).localeCompare(String(b), 'zh'));
}

/** 站点规模：条目数、类别数、覆盖流域、来源记录数。 */
export function statsOf(content, lang) {
  const list = forLang(content.entries, lang);
  const basins = new Set(list.map((e) => e.basin).filter(Boolean));
  return {
    entries: list.length,
    categories: CATEGORIES.length,
    basins: basins.size,
    sources: content.sourcesAll.length,
  };
}
