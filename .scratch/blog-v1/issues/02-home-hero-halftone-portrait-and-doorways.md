# 02: 首页半色调网点人像、5 层隐藏流场与三扇门导航卡 (Home Hero, HalftonePortrait & NavCards)

**Status:** Done
**Completed At:** 2026-11-03T21:18:00+08:00
**Blocked by:** 01-global-shell-dock-and-colophon.md

## Goal

复刻 `cali.so` 首页上半屏（Hero 区）：包含基于真实抠图生成的高清昼夜双源半色调网点人像（`HalftonePortrait`，亮色读取 `public/images/headshot.jpg`，暗色读取 `public/images/portrait-square.jpg`）、点击人像翻开的 5 层波浪等高线隐藏彩蛋舞台（`PortraitHiddenStage`）、右侧「芯火」主标题与导语（`HomeIntroduction`），以及下方带精细几何 SVG 插画的三扇门导航卡（`NavCards`）。

## Acceptance Criteria

- [x] 1:1 复刻 `components/halftone-portrait.tsx`：亮色模式渲染白底黑网点正片（`headshot.jpg`），暗色模式渲染纯黑底色、网点边缘向四周自然衰减且不粘连的白网点肖像（`portrait-square.jpg`），鼠标悬停时圆点产生弹性斥力。
- [x] 1:1 复刻 `components/portrait-hidden-stage.tsx`：点击人像时人像向右下退居一角，背后展开 5 层可交互切换的波浪等高线/流场 Shader 与 SVG 纹理层（含右侧 `01`–`05` 层级药丸切换器），再次点击丝滑收起。
- [x] 1:1 复刻 `components/home-introduction.tsx` 与 `components/nav-cards.tsx`：主标题为「芯火」，副标题与导语展示 AI 工作流与知识库定位；三张导航卡（写作 `/blog`、项目 `/projects`、相册 `/photos`）带 1:1 几何线条插画。

## Test Cases

- **Happy path:** 渲染首页 Hero 区，断言亮/暗模式下 `HalftonePortrait` 分别绑定 `/images/headshot.jpg` 与 `/images/portrait-square.jpg`。
- **Happy path:** 点击 `HalftonePortrait` 触发 `onToggleStage`，断言 `PortraitHiddenStage` 进入展开态并可切换 `01`–`05` 共 5 层纹理。
- **Edge case:** 当浏览器开启 `prefers-reduced-motion: reduce` 时，网点物理弹力与隐藏层动画自动降级为静态渲染且不报错。

## Out of Scope

- 首页下半屏的经历时间轴、黑胶唱片架与 3D 书架（在 03 号工单中实现）。
