---
name: xh-blog-workflow
description: >-
  End-to-end automated workflow for cloning, hot-swapping, and verifying a 1:1
  Swiss Paper-and-Ink personal brand blog based on the Xinhuo master template.
  Enforces strict ordering: environment and directory bootstrap, SHA-256 K-code
  kernel lock, interactive V-slot variable grilling, spec and ticket generation,
  isolated subagent TDD execution, two-axis code review, and git snapshot tagging.
---

# XH-Blog-Workflow (芯火全栈网站热插拔生产工作流 · V1 低定制 1:1 复刻版)

## Overview

`xh-blog-workflow` 将「芯火」经过实战验证的个人品牌站（基于 `cali.so` 6,972 行 CSS 与 WebGPU 着色器底盘）封装为一套**零走样、按序推进、自动盘问变量的标准化生产工作流**。

它直接内化并定制了 Matt Pocock 的工程链条（环境建制 → 沙箱点火 → 轮次盘问与领域建模 → 生成 `spec.md` 总考卷 → 拆分垂直槽位工单并贴 5 大分诊标签 → 独立子智能体 TDD 施工 → 双轴代码审查与真机快照定格），无需用户手动记忆或逐个触发被禁用的斜杠命令。

核心设计哲学：**锁死固定 K 代码（Kernel），只向用户盘问并热插拔动态 V 槽位（Variables），确保任何人使用本工作流复刻出的效果与母版 100% 一致，绝不让 AI 重新手写简化组件。**

## Dependencies

本工作流内化并协同以下已安装的技能（执行对应阶段时自动遵循其规范）：

- `grilling` & `domain-modeling`：用于在 Stage 3 主动向用户发起轮次式变量采访，并同步沉淀 `GLOSSARY.md` 与 `docs/adr/`。
- `tdd`：用于在 Stage 6 指导子智能体在预设公共接缝（Seam）上执行「红 → 绿」测试驱动换血。
- `code-review`：用于在 Stage 7 派发两个并行子智能体分别执行 **Standards（规范与 K 代码零篡改审查）** 与 **Spec（需求与真机视觉还原审查）**。

## Quick Start

当用户说「用 `xh-blog-workflow` 帮我做一个个人网站」或「按芯火博客工作流初始化新站点」时，严格按以下顺序启动 Stage 1：

```bash
uv run C:/Users/ASUS/.gemini/config/skills/xh-blog-workflow/scripts/xh_blog_cli.py bootstrap \
  --target-dir "./my-brand-site" \
  --output "./my-brand-site/.scratch/bootstrap-report.json"
```

## Utility Scripts

本技能自带确定性防呆 CLI 脚本 `scripts/xh_blog_cli.py`（所有输出均写入 `--output` 指定的文件，避免刷屏污染上下文）：

### 1. `bootstrap` — 环境检测、目录初始化与 K 代码哈希加锁
检查本地 `node`、`pnpm`、`git` 环境；若目标目录为空，自动从黄金母版（`site-2`）拷入完整代码，初始化 Git、`.env.local`、`.scratch/blog-v1/issues/`、`AGENTS.md` 与 `docs/agents/`，并对全部固定 K 代码生成 `.kernel-lock.json`（SHA-256 指纹锁）。

```bash
uv run C:/Users/ASUS/.gemini/config/skills/xh-blog-workflow/scripts/xh_blog_cli.py bootstrap \
  --target-dir "<目标项目路径>" \
  --output "<目标项目路径>/.scratch/bootstrap-report.json"
```

### 2. `inspect-slots` — 扫描 8 大动态 V 槽位并生成待提问清单
扫描当前项目中的可定制槽位（身份、头像、导语、社交卡、履历、文章、项目、书架与黑胶），输出结构化 JSON 供 AI 在 Stage 3 向用户提问。

```bash
uv run C:/Users/ASUS/.gemini/config/skills/xh-blog-workflow/scripts/xh_blog_cli.py inspect-slots \
  --project-dir "<目标项目路径>" \
  --output "<目标项目路径>/.scratch/slots-inspection.json"
```

### 3. `verify-kernel` — 校验 K 代码零篡改与动态槽位图片完整性
在子智能体完成槽位换血后运行，校验 `app/globals.css`（6,972行）与 `components/*` 是否被篡改，并检查所有配置的本地图片路径是否真实存在。

```bash
uv run C:/Users/ASUS/.gemini/config/skills/xh-blog-workflow/scripts/xh_blog_cli.py verify-kernel \
  --project-dir "<目标项目路径>" \
  --output "<目标项目路径>/.scratch/verify-kernel-report.json"
```

### 4. `snapshot` — 定格里程碑 Git 标签与真机截图归档
在全量测试与真机截图通过后，自动提交代码、打下带注释的 Git 标签（如 `v1.0.0-snapshot-cao2`），并准备 `snapshots/<tag>/` 归档目录。

```bash
uv run C:/Users/ASUS/.gemini/config/skills/xh-blog-workflow/scripts/xh_blog_cli.py snapshot \
  --project-dir "<目标项目路径>" \
  --tag "v1.0.0-snapshot-cao2" \
  --message "完成 1:1 复刻与真实个人资产换血" \
  --output "<目标项目路径>/.scratch/snapshot-report.json"
```

---

## Workflow (严格按序执行的 7 大阶段)

> [!IMPORTANT]
> **严禁跳步或打乱顺序！** 绝不允许在一开始还没检查环境、还没初始化目录和启动沙箱时就去问用户需求。必须严格按 Stage 1 → Stage 7 顺序执行。

### Stage 1: 环境自检、目录初始化与工程规矩建制 (Environment & Repo Bootstrap)
- **固定不变量 (Fixed)**：Node.js / pnpm / Git 基础依赖；`AGENTS.md`、`docs/handoff.md`、`docs/agents/issue-tracker.md`、`docs/agents/triage-labels.md`（5 大状态标签：`needs-triage`、`needs-info`、`ready-for-agent`、`ready-for-human`、`wontfix`）、`docs/agents/domain.md`。
- **变量 (Variable)**：目标项目文件夹路径（`--target-dir`）、工单存放方式（默认本地 `.scratch/blog-v1/issues/`）。
- **AI 自动执行**：
  1. 运行 `xh_blog_cli.py bootstrap` 完成环境检测、母版拷入、Git 初始化、`.env.local` 创建与 `.kernel-lock.json` K 代码哈希加锁。
  2. 阅读项目根目录下的 `AGENTS.md` 与 `docs/handoff.md`。
- **人工确认**：若目标目录非空，由用户确认直接在当前目录进行还是新建目录。

### Stage 2: K 代码物理锁死与沙箱常驻点火 (Kernel Lock & Sandbox Boot)
- **固定不变量 (Fixed)**：全部 K 代码（`app/globals.css` 6,972 行、WebGPU 着色器、半调网点与点击显影原图、弹簧动效、路由结构）。
- **变量 (Variable)**：本地预览端口号（默认 `3000`）。
- **AI 自动执行**：
  1. 若 `node_modules` 不存在，运行 `pnpm install`。
  2. 在后台以常驻模式（Daemon）启动预览服务器（`pnpm dev --port 3000` 或 `pnpm start --port 3000`）。
  3. 确认 `http://localhost:3000` 正常响应后，告知用户沙箱已点火就绪。
- **人工确认**：用户可在浏览器打开 `http://localhost:3000` 看到母版初始运行效果。

### Stage 3: 主动提问采集 8 大动态 V 槽位与领域建模 (Interactive Grilling & Domain Modeling)
- **固定不变量 (Fixed)**：8 大槽位的数据契约（Schema）与自适应显隐逻辑。
- **变量 (Variable)**：用户的个人真实资产（有则填、支持自由增删数量、没有的平台或暂缺的素材自动隐藏或占位）。
- **AI 自动执行**：
  1. 运行 `xh_blog_cli.py inspect-slots` 获取当前槽位状态。
  2. **主动发起轮次式盘问**（内化 `grilling` 技能格式 `❓ Q1 ... ➡️ 推荐方案`，每次只问 3~4 个问题，分 2 轮问完 8 大槽位）：
     - **第 1 轮（身份、头像图标与社交触达）**：
       - **槽位 1（身份与坐标）**：品牌名/署名、英文名、所在城市与经纬度？
       - **槽位 2（双轨图像）**：① 首屏人像照片（亮色 `headshot.jpg` / 暗色 `portrait-square.jpg`，默认报纸网点 + 点击还原真彩原图）；② 底部 Dock 栏与网页 Favicon 专属小图标（`avatar.png`，默认使用原色高清圆形头像）？
       - **槽位 3（首屏宣言）**：身份短语（带动态笔记本星芒 SVG）、匠心短语（带逐字弹簧跳动，如「刚刚好」）、3~4 段个人简介？
       - **槽位 4（社交卡片自适应槽）**：哪些平台要展示？（`GitHub` 填用户名自动出 26 周热力图；`邮箱` 填地址自动出贴票航空信封；`公众号` 提供二维码图 `wechat-qr.jpg` 点击直接弹窗不外跳；`小红书` 填链接直跳；`小报童` 若暂无链接自动渲染为「筹备中」纯文本或直接不展示；**没有的平台如推特/油管一律不展示，绝不硬切**）。
     - **第 2 轮（履历、原创文章、代表作与战绩书架/唱片）**：
       - **槽位 5（真实履历 `experiences`）**：真实的起始年份、阶段角色与经历描述？（严禁编造年份）
       - **槽位 6（原创文章 `content/blog/`）**：放入哪几篇本人原创文章？（支持任意篇数，提供 Markdown 原文与配图即可，绝不混入他人文章）
       - **槽位 7（代表作项目 `projects` 与相册 `photos`）**：展示哪几个真实 GitHub/实战项目？相册是否有精选成果图？（若暂无则设为空数组 `[]`，优雅展示暗房空状态）
       - **槽位 8（3D 书架/战绩书 `books` 与黑胶唱片 `records`）**：是否要增删或替换几本「战绩书/珍藏书」或「常听唱片」？（支持自由增删数量，用户只需提供名称、跳转链接和封面图；若暂不提供则保留默认精选占位）。
  3. 根据用户回答，同步更新 `GLOSSARY.md`（写入品牌词铁律）与 `docs/adr/`，生成《真实个人变量核验表》。
- **人工确认**：用户回答问题、上传头像/二维码/文章素材，并确认《真实个人变量核验表》无误。

### Stage 4: 合成热插拔总考卷 (Spec Synthesis - 内化 `/to-spec`)
- **固定不变量 (Fixed)**：规格书标准模板（Problem Statement、Solution、User Stories、Implementation Decisions、Testing Seams、Out of Scope）。
- **变量 (Variable)**：Stage 3 锁定的用户真实资产清单。
- **AI 自动执行**：
  1. 将确认后的变量合成为 `.scratch/blog-v1/spec.md`，贴上 `ready-for-agent` 标签。
  2. 明确锁定三大测试接缝（Seam）：① K 代码哈希零篡改；② 个人数据与本地图片/文章文件 100% 真实存在；③ 全路由 SSG 编译与公开检索路由（`/sitemap.xml`、`/feed.xml`、`/llms.txt`）正常。
- **人工确认**：向用户展示 `spec.md` 摘要。

### Stage 5: 拆分垂直槽位工单并分诊贴标签 (Slot Ticketing & Triage - 内化 `/to-tickets` & `/triage`)
- **固定不变量 (Fixed)**：**严禁按 UI 组件拆工单**（防止子智能体重写组件），固定按数据槽位拆分为 3 张标准工单：
  - `01-identity-avatar-and-social-slots.md`（身份、双轨头像图标、首屏导语、社交卡片与真实履历换血）
  - `02-original-blog-articles-and-covers.md`（本人原创文章 MDX 转换、1200×675 封面与视图过渡映射换血）
  - `03-projects-bookshelf-vinyl-and-photos.md`（真实项目、3D 书架/战绩书、黑胶唱片与相册画廊换血）
- **变量 (Variable)**：每张工单的具体验收数据条目，以及工单的状态标签（素材齐全贴 `ready-for-agent`；用户暂缺某项素材贴 `needs-info` 并做安全占位）。
- **AI 自动执行**：在 `.scratch/blog-v1/issues/` 下生成 3 张工单文件并向用户汇报分诊状态。
- **人工确认**：确认工单拆分与标签状态，批准启动子智能体施工。

### Stage 6: 派发独立子智能体隔离 TDD 施工 (Isolated Subagent TDD Execution)
- **固定不变量 (Fixed)**：主会话零代码污染原则；TDD「先红后绿」规则；K 代码只读禁令。
- **变量 (Variable)**：4 个动态 V 槽位目录/文件中的数据更新。
- **AI 自动执行**：
  1. 主智能体调用 `invoke_subagent` 派发独立子智能体（Subagents）并行执行 `ready-for-agent` 工单。
  2. 子智能体先更新 `tests/unit/` 中的预期断言（红灯），再修改 `lib/personal.ts`、`lib/projects.ts`、`lib/photos.ts`、`content/blog/` 与 `public/images/` 让测试变绿（`pnpm test` & `pnpm typecheck` & `pnpm build`）。
  3. 主智能体运行 `xh_blog_cli.py verify-kernel` 校验 K 代码哈希未受损且所有图片路径有效。
- **人工确认**：无需人工写代码，等待子智能体完工汇报。

### Stage 7: 双轴审查、真机截图与版本快照沉淀 (Dual Review & Snapshot Lock)
- **固定不变量 (Fixed)**：Standards + Spec 双轴独立审查门禁；全页面真机截图脚本 `scripts/take-screenshots.mjs`；Git Tag 快照格式。
- **变量 (Variable)**：快照标签名（如 `v1.0.0-snapshot-cao2`）与用户的最终视觉微调意见。
- **AI 自动执行**：
  1. 派发两个只读子智能体并行执行 `code-review`（**Standards 审查员**检查 K 代码锁与代码规范；**Spec 审查员**对照 `spec.md` 检查每项个人资产是否准确落地）。
  2. 重启生产预览服务并运行 `node scripts/take-screenshots.mjs`，生成首页（亮/暗）、文章页、项目页、相册页与 Dock 栏实机截图。
  3. 运行 `xh_blog_cli.py snapshot` 打下 Git 里程碑标签，并将截图归档至 `snapshots/<tag>/`，更新 `docs/handoff.md`。
- **人工确认**：用户查看真机截图与 `http://localhost:3000` 实机效果，验收通过后定格为可随时回退的基线版本。

---

## Common Mistakes

1. **未配环境先问需求**：跳过 Stage 1 & 2 直接向用户提问，导致连目录和沙箱都没跑起来，顺序混乱。**必须先跑 `bootstrap` 和沙箱点火，再进入 Stage 3 提问。**
2. **让子智能体重写 K 代码组件**：在工单里要求子智能体“实现某组件”或“修改 `globals.css`”，导致丢失原版 6,972 行 CSS 或 WebGPU 着色器。**第一套工作流严禁触碰 K 代码，结束后必须跑 `verify-kernel` 校验哈希。**
3. **硬塞用户没有的平台或编造假数据**：当用户没有小报童链接、没有推特或未提供某年履历时，AI 擅自填 `#` 死链或编造 2022–2023 假年份。**必须严格遵循“有则填、无则隐藏或纯文本占位、书架/文章/项目数量弹性适配”原则。**
