# 06: 本地免密后台 `/admin` 与全套公开检索基础设施 (Local Admin & Public Discovery Routes)

**Status:** Done
**Blocked by:** 03-home-experience-vinyl-and-bookshelf.md, 04-blog-pipeline-dither-cover-and-minimap.md, 05-projects-and-photos-gallery.md

## Goal

实现本地免密直进的 `/admin` 概览后台（展示文章、书籍、黑胶唱片与照片统计，彻底移除账号密码/OAuth/数据库拦截），并补齐 `/sitemap.xml`、`/robots.txt`、`/feed.xml`、`/og`、`/llms.txt`、`/manifest.webmanifest` 及 `pnpm verify:public-discovery` 自动化门禁脚本。

## Acceptance Criteria

- [x] `/admin` 页面无需任何密码或环境变量即可在本地直接打开，实时汇总展示 `lib/content.ts` 与 `lib/personal.ts` 中的文章、书架、唱片与相册条目。
- [x] 实现 `/sitemap.xml`、`/robots.txt`、`/feed.xml`、`/og`、`/llms.txt`、`/manifest.webmanifest` 路由，所有品牌名统一为「芯火」。
- [x] `pnpm test`、`pnpm typecheck`、`pnpm build` 与 `pnpm verify:public-discovery` 全部零错误通过。

## Test Cases

- **Happy path:** 请求 `/admin` 视图，断言无登录重定向且直接渲染统计面板。（已通过 `tests/unit/projects-photos-discovery.test.tsx` 验证）
- **Happy path:** 运行 `pnpm verify:public-discovery`，断言 `/sitemap.xml`、`/feed.xml`、`/llms.txt` 均包含 4 篇核心文章与「芯火」站点信息。（已通过 `scripts/verify-public-discovery.mjs` 验证）

## Out of Scope

- 评论系统、线上数据库、第三方鉴权服务。
