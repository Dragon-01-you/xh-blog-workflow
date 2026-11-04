# 01: 全局纸墨壳层、底部胶囊导航与瑞士网格底栏 (Global Shell, Bottom Dock & Swiss Colophon)

**Status:** Done
**Blocked by:** None

## Goal

复刻 `cali.so` 的完整全局纸墨壳层（暖白纸张 `#f7f4ed` / 碳黑底色 `#0a0a0a` + 细网格噪点 `AmbientBackground`）、底部悬浮胶囊导航栏（`BottomDock`：含「芯火」草字头印记、首页/文章/项目/相册路由、昼夜圆形扩散切换、中英切换 `<T>`、Web Audio 机械音效开关）以及底部瑞士网格版权底栏（`Footer` + `FooterClock` 实时秒针时钟 + 社交悬浮预览卡）。

## Acceptance Criteria

- [x] 1:1 复刻 `app/globals.css`、`app/layout.tsx`、`components/ambient-background.tsx` 的纸墨双色主题变量、字体层级与细网格背景。
- [x] 1:1 复刻 `components/bottom-dock.tsx`，左侧印记展示「芯火」（草字头 `芯`），支持 `/`、`/blog`、`/projects`、`/photos` 路由高亮、昼夜切换（`ViewTransition` 圆形扩散）、语言切换（`<T>`）与音效开关（`lib/sound.ts`）。
- [x] 1:1 复刻 `components/footer.tsx` 与 `components/footer-clock.tsx`，底部展示「芯火」签名、实时跳动时钟与社交链接悬浮预览卡（`components/social-preview-card.tsx`）。

## Test Cases

- **Happy path:** 渲染全局壳层与 `BottomDock`，断言包含「芯火」标识及 4 个主导航入口（首页、文章、项目、相册），不含任何“星火”错别字。
- **Happy path:** 切换昼夜主题或语言状态时，`ThemeProvider` 与 `LanguageProvider` 正确更新 `document.documentElement` 属性与 `<T>` 渲染文本。
- **Edge case:** 在不支持 `document.startViewTransition` 的环境下点击主题切换按钮，依然能无报错直接完成亮/暗色切换。

## Out of Scope

- 首页半色调人像、黑胶唱片架、3D 书架与具体文章详情页（在后续 02–05 号工单中实现）。
