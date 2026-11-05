<div align="center">
<img src="assets/hero.png" alt="xh-blog-workflow: 1:1 瑞士纸墨精工质感个人品牌博客工作流" width="100%"/>
</div>

# xh-blog-workflow

*Deterministic 1:1 Swiss Paper-and-Ink Personal Brand Blog Production System.*

**面向个人创作者的高保真纸墨质感博客生产体系：1:1母版复刻、49个K代码哈希锁、变量动态热插拔与全自动验收流水线。**

[中文](README.md) · [English](README_EN.md)

[![CI](https://github.com/Dragon-01-you/xh-blog-workflow/actions/workflows/ci.yml/badge.svg)](https://github.com/Dragon-01-you/xh-blog-workflow/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-68%2F68%20passing-brightgreen.svg)](https://github.com/Dragon-01-you/xh-blog-workflow/actions)
[![Node](https://img.shields.io/badge/node-%3E%3D20-green.svg)](https://nodejs.org)
[![Next.js](https://img.shields.io/badge/Next.js-15.3-black.svg)](https://nextjs.org)
[![Tailwind](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com)
[![Stars](https://img.shields.io/github/stars/Dragon-01-you/xh-blog-workflow?style=social)](https://github.com/Dragon-01-you/xh-blog-workflow)

---

> [!IMPORTANT]
> **设计起源与致谢 (Design Heritage & Attribution)**
> 本项目的底层视觉设计、排版美学与微交互母版源自 **[Cali Castle](https://cali.so)** 开源的经典项目 **[CaliCastle/cali.so](https://github.com/CaliCastle/cali.so)** v3。我们对 Cali Castle 的卓越设计深表敬意与诚挚致谢！
> **xh-blog-workflow** 并非简单的 Fork，而是在此杰出母版的基础上，独立研发了一套工程化的**「K代码冷冻锁 + V槽位热插拔 + 自动化验证」**生产系统，解决开发者和创作者在复刻大师级网站时"一改就崩、动画断裂、无法持续迭代"的根本痛点。

---

## 这是什么（说人话）

很多人想拥有一个像大师作品般充满艺术感、纸墨温润质感的个人官网，但往往面临两大困境：
- **普通模板质感廉价**：千篇一律的卡片阴影和工业风，缺乏呼吸感与品牌辨识度；
- **大师代码难以驾驭**：直接改动母版源码时，极易因触碰复杂的 Tailwind v4 样式表、WebGPU 着色器或弹簧物理曲线而导致整体崩塌。

**xh-blog-workflow** 是一套严谨的博客工业化交付方案：给它你的个人资料、原创文章与照片，它在**零污染、零降级、完全保护底层 49 个核心工程模块**的前提下，产出一个可直接上线的 1:1 瑞士纸墨精工个人品牌站点。

### 它能回答 N 个问题

| # | 创作者关心的核心问题 | xh-blog-workflow 怎么回答与保障 |
|:---:|---|---|
| 1 | 我想把内容换成自己的，会不会改坏别人的精致排版和动画？ | **绝对不会**。通过 `.kernel-lock.json` 对 49 个 K 代码文件加盖 SHA-256 哈希锁，任何核心篡改都会立刻阻断构建。 |
| 2 | 我的微信公众号长文和原创图文怎么无缝接入？ | 内置全真 MDX 内容流水线，支持 1200×675 题图、阅读时长计算、代码高亮与动态 Slug 路由。 |
| 3 | 如果我想换回原色头像或添加新的项目卡片，需要改几处？ | 变量完全抽离至 8 组 V 槽位（`.slots.json` 与 `lib/` 配置文件），单点替换，全站毫秒级热生效。 |
| 4 | 网站改完后，怎么确保上线前没有任何暗坑和断裂？ | 内置 68 个 Vitest 单元测试、TypeScript 5.8 严格检查、22 条路由 SSG 全量静态编译与公开发现校验。 |
| 5 | 我以后如果想尝试更激进的大改动，改崩了能退回来吗？ | 原生支持 `xh-blog snapshot`，自动生成带语义标签的 Git 快照，随时一键无损回滚。 |

---

## 30 秒演示

![demo](assets/demo.gif)

> 💡 **真实运行录屏**：上图为基于 **xh-blog-workflow** 交付的「瑞士纸墨精工质感」个人品牌站点真实交互录屏演示。完整呈现了 Swiss 级微交互动效：精工 Hero 排版、黑胶留声机唱片架流光、3D 立体抽书书架、全自适应底栏 Dock 与全真暗黑模式切换。
> 
> 📹 亦可查看全清录屏视频源文件：[`assets/demo.mp4`](assets/demo.mp4)。

---

## 目录

- [这是什么（说人话）](#这是什么说人话)
- [30 秒演示](#30-秒演示)
- [快速开始](#快速开始)
- [工作原理与架构](#工作原理与架构)
- [核心技术实现与规格事实表](#核心技术实现与规格事实表)
- [对比同类项目](#对比同类项目)
- [真实实战案例：芯火个人品牌站](#真实实战案例芯火个人品牌站)
- [常见问题 (FAQ)](#常见问题-faq)
- [路线图](#路线图)
- [参与贡献](#参与贡献)

---

## 快速开始

### 环境要求

| 依赖项 | 最低版本要求 | 推荐版本 | 用途说明 |
|---|---|---|---|
| **Node.js** | ≥ 20.10.0 | 20.18.0 LTS | Next.js 15.3 运行时 |
| **pnpm** | ≥ 9.0.0 | 10.5.2 | 包依赖管理 |
| **Python** | ≥ 3.10 | 3.11 / 3.12 | xh-blog CLI 与工程哈希校验 |
| **Git** | ≥ 2.30 | 最新版 | 提交历史追溯与快照打标 |

### 三步上手

```bash
# 1. 克隆本仓库并安装依赖
git clone https://github.com/Dragon-01-you/xh-blog-workflow.git
cd xh-blog-workflow
pnpm install

# 2. 生成本地沙盒环境变量（自动从 .env.example 生成安全的 .env.local）
# macOS / Linux:
chmod +x .agents/setup.sh && .agents/setup.sh
# Windows PowerShell:
.\.agents\setup.ps1

# 验证核心完整性、换人门禁与可定制槽位
pnpm doctor
python scripts/xh_blog_cli.py verify-kernel
python scripts/xh_blog_cli.py inspect-slots

# 3. 启动本地高保真预览
pnpm dev
# 浏览器打开 http://localhost:3000 即可探索
```

> [!CAUTION]
> ### ⚠️ 常用命令与生产构建防坑提示 (Breaking Prevention)
> 每次修改代码、更换槽位变量（如个人介绍、相册、文章）后，若要使用生产预览模式（`pnpm start`），**必须先重新执行 `pnpm build`！**
> ```bash
> pnpm build && pnpm start --port 3000
> ```
> 若在修改代码后直接运行 `pnpm start`，Next.js 会继续读取旧的打包产物，导致客户端加载时 chunk 哈希不匹配报 404 错误。本地开发调试推荐直接使用 `pnpm dev`（自带实时 HMR 热更新）。

### 站长控制台与日常更新同步指引 (Admin & Daily Sync)

- **线上运维控制台**：浏览器直接访问 [`/admin`](http://localhost:3000/admin)（受安全口令保护，默认口令可在 `.env.local` 中通过 `NEXT_PUBLIC_ADMIN_PASSWORD` 自定义）。包含全站指标巡检大盘、在线槽位极速编辑台与日常同步流程指引。
- **日常维护与发布全指南**：发新文章怎么发？修改个人资料怎么生效？如何通过 GitOps 自动同步推送到线上公网？请查阅官方手册：👉 [**`docs/DAILY_UPDATE_AND_SYNC_GUIDE.md`**](docs/DAILY_UPDATE_AND_SYNC_GUIDE.md)。

### 纯静态本地可视配置面板 (Interactive Slot Panel)

为了让不熟悉 TypeScript 代码的创作者能够直观配置，本项目内置了单文件纯静态可视化配置面板：
- **面板入口**：直接双击在浏览器中打开 [`docs/slot-config-panel.html`](docs/slot-config-panel.html)
- **核心特性**：
  - **城市与经纬度速选**：内置 20+ 全球核心城市（北京/上海/深圳/东京/纽约/伦敦/费城等），一键自动填充时区与坐标印章；
  - **多形态弹性渠道矩阵**：自由增删微信、小红书、抖音、B站、Substack、播客、X、GitHub 等任意渠道；
  - **实时数据校验与导出**：一键生成符合规范的 TypeScript 配置文件与体检通过指令。

### 进阶槽位管理与快照归档

```bash
# 导出当前槽位配置 JSON
python scripts/xh_blog_cli.py inspect-slots --output .scratch/my-slots.json
```

```bash
# 完成定制后固化沉淀为 Git 语义快照
python scripts/xh_blog_cli.py snapshot --tag v1.0.0-my-brand
```

### 图片资产目录对照表 (Asset Directory Mapping)

站点的图片资产分为 7 类，存放于 `public/images/` 与 `content/blog/` 中。替换为创作者自己的资产时，请对照下表放置：

| 资产类型 | 存放物理路径 | 尺寸/比例推荐 | 用途与关联槽位 |
|---|---|---|---|
| **品牌头像/IP标** | `public/images/avatar.png` | 1:1 正方形 (建议 ≥ 512×512) | 微信弹窗、底栏 Favicon、邮件印章 (`lib/personal.ts`) |
| **明亮主肖像** | `public/images/headshot.jpg` | 3:4 或 1:1 竖构图 (≥ 800×1066) | 首页明亮模式主写真 (`lib/personal.ts`) |
| **暗色方肖像** | `public/images/portrait-square.jpg` | 1:1 正方形 (≥ 800×800) | 首页暗黑半色调网点着色器 (`components/halftone-portrait.tsx`) |
| **公众号二维码** | `public/images/wechat-qr.jpg` | 1:1 正方形 (≥ 400×400) | 社交卡片与底栏微信弹窗 (`components/social-cards.tsx`) |
| **书籍封面库** | `public/images/books/<name>.jpg` | 3:4 经典书封比例 | 3D 立体抽书架封面 (`lib/personal.ts` -> `books`) |
| **黑胶唱片封套** | `public/images/records/<name>.jpg` | 1:1 正方形封套 | 黑胶唱片架封套与旋转光影 (`lib/personal.ts` -> `records`) |
| **影廊胶片照片** | `public/images/photos/<name>.jpg` | 原图高保真 (支持横竖构图) | 胶片影廊墙暗房展示与首页扇形门卡 (`lib/photos.ts`) |
| **文章封面题图** | `content/blog/<slug>/cover.jpg` | 16:9 比例 (推荐 1200×675) | 博客文章封面、OG 社交流水线图片 (`content/blog/`) |

> 📖 **完整槽位字典**：详细的字段定义、类型与展示位置请参阅 [动态 V 槽位全景数据字典 (docs/SLOTS_DICTIONARY.md)](docs/SLOTS_DICTIONARY.md)。


---

## 工作原理与架构

<div align="center">
<img src="assets/how_it_works.png" alt="xh-blog-workflow 3 层生产流水线架构图" width="88%"/>
</div>

**xh-blog-workflow** 采用 3 级渐进式能力分层架构：

| 生产阶段 | 核心机制 | 承载文件 | 输出标准 |
|---|---|---|---|
| **第 1 层：K 代码冷冻内核** | SHA-256 离线哈希锁，严格锁定底层视觉系统 | `globals.css` (6,972行)、WebGPU 着色器、底栏弹簧动画、半色调肖像核心组件 | 49 个关键文件零修改（哈希比对通过） |
| **第 2 层：V 槽位动态热插拔** | 纯数据驱动，仅通过配置表与媒体库注入品牌资产 | `.slots.json`、`lib/personal.ts`、`lib/projects.ts`、`lib/channels.ts`、`content/blog/`、`public/images/` | 零代码污染，个人信息与文章即时替换 |
| **第 3 层：确定性自动化验收** | 多维工程防线，杜绝任何未检出的断裂代码入库 | Vitest 单元测试、TypeScript 严格模式、Next.js 15.3 SSG、`xh_doctor.mjs` 硬门禁 | 68/68 测试全绿，22 静态路由零 404，doctor 零阻塞 |

### 三档权责分层模型 (Three Responsibility Tiers)

在换人或定制过程中，遵循**「改动会不会破坏母版质感或验收不变量」**唯一准则：

```
┌─────────────────────────────────────────────────────────────┐
│ 第 ① 档 · 必须固定（K 代码内核，49 个文件 SHA-256 锁定）       │
│ 瑞士纸墨样式表(6,972行) / WebGPU 着色器 / 半色调肖像着色逻辑 │
│ 底栏弹簧阻尼模型 / 路由骨架 / 卫生不变量（禁止 href="#" 死链）│
├─────────────────────────────────────────────────────────────┤
│ 第 ② 档 · 中性弹性（默认随模板，可换可不换）                 │
│ 17 个通用渠道矢量图标库 / UI 界面标签 / 量化指标开关        │
│ 26 周热力图开启状态 / 页脚版权年份（系统时钟 vs 固定历史年） │
├─────────────────────────────────────────────────────────────┤
│ 第 ③ 档 · 必须本人提供（缺了将被 doctor 门禁刚性拦截）       │
│ 中英文姓名 / 身份宣言 / 城市坐标 / 真实渠道链接或二维码图    │
│ 真实履历时间轴（严禁编造）/ 原创文章（≥2个二级标题+1200x675封面）│
└─────────────────────────────────────────────────────────────┘
```

### 关键节点主动截停与人机确认机制 (Interception Gates)

为了防止 AI 凭空编造虚假信息或静默造假，流水线设计了 **4 个强制主动截停确认点**：

1. **Gate 1：身份与城市截停 (Identity & City Gate)**
   - **拦截条件**：`brandConfig.name`、`enName`、`tagline`、`location` 为空；
   - **向用户索要**：对外真实姓名、一句话定位宣言、常驻城市（或从 20 个预置城市中选取）；
   - **应对降级**：英文名缺失时可自动采用拼音或 handle，经纬度由城市预设库自动补全。
2. **Gate 2：渠道形态与资产截停 (Channel Matrix Gate)**
   - **拦截条件**：声明了平台却既无完整链接又无二维码图，或出现 `href="#"` 占位符；
   - **向用户索要**：该平台是「外跳网页（给完整 https://）」还是「弹窗二维码（上传真实图片到 `public/images/`）」；
   - **应对降级**：若创作者没有某些平台，**必须显式写入 `disabledChannels`**，底栏弹窗按钮整枚隐藏，决不渲染死链。
3. **Gate 3：长文规范与出处截停 (Article Structure Gate)**
   - **拦截条件**：文章正文少于 2 个 `## ` 二级标题，或缺少 1200×675 题图；
   - **向用户索要**：正文结构补充与题图文件；对于历史/学术/考据类文章，文末需附「本篇底本与引文出处」段落；
   - **应对降级**：无题图时阻断发布，杜绝线上文章卡片裂图。
4. **Gate 4：体检门禁与模板残留截停 (Doctor Gate)**
   - **拦截条件**：代码中仍残留原作者指纹（「芯火」「Xinhuo」「Dragon-01-you」等）且未在 `.doctor-allow.json` 中登记者；
   - **向用户索要**：确认是否属于有意保留的母版开源致谢；若属于致谢，登记入白名单；若属于未替换的硬编码，立即替换。

---

## 核心技术实现与规格事实表

| 技术指标 | 规格参数 | 行业对比与优势 |
|---|---|---|
| **前端框架** | Next.js 15.3.3 + React 19 + App Router | 最新生产级架构，全站静态站点生成 (SSG) |
| **样式体系** | Tailwind CSS v4 + 瑞士纸墨 6,972 行精工微调 | Windows 兼容 `@source` 优化，无缝响应式网格 |
| **动效与微交互** | Framer Motion + 自定义弹簧阻尼模型 | 视差滚动、Bottom Dock 磁吸悬浮、物理回弹 |
| **着色器渲染** | WebGPU Shader 字段 (Ink/Portrait/Blueprint) | 软硬件级光影渐变，GPU 硬件加速且优雅降级 |
| **半色调肖像** | Halftone Shader Print + 真实肖像双向切换 | 点击即时在瑞士古典网点印刷与原色写真之间无缝穿梭 |
| **单元测试套件** | Vitest 3.0 + @testing-library/react | 覆盖核心微交互组件与工具函数，68 项测试秒级完成 |
| **路由与页面量** | 22 条 SSG 静态路由完全独立预渲染 | 首页、长文库、文章详情、开源项目、胶片影廊、管理后台 |

---

## 对比同类项目

| 维度 | 直接手动 Fork (普通开发者做法) | 通用博客模板 (如 Astro/Vercel Template) | **xh-blog-workflow (本项目)** |
|---|---|---|---|
| **视觉品质** | 极易改坏复杂 CSS，丢失微妙质感 | 样式扁平通用，缺乏独特性与文化厚度 | **1:1 完整保留瑞士纸墨、网点着色器与纸质阴影** |
| **修改安全感** | 提心吊胆，改动一个 `div` 崩三个页面 | 虽容易改动，但无法防范误删 | **49 个 K 代码 SHA-256 刚性锁死，任何污染秒级拦截** |
| **变量管理** | 散落在数十个 `.tsx` 文件中搜索替换 | 大多仅支持简单 `config.json` | **8 大维度严密插槽体系 (`.slots.json`)，支持 AI 辅助提取** |
| **验证与回滚** | 无自动化测试，纯肉眼排查 | 通常仅有简单的 ESLint 校验 | **68 个单元测试 + 22 路由 SSG 编译 + 一键语义快照** |
| **致谢与规范** | 经常遮掩来源或被误当纯原创 | 开源协议模糊 | **完全透明公开致谢 Cali Castle，合规且受人尊敬** |

---

## 真实实战对标：多人物落地视觉图鉴 (Visual Persona Showcase)

> 🖼️ **真实截图视觉呈现**：本项目拒绝“纯文本自吹”，以下呈现母版（芯火）与公版历史人物（本杰明·富兰克林）在实际换血中生成的真实全屏/局部视觉截图。完整实测图集与更多人物请参阅专用图鉴文档：👉 [**`docs/SHOWCASE.md`**](docs/SHOWCASE.md)。

### 案例 1：公版历史学者与博学家 · 本杰明·富兰克林 (Benjamin Franklin)
> **测试环境与规格**：18 世纪历史人物，无微信/小红书/GitHub，仅有出版物与手信信箱。49 个 K-code 文件零篡改，68 项单测全绿，SSG 22 路由静态编译通过。

<div align="center">
  <img src="assets/cases/franklin/02-home-channels.png" alt="富兰克林首屏联系方式由渠道矩阵拼接" width="48%"/>
  <img src="assets/cases/franklin/03-dock-stamp-modal.png" alt="底栏《公报》印记浮层弹出" width="48%"/>
</div>
<div align="center">
  <p><em>左：首屏联系方式由通用渠道矩阵自动拼接，无任何失真；右：底栏点击呼出 1729 年《公报》订阅印记半调网点浮层</em></p>
</div>

<div align="center">
  <img src="assets/cases/franklin/05-doctor-check-passed.png" alt="富兰克林通过 pnpm doctor 综合体检" width="48%"/>
  <img src="assets/cases/franklin/06-footer-no-deadlinks.png" alt="富兰克林页脚彻底解耦零死链" width="48%"/>
</div>
<div align="center">
  <p><em>左：运行 pnpm run doctor 验证 0 违规、0 模板残留；右：页脚彻底解耦，富兰克林无任何现代自媒体残留，无 # 死链</em></p>
</div>

---

### 案例 2：现代青年技术博主 · 芯火 (Xinhuo · 母版基线)
> **测试环境与规格**：07 年大专大二学生 · AI 自学与个人成长赛道。经典瑞士报纸排版、半调网点肖像、实时物理弹簧微交互。

<div align="center">
  <img src="assets/cases/xinhuo/01-home-light.png" alt="芯火首页瑞士纸墨亮色质感" width="48%"/>
  <img src="assets/cases/xinhuo/02-home-dark.png" alt="芯火首页沉浸暗黑极客模式" width="48%"/>
</div>
<div align="center">
  <p><em>左：瑞士纸墨微交互日间模式；右：OLED 级真黑 WebGPU 半色调网点夜间模式</em></p>
</div>

<div align="center">
  <img src="assets/cases/xinhuo/03-blog-list.png" alt="长文博客矩阵与动态年份归档" width="48%"/>
  <img src="assets/cases/xinhuo/05-projects-grid.png" alt="精选代表作项目网格" width="48%"/>
</div>
<div align="center">
  <p><em>左：8 篇原创长文按年份动态归档与阅读时长计算；右：精选代表作项目卡片与 GitHub 热度矩阵</em></p>
</div>

---

### 案例 3 & 4：极简先驱 史蒂夫·乔布斯 & 系统工程师 陈拾光
- **乔布斯 (Steve Jobs · 1984)**：以 Cupertino 为坐标印章，1984 Macintosh 黑白写真，禁用微信与小红书，启用官方档案馆与个人邮件，极简无死链。
- **陈拾光 (Shiguang Chen)**：以杭州为坐标，启用 GitHub 26 周实时绿格 Contribution Graph，极客架构长文，相册空数组时优雅呈现暗房整理中。

> 📖 **盲测准备就绪？** 如果你是准备进行全自主测试的独立智能体或测试者，请直接阅读：  
> 👉 [**`docs/AUTONOMOUS_EXECUTION_GUIDE.md`（0 提示词盲测标准规约）**](docs/AUTONOMOUS_EXECUTION_GUIDE.md)  
> 👉 [**`.slots.example.json`（多人物预置配置字典）**](.slots.example.json)


---

## 常见问题 (FAQ)

<details>
<summary>Q1: 如果我不小心改动了 K 代码文件怎么办？</summary>

在执行构建或提交前运行：
```bash
python scripts/xh_blog_cli.py verify-kernel
```
CLI 会明确指出被篡改的文件名称与当前哈希值。你可以直接用 `git checkout -- <file>` 恢复该文件，重新确保底层稳定。
</details>

<details>
<summary>Q2: 为什么坚持使用双语 README 与 GEO (llms.txt)？</summary>

因为我们希望全球开发者和 AI 搜索助手（如 ChatGPT、Claude、Perplexity）都能精准检索、阅读并引用这个项目，同时让全球社区看清中国年轻一代开发者严谨、规范且尊重原创的技术风貌。
</details>

<details>
<summary>Q3: 我可以添加新的页面或扩展组件吗？</summary>

当然可以！**xh-blog-workflow** 采用 3 级渐进定制模型：
- **低定制化模式**：仅替换 8 组 V 槽位，秒级生成 1:1 纸墨个人博客；
- **扩展定制化模式**：在 `app/` 下新增独立路由或在 `components/` 增加外围业务模块，只要不破坏 49 个 K 代码核心体系，流水线依然为你提供完整的测试与构建护航。
</details>

<details>
<summary>Q4: 为什么所有的提交作者都是 Dragon-01-you？</summary>

本项目的所有工程流水线重构、Tailwind v4 适配、哈希锁系统、测试用例编写与品牌注入均由维护者 **Dragon-01-you** 独立完成并统一数字签名归属，杜绝任何历史遗留昵称干扰。
</details>

<details>
<summary>Q5: 如果我确实需要微调某个 K 代码文件，如何允许校验通过？</summary>

你可以通过 CLI 传入 `--allow-modified <file>` 参数来显式声明允许放行该文件：
```bash
python scripts/xh_blog_cli.py verify-kernel --allow-modified components/social-cards.tsx
```
如果确定你的修改应当成为新的基线，可以在修改后使用 Python 脚本重新计算 LF 标准化 SHA-256 并更新 `.kernel-lock.json`。
</details>

<details>
<summary>Q6: 首页三扇门里的“相册”卡片小图是如何展示的？</summary>

首页导航卡片 (`components/nav-cards.tsx`) 的预览小图已完全与 `lib/photos.ts` 动态打通。系统会自动提取 `photos` 数组中的前 3 张照片作为扇形展示；当相册为空或图片数量较少时，会自动平滑降级，无需手动改动组件代码。
</details>

<details>
<summary>Q7: 运行 pnpm install 时提示 "ignored build scripts: sharp, esbuild" 或建议运行 pnpm approve-builds，需要处理吗？</summary>

可以安全忽略。Next.js 15 内部自带跨平台 WASM 图像处理回退，本地开发与自动化测试均无需手动编译底层原生脚本；CI 与生产环境部署时 Next.js 也会自动处理 sharp 依赖。
</details>

---

## 路线图

- [x] 1:1 瑞士纸墨经典设计与 6,972 行 `globals.css` 深度适配
- [x] 49 个核心 K 代码工程文件 SHA-256 哈希防线锁定
- [x] 8 组 V 槽位动态热插拔与元数据规范设计
- [x] 68/68 Vitest 单元测试覆盖
- [x] 双语文档、CI 矩阵与全套开源社区规范文件配置
- [x] 原色童年 IP 统一品牌标与双轨肖像着色器交互
- [ ] 针对非技术创作者的 Web 端交互式插槽配置面板
- [ ] 一键导出 Vercel / Cloudflare Pages 部署自动化脚本

---

## 参与贡献

我们非常欢迎社区开发者参与贡献！在提交 PR 前，请务必阅读我们的 [参与贡献指南 (CONTRIBUTING.md)](CONTRIBUTING.md) 与 [行为准则 (CODE_OF_CONDUCT.md)](CODE_OF_CONDUCT.md)。

---

## 许可协议

本项目基于 [MIT 协议](LICENSE) 开源。底层视觉交互设计归属于原作者 [Cali Castle](https://github.com/CaliCastle/cali.so)；工程化工作流流水线与 K-code 锁体系由 [Dragon-01-you](https://github.com/Dragon-01-you) 创作维护。
