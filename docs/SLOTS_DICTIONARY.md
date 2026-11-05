# xh-blog-workflow 动态 V 槽位全景数据字典 (Slots Dictionary)

> 本文档为 **xh-blog-workflow** 瑞士纸墨高保真个人博客生产系统的标准化槽位变量参考手册。  
> 通过严密的类型定义与数据与逻辑解耦，创作者可在不触碰 49 个 K 代码内核的前提下，通过修改本手册所列槽位，全真定制属于自己的个人品牌站点。

---

## 1. 槽位架构与文件分布

所有的定制化槽位均存放于以下 4 个数据文件及 2 个媒体资产目录中：

| 槽位领域 | 承载文件 / 路径 | 核心作用 |
|---|---|---|
| **品牌与个人身份** | `lib/personal.ts` | 个人中英文名称、标语、简历、坐标、社交账号、履历时间轴、黑胶唱片与书籍列表 |
| **开源与代表作** | `lib/projects.ts` | 项目卡片列表、GitHub 仓库地址、技术栈领域、图标 |
| **摄影与暗房画廊** | `lib/photos.ts` | 摄影作品元数据、EXIF 信息、尺寸与暗房展墙 |
| **原创深度长文** | `content/blog/<slug>/index.mdx` | MDX 格式长文、题图、摘要、发布日期与正文 |
| **公共图片资产** | `public/images/` | 头像、肖像、微信二维码、唱片封面、书籍封套 |
| **槽位映射元数据** | `.slots.json` | 自动化脚本、AI 助手提取与验证所需的槽位元数据注册表 |

---

## 2. 字段字典详解

### 2.1 品牌基础配置 (`BrandConfig` in `lib/personal.ts`)

| 字段名称 | 类型 | 必填 | 默认示例 | 说明与展示位置 |
|---|---|:---:|---|---|
| `name` | `string` | 是 | `'芯火'` | 中文姓名/主理人品牌名（导航、页脚、Meta、肖像舞台） |
| `enName` | `string` | 是 | `'Xinhuo'` | 英文名/拼音（Title、关于卡片） |
| `tagline` | `string` | 是 | `'07 年大二学生 ·「AI + 自学」实用主义'` | 中文品牌宣言/副标题（首页 Hero、OG Description） |
| `taglineEn` | `string` | 是 | `'College sophomore born in 2007...'` | 英文品牌宣言 |
| `bio` | `string` | 是 | `'07 年出生，大专大二在读...'` | 完整中文个人简介（关于页、页脚、llms.txt） |
| `bioEn` | `string` | 是 | `'College sophomore born in 2007...'` | 完整英文个人简介 |
| `heroIntroZh` | `string` | 否 | `'一个 07 年的大专大二学生。在这里真实记录...'` | 首页 Hero 第一段中文自我介绍（不填回退至默认） |
| `heroIntroEn` | `string` | 否 | `'a college sophomore born in 2007...'` | 首页 Hero 第一段英文自我介绍 |
| `sectionIntroBlog` | `string` | 否 | `'深度长文、AI 敏捷生产力与个人知识沉淀...'` | 写作板块 SEO 描述与导言 |
| `sectionIntroBlogEn` | `string` | 否 | `'Long-form writing, AI agility...'` | 写作板块英文导言 |
| `sectionIntroProjects` | `string` | 否 | `'从 AI 工具到独立全栈工程的真实落地...'` | 项目板块导言 |
| `sectionIntroProjectsEn` | `string` | 否 | `'Open-source tooling and production...'` | 项目板块英文导言 |
| `sectionIntroPhotos` | `string` | 否 | `'通过镜头记录的生活质感与光影印迹。'` | 摄影板块导言 |
| `sectionIntroPhotosEn` | `string` | 否 | `'Light, shadows, and moments frozen in time.'` | 摄影板块英文导言 |
| `avatar` | `string` | 是 | `'/images/avatar.png'` | 1:1 圆形品牌标（微信弹窗、底栏 Favicon） |
| `headshotLight` | `string` | 是 | `'/images/headshot.jpg'` | 明亮模式主肖像（原色写真） |
| `headshotDark` | `string` | 是 | `'/images/portrait-square.jpg'` | 暗黑模式半色调肖像着色器底图 |
| `poster` | `string` | 是 | `'/images/portrait-poster.png'` | 备用海报底图 |
| `location` | `string` | 是 | `'Hangzhou, China (UTC+8)'` | 常驻物理地理坐标 |
| `locationCoordinates`| `{ lat: string, lng: string }` | 是 | `{ lat: '30.2741° N', lng: '120.1551° E' }` | 经纬度（用于首页印章式标注） |

---

### 2.2 社交与渠道配置 (`personalInfo` in `lib/personal.ts`)

| 字段名称 | 类型 | 必填 | 默认示例 | 说明与展示位置 |
|---|---|:---:|---|---|
| `name` | `string` | 是 | `'芯火'` | 品牌/主理人名 |
| `enName` | `string` | 是 | `'Xinhuo'` | 英文名 |
| `email` | `string` | 是 | `'you19827801947@qq.com'` | 个人联络邮箱（首页邮件戳、社交卡片、后台） |
| `handle` | `string` | 是 | `'Dragon-01-you'` | 社交网名 / GitHub Handle |
| `githubUser` | `string` | 是 | `'Dragon-01-you'` | GitHub 用户名（用于抓取热力图 Contribution Graph） |
| `github` | `string` | 否 | `'https://github.com/Dragon-01-you'` | 完整 GitHub 主页 URL（若无则不渲染外链卡片） |
| `xiaoHongShu` | `string` | 否 | `'https://xhslink.cn/...'` | 小红书主页链接 |
| `xiaoBaoTong` | `string` | 否 | `''` | 小报童专栏链接（空字符串则仅字样展示，不跳转） |
| `weChatOfficial` | `string` | 否 | `'来自07年的芯火'` | 微信公众号名称（社交卡片、底栏弹窗、llms.txt） |
| `weChatOfficialQr` | `string` | 否 | `'/images/wechat-qr.jpg'` | 微信公众号关注二维码图片 |

---

### 2.3 履历时间轴 (`Experience` in `lib/personal.ts`)

`experience: Experience[]` 数组，按年份倒序排列：

| 字段名称 | 类型 | 必填 | 说明 |
|---|---|:---:|---|
| `company` | `string` | 是 | 机构/项目/公司中文名称 |
| `companyEn` | `string` | 是 | 机构/项目/公司英文名称 |
| `role` | `string` | 是 | 中文职责/阶段描述 |
| `roleEn` | `string` | 是 | 英文职责描述 |
| `from` | `number` | 是 | 起始年份（如 `2025`） |
| `to` | `number` | 否 | 结束年份（若为当前进行中则省略 `to`，系统自动显示 `Present` 绿色呼吸灯） |
| `url` | `string` | 否 | 关联成果或官网外部链接 |

---

### 2.4 黑胶唱片收藏 (`Record_` in `lib/personal.ts`)

`records: Record_[]` 数组，用于首页黑胶留声机唱片架：

| 字段名称 | 类型 | 必填 | 说明 |
|---|---|:---:|---|
| `artist` | `string` | 是 | 音乐人/乐队 |
| `album` | `string` | 是 | 专辑/单曲名称 |
| `year` | `number` | 是 | 发行年份 |
| `genre` | `string` | 是 | 音乐流派（如 `'Soundtrack'`, `'Pop'`, `'Rock'`） |
| `spineColor` | `string` | 是 | 唱片书脊 16 进制颜色（如 `'#b83b32'`） |
| `spineInk` | `string` | 是 | 唱片文字墨色（如 `'#f7f4ed'`） |
| `cover` | `string` | 是 | 唱片封套图片（如 `'/images/records/jie-yao.jpg'`，1:1 正方形） |
| `art` | `string` | 是 | 黑胶盘芯贴纸图（通常同 cover） |
| `url` | `string` | 是 | 网易云音乐/Spotify 直达播放链接 |
| `mood` | `string` | 是 | 中文心境标签（如 `'放松时听'`, `'专注时听'`） |
| `moodEn` | `string` | 是 | 英文心境标签（如 `'For Relaxation'`） |
| `comment` | `string` | 是 | 中文品味短评与推荐语 |
| `commentEn` | `string` | 是 | 英文品味短评 |

---

### 2.5 藏书书架 (`Book` in `lib/personal.ts`)

`books: Book[]` 数组，用于首页 3D 立体抽书书架：

| 字段名称 | 类型 | 必填 | 说明 |
|---|---|:---:|---|
| `title` | `string` | 是 | 书名 |
| `author` | `string` | 是 | 作者 |
| `year` | `number` | 是 | 出版/阅读年份 |
| `category` | `string` | 是 | 分类（如 `'人物传记'`, `'技术'`, `'设计'`） |
| `spineColor` | `string` | 是 | 书脊背景色（如 `'#e2e2e2'`） |
| `spineInk` | `string` | 是 | 书脊文字色（如 `'#171717'`） |
| `cover` | `string` | 是 | 封面图片（如 `'/images/books/steve-jobs.jpg'`，3:4 比例） |
| `art` | `string` | 是 | 封面纹理艺术图（通常同 cover） |
| `url` | `string` | 是 | 豆瓣读书/购买/详情直达链接 |
| `comment` | `string` | 是 | 中文阅读心得笔记 |
| `commentEn` | `string` | 是 | 英文阅读心得笔记 |
| `spineTitle` | `string` | 否 | 书脊简短印字（若书名过长可用） |
| `spineAuthor`| `string` | 否 | 书脊作者简写 |

---

### 2.6 代表项目矩阵 (`Project` in `lib/projects.ts`)

`projects: Project[]` 数组，用于 `/projects` 路由及首页项目卡片：

| 字段名称 | 类型 | 必填 | 说明 |
|---|---|:---:|---|
| `name` | `string` | 是 | 项目中文/代码库名（如 `'xh-ai-fullstack-workflow'`） |
| `nameEn` | `string` | 是 | 项目英文名称 |
| `description` | `string` | 是 | 中文功能与价值简介 |
| `descriptionEn` | `string` | 否 | 英文简介 |
| `url` | `string` | 是 | 项目官网或 GitHub 仓库地址 |
| `icon` | `string` | 是 | 32×32 或 64×64 项目图标路径（如 `'/images/projects/xh-forensics.png'`） |
| `domain` | `string` | 是 | 平台标签（如 `'github.com'`, `'vercel.app'`） |

---

### 2.7 胶片影廊画廊 (`Photo` in `lib/photos.ts`)

`photos: Photo[]` 数组，用于 `/photos` 暗房墙及首页相册扇形门：

| 字段名称 | 类型 | 必填 | 说明 |
|---|---|:---:|---|
| `id` | `string` | 是 | 唯一照片标识符（如 `'photo-01'`） |
| `title` | `string` | 是 | 照片中文标题 |
| `titleEn` | `string` | 是 | 照片英文标题 |
| `description` | `string` | 是 | 中文拍摄故事与构图意境 |
| `descriptionEn` | `string` | 否 | 英文故事说明 |
| `src` | `string` | 是 | 高清照片路径（如 `'/images/photos/hangzhou-dusk.jpg'`） |
| `width` | `number` | 是 | 原图物理像素宽度（用于 Next.js Image 防止布局抖动） |
| `height` | `number` | 是 | 原图物理像素高度 |
| `date` | `string` | 是 | 拍摄日期（格式 `'YYYY-MM-DD'`） |
| `location` | `string` | 否 | 拍摄地点（如 `'Hangzhou, West Lake'`） |
| `camera` | `string` | 否 | 相机与参数（如 `'Sony A7M4 · 35mm F1.4'`） |

---

### 2.8 原创 MDX 文章 (`content/blog/<slug>/index.mdx`)

每篇文章作为一个独立目录存放在 `content/blog/<slug>/`：
- `index.mdx`：文章主体，包含 Frontmatter 元数据与正文；
- `cover.jpg`：文章封面题图（推荐 1200×675，16:9）。

Frontmatter 字段规范：
```yaml
---
title: "文章标题"
titleEn: "Article English Title"
publishedAt: "2026-11-01"
summary: "100 字以内的精炼文章摘要，用于列表展示与 SEO。"
category: "AI 思考"
tags: ["AI", "工作流", "生产力"]
draft: false
---
```

---

## 3. 图片资产目录对照表 (Asset Directory Mapping)

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

---

## 4. 自动化验证与自检

当完成槽位替换后，只需在终端依次运行以下命令，即可完成全面自检：

```bash
# 1. 验证内核哈希防线未被破坏
python scripts/xh_blog_cli.py verify-kernel

# 2. 检查槽位变量完整性
python scripts/xh_blog_cli.py inspect-slots

# 3. 运行 68 项自动化单元测试
pnpm test

# 4. 严格 TypeScript 类型检查
pnpm exec tsc --noEmit

# 5. 全量 SSG 静态路由编译构建
pnpm build
```
全流程绿灯通过后，即可安全发布上线！
