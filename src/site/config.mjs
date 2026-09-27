/* 站点常量与本站分类体系
 *
 * 八个类别、四个板块、板块说明与编纂凡例都只属于山水，放在站点层；
 * kit 只提供通用的设计系统、组件与译法，不认这套分类。
 *
 * ARCHIVE 与 LIST_PAGE_SIZE 站群一致，改为从 lishui-kit/site-defaults.mjs
 * 再导出；RULES 本站自写（见文件末尾），不用底座默认值。
 *
 * 与另三个分站最大的不同：本站没有时间轴，也没有文保级别。
 * 山水的年代只能给到「明代」「1958 年」这一档，且多数自然实体本身没有可系年的
 * 形成时点；第一层导航改用流域，称号一律记进 designation 字段，不另立条目。
 */

export const SITE = {
  id: 'lishui-shanshui',
  name: '溧水山水',
  nameEn: 'Lishui Land and Water',
  host: 'shanshui.lishui.org',
  origin: 'https://shanshui.lishui.org',
  portal: 'https://lishui.org',
  portalName: '溧水一方',
  portalNameEn: 'A Place Called Lishui',
  contentUpdated: '',
};

/** 列表页每页条数：站群一致，取自底座。 */
export { LIST_PAGE_SIZE } from 'lishui-kit/site-defaults.mjs';

/* ---------- 八个类别 ---------- */

/* 山板块一个（山丘），水板块三个（河流、湖库、圩区堤闸），
   游赏板块两个（游线、节事与体验），综述板块两个（格局与源流、生态与保护）。
   归类规则见 content.mjs 的 deriveCategory，不额外维护分类字段。
   山板块只设一个类别是刻意的：可写的山体就那几座，再按山、峰、岭拆开，每类只剩一两条。 */

export const CATEGORIES = [
  {
    key: 'shanqiu',
    zh: '山丘',
    en: 'Mountains and Hills',
    glyph: 'm4',
    dirName: 'mountains',
    desc: {
      zh: '东庐山、廻峰山、浮山、芳山、秋湖山、西横山、无想山等单体山体与连片山地，每条填海拔与所属流域。',
      en: 'Individual peaks and connected uplands — Donglu, Huifeng, Fushan, Fangshan, Qiuhu, Xiheng and Wuxiang among them — each with its elevation and drainage basin.',
    },
  },
  {
    key: 'heliu',
    zh: '河流',
    en: 'Rivers',
    glyph: 'm2',
    dirName: 'waters',
    desc: {
      zh: '一干河、二干河、三干河、新桥河、溧水河、云鹤支河、天生桥河（胭脂河）等干河与支河，每条填河长。',
      en: 'Trunk and tributary rivers — the Yigan, Ergan, Sangan, Xinqiao, Lishui and Yunhe, and the Tiansheng Bridge River (Yanzhi River) — each with its length.',
    },
  },
  {
    key: 'huku',
    zh: '湖库',
    en: 'Lakes and Reservoirs',
    glyph: 'm1',
    dirName: 'waters',
    desc: {
      zh: '石臼湖与六座中型水库（方便、中山、卧龙、老鸦坝、姚家、赭山头），每条填面积或库容，水库另填等级。',
      en: 'Shijiu Lake and the six medium-sized reservoirs — Fangbian, Zhongshan, Wolong, Laoyaba, Yaojia and Zheshantou — each with its area or capacity, reservoirs also with a class.',
    },
  },
  {
    key: 'weiqu',
    zh: '圩区堤闸',
    en: 'Polders, Dikes and Sluices',
    glyph: 'm3',
    dirName: 'waters',
    desc: {
      zh: '圩、堤防、闸与撇洪沟：石臼湖堤防、天生桥闸、章西圩撇洪沟等，写水利设施的规模与作用。',
      en: 'Polders, embankments, sluices and flood-diversion channels — the Shijiu Lake dike, the Tiansheng Bridge Sluice, the Zhangxi polder channel — with their scale and function.',
    },
  },
  {
    key: 'youxian',
    zh: '游线',
    en: 'Tour Routes',
    glyph: 'm9',
    dirName: 'routes',
    desc: {
      zh: '官方推荐的线路与有明确起讫点的自发线路，逐点写明串联的山水与到达方式。',
      en: 'Officially recommended routes and self-guided routes with a definite start and end, naming the land and water they link and how to reach them.',
    },
  },
  {
    key: 'jieshi',
    zh: '节事与体验',
    en: 'Festivals and Experiences',
    glyph: 'm6',
    dirName: 'routes',
    desc: {
      zh: '梅花节、草莓文化节、半程马拉松、露营与观鸟等年度节事与体验类型，写历年情况与实用信息。',
      en: 'Annual festivals and kinds of experience — plum blossom and strawberry festivals, the half marathon, camping and birdwatching — with their past editions and practical notes.',
    },
  },
  {
    key: 'geju',
    zh: '格局与源流',
    en: 'Landforms and Drainage',
    glyph: 'm5',
    dirName: 'articles',
    desc: {
      zh: '地势格局、水系与分水岭、秦淮河源头、三大流域的划分综述。',
      en: 'The lie of the land, the river system and its divides, the source of the Qinhuai, and how the three drainage basins are drawn.',
    },
  },
  {
    key: 'shengtai',
    zh: '生态与保护',
    en: 'Ecology and Protection',
    glyph: 'm7',
    dirName: 'articles',
    desc: {
      zh: '保护地体系、生态保护红线、湿地与候鸟、生态治理综述。',
      en: 'The protected-area system, ecological red lines, wetlands and migratory birds, and the record of ecological work.',
    },
  },
];

/* ---------- 板块说明 ---------- */

export const SECTIONS = {
  mountains: {
    zh: {
      title: '山',
      lede: '溧水的山丘，每一条填海拔与所属流域。官方点名的山体一条不缺；海拔与流域取自政府公开文件与技术文本，官方未点名归属山体的，正文如实写明，不推测、不用百科填充。',
      note: '全区最高海拔 368.5 米，官方文件未点名归属哪座山体，缺口在「关于」页写明。',
    },
    en: {
      title: 'Mountains',
      lede: 'The hills of Lishui, each entry giving its elevation and drainage basin. Every peak named in an official document has an entry; elevations and basins come from government documents and technical reports, and where no official document names the hill a figure belongs to, the entry says so rather than guessing.',
      note: 'The district’s highest point, 368.5 m, is not attributed to a named hill in any official document; the gap is set out on the About page.',
    },
  },
  waters: {
    zh: {
      title: '水',
      lede: '河流、湖库与圩区堤闸。石臼湖与六座中型水库一条不缺，每条填面积、河长或库容；同一事项有两个以上官方口径的，全部并列，各自标明年份与出处。',
      note: '小型水库官方口径有 73 座与 79 座两说，第 1 期不全量立条，两说在「关于」页并列。',
    },
    en: {
      title: 'Waters',
      lede: 'Rivers, lakes and reservoirs, and polders, dikes and sluices. Shijiu Lake and the six medium-sized reservoirs are all present, each with its area, length or capacity; where an item has more than one official figure, all are given with their source and year.',
      note: 'The number of small reservoirs is given officially as 73 and as 79; the first phase does not list them all, and both figures are set out on the About page.',
    },
  },
  routes: {
    zh: {
      title: '游赏',
      lede: '官方推荐的游线与年度节事。逐点写明串联的山水，门票、开放时间、交通这类一季一变的信息不写死数字，只给出官方渠道名并标注信息时点。',
      note: '宣传性描述不进正文，只作来源线索；游览信息以景区官方发布为准。',
    },
    en: {
      title: 'Visiting',
      lede: 'Officially recommended routes and the annual festivals. Each names the land and water it links; prices, opening hours and transport change from season to season, so no fixed figures are given — only the official channel and the date the information was checked.',
      note: 'Promotional wording is kept out of the text and used only as a lead to sources; visiting details follow what the site itself publishes.',
    },
  },
  articles: {
    zh: {
      title: '综述',
      lede: '自行撰写的条目：地势格局与水系划分、秦淮河源头的几种说法、保护地体系与生态治理的整理。多口径在此逐条并列。',
      note: '成果层文字一律自撰，不整段转录受版权保护的来源。',
    },
    en: {
      title: 'Surveys',
      lede: 'Entries written here: the lie of the land and how the river system is divided, the accounts given for the source of the Qinhuai, and the protected-area system with the record of ecological work. Divergent official figures are set side by side.',
      note: 'Entry text is written here, never transcribed wholesale from copyrighted sources.',
    },
  },
};

/* ---------- 筛选取值的分档与顺序 ---------- */

/** 海拔分档：山列表用。键是语言中立的档位名，界面文字在这里译好。 */
export const ELEVATION_BANDS = {
  order: ['low', 'mid', 'high'],
  zh: { low: '100 米以下', mid: '100–200 米', high: '200 米以上' },
  en: { low: 'Under 100 m', mid: '100–200 m', high: 'Over 200 m' },
};

/** 景区等级的筛选键：从 scenery_grade 里取出「4A」这一档，中英同一把钥匙。 */
export const SCENERY_LEVELS = {
  order: ['5A', '4A', '3A', '2A'],
  zh: {
    '5A': '国家 5A 级旅游景区', '4A': '国家 4A 级旅游景区',
    '3A': '国家 3A 级旅游景区', '2A': '国家 2A 级旅游景区',
  },
  en: {
    '5A': 'National 5A scenic area', '4A': 'National 4A scenic area',
    '3A': 'National 3A scenic area', '2A': 'National 2A scenic area',
  },
};

/* ---------- 来源层归档方式 ---------- */

/* 站群一致，取自底座。 */
export { ARCHIVE } from 'lishui-kit/site-defaults.mjs';

/* ---------- 编纂凡例（首页） ---------- */

/* 本站自写，不用底座默认值：第 3 条按自然地理口径表述
   （多口径全部并列、宣传性描述不入正文），与历史／文化两站的旧志口径、
   街镇站的官方文件口径都不同。 */
export const RULES = {
  zh: [
    ['一', '无来源不入库', '每条条目引用的来源都必须在来源层存在对应卡片，且 <code>rights</code> 字段填明授权状态。无来源的事实不进入已发布状态。'],
    ['二', '成果层自撰', '成果层文字一律自行撰写，不整段转录受版权保护的来源；官方文件的名录与数字照录，并标明文件与条款。'],
    ['三', '多口径并列', '同一事项出现两个以上官方口径的（石臼湖面积、小型水库座数），全部并列，各自标明年份与出处，不做加总改写、不擅自取舍。宣传性描述只作来源线索，不入正文。'],
    ['四', '双语成对', '中英共用同一个条目 ID，英文稿放在 <code>content/en/</code> 的对称路径下。缺任一份，两份都不得发布。'],
  ],
  en: [
    ['I', 'No source, no entry', 'Every source cited by an entry must exist as a card in the source layer with its <code>rights</code> status stated. Nothing without a source is published.'],
    ['II', 'Written, not copied', 'Entry text is written here, not transcribed wholesale from copyrighted sources. Names and figures are taken from official documents, which are cited by document and clause.'],
    ['III', 'Every figure shown', 'Where an item has more than one official figure — the area of Shijiu Lake, the number of small reservoirs — all are given with their source and year. Nothing is summed, rounded or dropped, and promotional wording is used only as a lead to sources.'],
    ['IV', 'Paired languages', 'Chinese and English share one entry ID, with the English draft at the mirrored path under <code>content/en/</code>. If either is missing, neither may be published.'],
  ],
};
