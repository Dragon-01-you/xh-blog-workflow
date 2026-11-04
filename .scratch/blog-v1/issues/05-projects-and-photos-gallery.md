# 05: 项目工程蓝图页与拍立得照片画廊页 (Projects Blueprint & Photos Polaroid Gallery)

**Status:** Done
**Blocked by:** 01-global-shell-dock-and-colophon.md

## Goal

复刻 `cali.so` 的 `/projects` 项目展示页（含 `GhostSchematic` 工程线框图与 `ProjectsBlueprintStage` 蓝图网格隐藏层，展示「芯火」真实项目，严禁出现任何赛车图片）与 `/photos` 拍立得影像画廊页（展示「芯火」海报 `portrait-poster.png`、童年照片 `avatar.png`、3D 舞台 `cube-stage.png` 等真实影像，支持拍立得网点显影与灯箱预览）。

## Acceptance Criteria

- [x] 1:1 复刻 `app/_views/projects-page.tsx`、`components/ghost-schematic.tsx` 与 `components/hidden-list-stage.tsx` 中的 `ProjectsBlueprintStage`，填入「芯火」真实项目数据（不含任何赛车图）。
- [x] 1:1 复刻 `app/_views/photos-page.tsx` 与 `lib/photos.ts`，使用已审核通过的真实个人影像资产渲染拍立得画廊。

## Test Cases

- **Happy path:** 渲染 `/projects` 与 `/photos` 视图，断言所有图片路径均指向 `public/images/` 下的真实存在文件，且不包含 `hypercar-hero.png`。（已通过 `tests/unit/projects-photos-discovery.test.tsx` 验证）
- **Edge case:** 在 `/photos` 页切换分类或点击拍立得卡片时，正确展示照片配文与拍摄元数据。（已通过 `tests/unit/projects-photos-discovery.test.tsx` 验证）

## Out of Scope

- `/admin` 本地仪表盘与 SEO/RSS/OG 公开检索路由（在 06 号工单中实现）。
