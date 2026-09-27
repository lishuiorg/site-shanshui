/* 页面模型（站点层）
 *
 * 视图模板在 lishui-kit/astro/views/，各站共用一份；本站要算什么、按什么口径算，
 * 全集中在这里。新增分站改的就是这个文件，不必再复制视图。
 *
 * 每个函数返回的对象直接摊给对应的模板：ctx 与 lang 是必给的，
 * 其余是本站特有的那几处（规模条取哪几项、筛选组、分组维度、元信息行、排序口径）。
 */

import { forLang } from 'lishui-kit';
import { sectionPath } from 'lishui-kit/i18n/paths.mjs';
import { ctxFor } from './context.mjs';
import {
  siteContent, statsOf, ofSection, byTitle, sortFilterValues,
} from './content.mjs';
import {
  CATEGORIES, SECTIONS, RULES, ELEVATION_BANDS, SCENERY_LEVELS,
} from './config.mjs';

/** 规模条四项。本站第三个数字是覆盖流域数。 */
const STAT_KEYS = ['entries', 'categories', 'basins', 'sources'];
const statItems = (stats) => STAT_KEYS.map((key) => ({ key, value: stats[key] }));

/** 首页凡例四条，编号与文字取自本站 config（第 2、3 条本站自写）。 */
const rulesOf = (lang) => RULES[lang].map(([no, title, text]) => ({ no, title, text }));

/** 板块图标：与各板块首个类别的图标一致。 */
const BOARD_GLYPH = { mountains: 'm4', waters: 'm2', routes: 'm9', articles: 'm5' };

/** 首页：形态是「板块卡」，中部预览区放四个板块。 */
export function homeModel(lang) {
  const ctx = ctxFor(lang);
  const content = siteContent();
  const { ui } = ctx;

  const boardItems = Object.keys(content.typeDirs).map((dir) => {
    const entries = ofSection(content.entries, lang, dir);
    const text = SECTIONS[dir][lang];
    return {
      href: sectionPath(dir, lang),
      glyph: BOARD_GLYPH[dir] || 'm1',
      name: ui.nav[dir],
      alt: '',
      desc: text.lede,
      count: entries.length,
      countUnit: ui.list.countUnit,
      browseAll: ui.home.browseAll,
      empty: entries.length === 0,
    };
  });

  return {
    ctx,
    lang,
    statItems: statItems(statsOf(content, lang)),
    rules: rulesOf(lang),
    boardItems,
  };
}

/* ---------- 列表页的筛选组 ---------- */

/* 每个板块出哪几组由本站定（分站计划 5.3）：流域与跨涉镇街是山、水、游赏三页共有的
   第一层导航；称号只在山、水两页；水库等级只在水页；海拔区间只在山页；
   游线方式只在游赏页。组内取值为空时该组自动隐藏。 */
const FILTERS_OF = {
  mountains: ['category', 'basin', 'districttowns', 'designation', 'scenerygrade', 'elevation', 'tag'],
  waters: ['category', 'basin', 'districttowns', 'designation', 'scenerygrade', 'reservoirclass', 'tag'],
  routes: ['category', 'basin', 'districttowns', 'scenerygrade', 'routemode', 'tag'],
  articles: ['category', 'tag'],
};

/** 列表页：一个板块的条目，按本站各筛选组筛。 */
export function listModel(lang, section) {
  const ctx = ctxFor(lang);
  const content = siteContent();
  const { ui } = ctx;

  const entries = ofSection(content.entries, lang, section).sort(byTitle);

  /* 取值一律用内容库的原始取值（data-filter="组:值"），界面文字在这里译好；
     英文页的标签走词表，不让中文漏出。 */
  const source = {
    category: entries.map((e) => e.category),
    basin: entries.map((e) => e.basin),
    districttowns: entries.flatMap((e) => e.district_town_keys || []),
    designation: entries.flatMap((e) => e.designation_keys || []),
    scenerygrade: entries.map((e) => e.scenery_level),
    reservoirclass: entries.map((e) => e.reservoir_class),
    elevation: entries.map((e) => e.elevation_band),
    routemode: entries.map((e) => e.route_mode),
    tag: entries.flatMap((e) => e.tags || []),
  };
  const uniq = (group) => sortFilterValues(
    [...new Set(source[group].filter(Boolean))], group, content,
  );

  const catNameOf = (key) => ctx.catName(CATEGORIES.find((c) => c.key === key));
  const option = (value, label) => ({ value, label });
  const LABEL = {
    category: ui.list.filterCategory,
    basin: ui.list.filterBasin,
    districttowns: ui.list.filterDistrictTowns,
    designation: ui.list.filterDesignation,
    scenerygrade: ui.list.filterSceneryGrade,
    reservoirclass: ui.list.filterReservoirClass,
    elevation: ui.list.filterElevation,
    routemode: ui.list.filterRouteMode,
    tag: ui.list.filterTag,
  };
  const labelOf = {
    category: catNameOf,
    basin: (v) => ctx.enumLabel('basin', v),
    districttowns: (v) => ctx.gloss(v, lang),
    designation: (v) => ctx.gloss(v, lang),
    scenerygrade: (v) => SCENERY_LEVELS[lang][v] || v,
    reservoirclass: (v) => ctx.enumLabel('reservoirClass', v),
    elevation: (v) => ELEVATION_BANDS[lang][v] || v,
    routemode: (v) => ctx.enumLabel('routeMode', v),
    tag: (v) => ctx.tagLabel(v),
  };

  const groups = entries.length > 0
    ? (FILTERS_OF[section] || ['category', 'tag']).map((key) => ({
      key,
      label: LABEL[key],
      options: uniq(key).map((v) => option(v, labelOf[key](v))),
    })).filter((group) => group.options.length > 0)
    : [];

  return { ctx, lang, section, entries, groups, text: SECTIONS[section][lang] };
}

/** 索引页：按类别分组，列出实体类型、所属流域与跨涉镇街三列，供「有没有写」的快速核对。 */
export function indexModel(lang) {
  const ctx = ctxFor(lang);
  const content = siteContent();
  const { ui } = ctx;

  const list = forLang(content.entries, lang).sort(byTitle);
  const cats = CATEGORIES.filter((c) => list.some((e) => e.category === c.key));

  const groups = [
    ...cats.map((cat) => ({ key: cat.key, name: ctx.catName(cat), range: '', items: [] })),
    { key: 'none', name: ui.list.filterAll, range: '', items: [] },
  ];
  for (const entry of list) {
    const group = groups.find((g) => g.key === entry.category) || groups[groups.length - 1];
    group.items.push(entry);
  }

  return {
    ctx,
    lang,
    groups,
    columns: ['entry', 'featuretype', 'basin', 'districttowns', 'depth'],
    total: list.length,
  };
}

/** 详情页：同板块条目按标题排，元信息行取本站的实体类型、流域、体裁与深度。 */
export function detailModel(lang, entry) {
  const ctx = ctxFor(lang);
  const { ui } = ctx;
  const sep = ctx.sep;

  const siblings = ofSection(siteContent().entries, lang, entry.dirName).sort(byTitle);

  const metaBits = [
    entry.feature_type ? `${ui.detail.featureType}${sep}${ctx.enumLabel('featureType', entry.feature_type)}` : '',
    entry.basin ? `${ui.detail.basin}${sep}${ctx.enumLabel('basin', entry.basin)}` : '',
    entry.genre ? `${ui.detail.genre}${sep}${ctx.enumLabel('genre', entry.genre)}` : '',
    `${ui.detail.depth}${sep}${ctx.depthLabel(entry)}`,
    entry.updated ? `${ui.detail.updated}${sep}${entry.updated}` : '',
  ].filter(Boolean);

  const schemaType = entry.type === 'place' ? 'Place' : entry.type === 'article' ? 'Article' : 'CreativeWork';

  return { ctx, lang, entry, siblings, metaBits, schemaType };
}

/** 关于页：左栏放范围、来源、已知缺口、门禁，右栏放许可、双语、纠错、技术说明。 */
export function aboutModel(lang) {
  const ctx = ctxFor(lang);
  return {
    ctx,
    lang,
    statItems: statItems(statsOf(siteContent(), lang)),
    columns: {
      left: ['scope', 'source', 'gap', 'gate'],
      right: ['license', 'bilingual', 'fix', 'tech'],
    },
  };
}
