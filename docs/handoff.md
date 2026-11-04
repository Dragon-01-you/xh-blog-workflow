# site-2 交接班记录本（`handoff.md`）

> **通俗解释**：`handoff` 的中文意思就是**「交接班记录本」**。每次你关掉聊天窗口、或者换一个新窗口让 AI 继续干活时，AI 只要读一下这个本子，就能立刻知道上次干到哪了、接下来该干哪一步，永远不会断片失忆。

---

## 一、当前进度（现在干到哪了？）

- **项目目标**：从 0 搭建「芯火」个人品牌博客（`site-2`），第一遍严格按标杆项目 `cali.so` 的套路 **1:1 照做跑通**。
- **已完成步骤**：
  - ✅ **第 1 步：项目初始化设置（`setup`）**——已经建好了工地总规矩（[`AGENTS.md`](../AGENTS.md)）、本交接班记录本（[`docs/handoff.md`](./handoff.md)）和工单规则（[`docs/agents/`](./agents/)）。
  - ✅ **第 2 步：搭建本地免密码练习场（沙盒环境）**——已生成环境变量模板（[`.env.example`](../.env.example)）、一键注入安全假密码脚本（[`.agents/setup.ps1`](../.agents/setup.ps1) / [`.env.local`](../.env.local)）、零件采购清单（[`package.json`](../package.json)）、全站安全头与打包配置（[`next.config.ts`](../next.config.ts)、[`lib/security/headers.ts`](../lib/security/headers.ts)），并通过了 [`lib/next-config.test.ts`](../lib/next-config.test.ts) 的 4 项自动验电测试。
  - ✅ **第 3 步：定业务规矩与技术拍板备忘录（`ADR` + `spec` 自动规划书）**——已生成中文版业务黑话统一词典（[`GLOSSARY.md`](../GLOSSARY.md)）、5 份对标 `cali.so` 的技术拍板备忘录（[`docs/adr/0001`~`0005`](./adr/)）以及自动规划需求书（[`.scratch/blog-v1/spec.md`](../.scratch/blog-v1/spec.md)）。
  - ✅ **第 4 步：锁定视觉原型说明书与两阶段策略（`design-language.md` + `v2-iteration-backlog.md`）**——已严格锁定：**第一遍（「抄+操」）1:1 保持 `cali.so` 原版外部框架、底部导航与底部书籍数据区不变，仅替换芯火真实头像（[`headshot.jpg`](../public/images/headshot.jpg)）、黑白人像海报（[`portrait-poster.png`](../public/images/portrait-poster.png)）、真实公众号文章与作品素材**；同时将「黑白人像×巨字丰碑、小报童网页版宽幅双栏叠加、交互式技能卡抽屉（方案二）」存入 [`docs/v2-iteration-backlog.md`](./v2-iteration-backlog.md) 供第一遍跑通后单变量迭代。
- **接下来按顺序要做的步骤（待办队列）**：
  1. ⏳ **第 5 步：拆施工小工单（`tickets`）并逐单写代码与测试（`TDD`）**——做出首页、镇店文章页、真实公众号作品集页、极简站长巡检台，以及全自动发报单（`RSS`）、搜索引擎地图（`SEO`）、微信分享海报（`OG`）和给大模型看的名片（`llms.txt`）；
  2. ⏳ **第 6 步：独立监理查代码（`Code Review`）与真浏览器总验收**。

---

## 二、常用检查命令（怎么检查网站好没好？）

```bash
pnpm install                  # 安装零件包
pnpm dev                      # 在本地启动网站预览

pnpm typecheck                # 检查代码有没有拼写和类型低级错误
pnpm test:unit                # 跑自动验电器（单元测试）
pnpm build                    # 正式打包测试
pnpm verify:public-discovery  # 自动检查 SEO、RSS 订阅单、微信海报尺寸对不对
pnpm test:browser             # 打开真实浏览器自动点一遍网站
```

---

## 三、防踩坑红线（绝对不能犯的错）

1. **第一遍先 1:1 照做，不乱加戏**：在第一遍完整跑通前，严格照着标杆博客的结构做，不中途乱塞重型 3D 游戏特效。
2. **商业防泄密红线**：「项目作品（`/projects`）」页面只展示你做出的惊艳结果和指标，绝不把你用来卖钱的内部制作秘方公开出去。
3. **诚实汇报红线**：没跑过的测试一律标为「未验证」，绝不允许 AI 没跑测试就撒谎说“检查通过”。
