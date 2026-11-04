# 04: 文章管线、点击切换 16 阶网点 Hero 封面与 `post-minimap` 层级刻度目录 (Blog Pipeline, Dither Cover Toggle & Minimap TOC)

**Status:** Todo
**Blocked by:** 01-global-shell-dock-and-colophon.md

## Goal

复刻 `cali.so` 的完整 MDX 文章引擎与三大标志性文章交互：
1. **自动配齐每篇文章的 `1200×675` 顶部拍立得 Hero 封面（`cover.jpg`）、封面配文（`coverCaption`）与正文插图**（直接从用户已提供的「三扇门」原图、「三层知识库架构图」、「技能卡模板图」及精选素材库自动裁切生成，无需用户手动制图）；
2. **文章列表与详情页的网点显影与点击切换交互（`PolaroidCover` + `DitherVeil`）**：列表页（`PostRow`）每篇文章左侧带 `64×44` 网点缩略图（悬停显影彩图，点击通过 `ViewTransition` 放大为文章页顶部封面），且标题右侧带点击展开的墨迹扩散舞台（`WritingInkStage`）；**在文章详情页点击顶部拍立得封面时，触发 16 步 Bayer 矩阵阶梯溶解，在「复古半色调网点版画」与「高清原图」之间来回丝滑切换**；
3. **文章页左侧迷你标尺目录（`post-minimap` / `PostToc`）**：按标题层级优先级渲染**长刻度线（`landmark`：`variant="title"` / `variant="heading"`）**与每两个标题之间的 **3 根短刻度线（`TICKS_BETWEEN_LANDMARKS = 3`，`kind="tick"`）**，顶部带圆环阅读进度开关按钮，移动端滚动后在顶部化为灵动岛（`post-minimap-island`）。

## Acceptance Criteria

- [ ] `lib/content.ts` 完整实现 MDX 解析、阅读时长估算，以及 `buildPostRail`（将 `##` / `###` 标题解析为带 `variant="title" | "heading"` 优先级的 `landmark` 节点，并在相邻标题间插入 3 个 `tick` 短刻度节点）。
- [ ] `content/blog/` 下内置 4 篇「芯火」真实文章（《用 AI 最怕的不是不会，而是走错门》《搭建最简知识库（内置 Skill）》《四步填空：从知识卡片到高转化口播文案》《一人公司方法论：抄、操、超、钞》），每篇均配齐专属 `cover.jpg`（`1200×675`）、`coverCaption` 及正文配图。
- [ ] 1:1 复刻 `components/dither-veil.tsx`（`PolaroidCover` / `DitheredImage`）：文章详情页顶部封面支持点击触发 16 步（每步 `38ms`）Bayer 矩阵阶梯溶解，在网点状态（`settled = false`）与高清原图状态（`settled = true`）之间往返切换，并播放快门音效。
- [ ] 1:1 复刻 `components/post-toc.tsx`（`id="post-document-minimap"`）：桌面端左侧渲染阅读进度圆环按钮与长短刻度尺目录（点击刻度平滑滚动至对应章节），移动端渲染顶部灵动岛目录。

## Test Cases

- **Happy path:** 测试 `buildPostRail`：传入包含 `##` 与 `###` 标题的 Markdown 文本，断言生成的 `PostRailNode[]` 正确区分 `landmark`（长刻度）与中间间隔的 3 个 `tick`（短刻度）。
- **Happy path:** 校验 `content/blog/<slug>/cover.jpg` 在全部 4 篇文章目录下真实存在，且 frontmatter 包含 `title`、`date`、`summary`、`cover`、`coverCaption`。
- **Happy path:** 在 `PolaroidCover` 上触发点击事件，断言 `aria-pressed` 状态在 `"false"`（高清原图）与 `"true"`（全网点版画）之间往返切换。

## Out of Scope

- `/projects` 与 `/photos` 页面（在 05 号工单中实现）。
