# site-shanshui · 溧水山水站点库

溧水一方「溧水山水」分站的站点库。内容在 `lishui` 统一内容库的 `content/lishui-shanshui/`（英文在 `content/en/lishui-shanshui/` 的对称路径），共享底座在 `lishui-kit`，本站只写溧水山水特有的部分。

- 域名：`shanshui.lishui.org`（中文在根路径，英文在 `/en/` 下）
- 生成器：Astro 5（静态输出，产物是纯 HTML）
- 内容侧 siteId：`lishui-shanshui`
- 计划文档：`Plan/lishui-shanshui-plan.html`

## 本站写什么

溧水区的自然山水：山丘、河流、湖库、圩区堤闸，以及山水上的游线、年度节事与生态综述。判据只有一条——内容是不是长在山水上。本站不排除景点化内容：好景区、好景点、好的游玩体验直接写进条目，景区等级可核到才填。

## 八个类别与四个板块

类别由实体的 `feature_type` 与文章的 `genre` 推出，不额外维护分类字段。

| 板块 | 类别 | 目录 | 主体 | 归类依据 |
| --- | --- | --- | --- | --- |
| 山 | 山丘 | `mountains/` | `place` | `feature_type: 山丘` |
| 水 | 河流 | `waters/` | `place` | `feature_type: 河流` |
| 水 | 湖库 | `waters/` | `place` | `feature_type: 湖库` |
| 水 | 圩区堤闸 | `waters/` | `place` | `feature_type: 圩区堤闸` |
| 游赏 | 游线 | `routes/` | `article` | `genre: 游线` |
| 游赏 | 节事与体验 | `routes/` | `article` | `genre: 节事` |
| 综述 | 格局与源流 | `articles/` | `article` | `genre: 综述` |
| 综述 | 生态与保护 | `articles/` | `article` | `genre: 生态` |

本站没有时间轴：自然实体多数没有可系年的形成时点，第一层导航改用**所属流域**（秦淮河 / 石臼湖，另有「分水岭」「待考」两种如实标注）。

## 本站特有的字段

在底座字段之外新增十四个，白名单见 `lishui/scripts/sites/lishui-shanshui.mjs` 的 `ALLOWED`。

| 字段 | 用于 | 说明 |
| --- | --- | --- |
| `feature_type` | `place` 必填 | 山丘 / 河流 / 湖库 / 圩区堤闸 |
| `basin` | `place` 必填 | 秦淮河 / 石臼湖 / 太湖湖西 / 分水岭 / 待考 |
| `district_towns` | `place` 必填 | 跨涉镇街，取值必须是街镇分站已有的镇街名 |
| `elevation_m` | 山丘必填 | 海拔（米） |
| `length_km` | 河流必填 | 河长（公里） |
| `area_km2` | 湖库与圩区堤闸必填 | 面积（平方千米） |
| `reservoir_class` | 题名含「水库」者必填 | 中型 / 小（一）型 / 小（二）型 |
| `capacity_10k_m3` | 水库 | 总库容（万立方米） |
| `designation` | 有称号的实体 | 数组，每项须带年份 |
| `scenery_grade` | 有等级的景区 | 须写明评定年份 |
| `water_quality` | 水体 | 水质口径 |
| `route_km` / `route_nodes` / `route_mode` | 游线 | 线路长度 / 途经点 / 方式 |
| `held_month` / `host` | 节事 | 举办月份 / 主办 |

称号一律记在实体的 `designation` 字段上，不另立条目——同一处山水只有一个条目，山体属性与称号属性都写在里面。

## 三个库的关系

| 库 | 放什么 | 本站怎么用 |
| --- | --- | --- |
| `lishui` | 全部内容：来源层与成果层的 Markdown，按 `content/<siteId>/` 分区 | 构建时只读本站子树，一条都不复制进本站 |
| `lishui-kit` | 设计系统、知识组件、视图模板、多语言、校验引擎 | 以 `file:../lishui-kit` 依赖引入，不重写 |
| `site-shanshui` | 本站的站点身份、类别与板块规则、页面薄包装 | 本库 |

内容库位置按 `LISHUI_CONTENT_DIR` → 本站 `content/` 目录 → 同级目录 `../lishui` 依次查找。

## 目录

| 路径 | 放什么 |
| --- | --- |
| `src/pages/` | 路由。中文在根下，英文在 `en/` 下的对称路径 |
| `src/pages/[dir]/[slug].astro` | 条目详情页，路径由内容库的目录名与 ID 尾段决定 |
| `src/pages/sitemap.xml.js` | 站点地图，构建时从内容库枚举路由 |
| `src/views/` | 页面包装：各自 `import` 底座的一种视图变体，把本站模型摊给它 |
| `src/site/config.mjs` | 本站常量、八个类别表、四个板块说明、编纂凡例、海拔与景区等级分档 |
| `src/site/content.mjs` | 读内容库并套上本站规则（类别归属、筛选键、海拔与等级分档） |
| `src/site/model.mjs` | 每个页面要算什么：规模条、筛选组、分组维度、元信息行、排序口径 |
| `src/site/context.mjs` | 渲染上下文，由 kit 的 `makeContext` 生成，页面共用 |
| `src/i18n/ui.zh.json`、`ui.en.json` | 界面串。英文用 `: `、中文用 `：`（`labelSep`） |
| `public/` | 原样拷贝进产物的静态件：`CNAME`、`robots.txt`、`.nojekyll`、`assets/img/` |

## 筛选维度

列表页的筛选组按板块给，组内取值为空时该组自动隐藏。

| 板块 | 筛选组 |
| --- | --- |
| 山 | 类别、流域、跨涉镇街、称号、景区等级、海拔区间、标签 |
| 水 | 类别、流域、跨涉镇街、称号、景区等级、水库等级、标签 |
| 游赏 | 类别、流域、跨涉镇街、景区等级、游线方式、标签 |
| 综述 | 类别、标签 |

跨涉镇街、称号、景区等级三个字段中英写法不同，筛选键一律从中文稿推出，界面文字再按词表译出——语言切换时地址栏里的筛选值不会失配。

## 命令

```bash
npm install          # 首次；lishui-kit 以 file: 依赖装在 node_modules 下
npm run dev          # 本地开发，http://localhost:4321/
npm run build        # 生成 dist/
npm run validate     # 内容校验（调内容库的校验脚本，只跑本站规则）
npm run check        # 校验 + 构建 + 站内链接自检 + 页面自检，提交前跑这个
```

## 校验

通用规则（字段白名单、来源存在性、双语配对、专名一致性、摘要长度、标签白名单）由 `lishui-kit/validate/engine.mjs` 负责。本站以 `extra` 回调追加十二项，见 `lishui/scripts/sites/lishui-shanshui.mjs`：

1. `feature_type`、`basin`、`district_towns` 三项必填；
2. 按 `feature_type` 必填规模字段：山丘填 `elevation_m`，河流填 `length_km`，湖库与圩区堤闸填 `area_km2`；
3. 湖库且题名含「水库」者，`reservoir_class` 必填；
4. `feature_type` / `basin` / `reservoir_class` / `route_mode` 的取值门禁；
5. `district_towns` 的每个取值都必须是街镇分站已存在的镇街名（英文稿存英文名，只校条数与语言）；
6. `designation` 的每一项都要带年份，且正文里能见到该称号；
7. `scenery_grade` 须写明评定年份，正文须有「景观与游赏」一节；
8. 正文固定节次：`place` 四节（概况、形成与变迁、景观与游赏、存疑之处）；文章按体裁三节；
9. 英文稿的 `designation` / `scenery_grade` / `district_towns` / `address` 不得含中文；
10. 中英两份的 `elevation_m` / `length_km` / `area_km2` / `capacity_10k_m3` / `route_km` 必须完全相同；
11. 坐标须落在溧水境内（纬度 31–32、经度 118.5–119.5）；
12. 本站新增的 `featureType` / `basin` / `reservoirClass` / `routeMode` 四个枚举，引擎不查译法，故补一道门禁，译法可住 `glossary.csv` 或 `schema/terms.en.json` 任一处。

### 两个易踩的坑

- **固定节次的正则不能用 `\b` 收尾。** `\b` 按 `\w`（`[A-Za-z0-9_]`）判词界，汉字属非词字符，`## 概况` 后无论接换行还是冒号都不成词界，规则会永远判缺失。故用「标题名后紧跟空白、冒号或行尾」的先行断言。
- **单位不在中英之间换算。** 中文写 `2731 万立方米`，英文写 `2731 10,000 m³`，数字不动，只换单位标签。

## 内容状态

第 1 期试运行（10 条样板，中英成对）已完成并通过全部自检：山丘 3 条（东庐山、无想山、秋湖山）、湖库 3 条（石臼湖、方便水库、中山水库）、河流 2 条（一干河、胭脂河）、游线 1 条（一山一湖自驾户外线）、综述 1 条（溧水地势格局）。

多口径是本站的常态：石臼湖面积、溧水境内面积、岸线长度、全区面积、水库座数、无想山国家森林公园面积、气候要素等，凡有两个以上官方口径的一律并列，各自标明年份与出处，不做加总改写，也不擅自凑数。

## 待办

1. 第 1 期铺量：条目由 10 条补足至 40 条，六座中型水库（方便、中山、卧龙、老鸦坝、姚家、赭山头）与秦淮河、石臼湖两大流域全部到位。
2. 上线：建 `lishuiorg/site-shanshui` 仓库、配 Pages 与 `shanshui.lishui.org` 的 DNS 与 HTTPS。
3. 门户挂接：`site-portal/sites.json` 的 `shanshui` 状态由 `planned` 改为 `building`、上线后改为 `live`，门户 `index.html` 的站点矩阵行与页脚同步改为可点击链接。
4. 换 `public/assets/img/og-cover.jpg` 为本站自己的图（现为脚手架借来的）。
