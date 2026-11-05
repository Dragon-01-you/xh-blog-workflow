# 全自主换血执行指南 · 0 提示词盲测标准规约
# Autonomous Persona Swapping Guide (Zero-Prompt Protocol)

> **适用场景**：面向**完全不给额外提示、不进行人工干预的独立 AI 智能体或盲测工程师**。  
> 只要拿到一个全新的人物资料包，即可根据本规约 100% 自主完成「全站数据与素材热插拔」，全流程零代码污染、零 K-lock 损毁、全量门禁 100% 绿灯通过。

---

## 一、 核心铁律（违反任何一条即判定失败）

1. **不可变 K 代码禁令 (Kernel Invariance)**：  
   `.kernel-lock.json` 中的 49 个内核文件受 SHA-256 哈希锁保护（涵盖 `app/globals.css` 6,972 行样式、WebGPU 着色器、底栏弹簧动画等）。**严禁修改任何锁内文件**！所有定制只在 V 槽位完成。
2. **零死链与真实渠道原则 (Zero Dead Links)**：  
   若被测人物没有微信公众号、推特或小红书，**严禁填入 `#` 或虚假链接**。通过 `lib/channels.ts` 的弹性渠道矩阵管理，缺失项将自动优雅剪裁。
3. **严禁破坏公共接缝 (Public Seams)**：  
   `lib/personal.ts`、`lib/projects.ts`、`lib/photos.ts` 导出的接口类型（TypeScript Interface）不可删除必填字段；文章 MDX 正文必须包含至少 2 个二级标题（`##`）以支持瑞士刻度尺微缩目录渲染。

---

## 二、 确定性 6 步自主执行流水线

```
┌────────────────────────────────────────────────────────┐
│ 步骤 1: 环境建制与内核锁死 (Bootstrap & Kernel Lock)  │
│ 步骤 2: 启动沙箱常驻点火 (Sandbox Boot)                │
│ 步骤 3: 槽位映射与素材导入 (Slot Mapping & Assets)    │
│ 步骤 4: 运行前置综合体检仪 (pnpm run doctor 自愈闭环)  │
│ 步骤 5: 运行 6 维自动化门禁全量验证 (Verification)     │
│ 步骤 6: Git 语义快照沉淀与离场 (Snapshot & Release)   │
└────────────────────────────────────────────────────────┘
```

### 步骤 1: 环境建制与内核锁死 (Bootstrap & Kernel Lock)

```bash
# 1.1 安装依赖
pnpm install

# 1.2 生成安全的本地环境变量配置（根据系统选择）
# Windows PowerShell:
.\.agents\setup.ps1
# Linux / macOS:
chmod +x .agents/setup.sh && .agents/setup.sh

# 1.3 校验 49 个 K-code 文件指纹未受损
python tests/test_smoke.py
```
> **通过标准**：`All smoke tests passed (4/4)`。

---

### 步骤 2: 启动沙箱常驻点火 (Sandbox Boot)

在本地后台启动开发服务器（用于实时预览和静态页面生成）：
```bash
pnpm dev --port 3000
```
> **通过标准**：终端输出 `Ready in xxxms`，浏览器访问 `http://localhost:3000` 返回 200 OK。

---

### 步骤 3: 槽位映射与素材导入 (Slot Mapping & Assets)

将新人物的资料精准映射到以下 4 个数据文件与素材目录：

#### 3.1 基础资料与渠道矩阵 (`lib/personal.ts`)
```typescript
export const brandConfig: BrandConfig = {
  name: '人物中文名',
  enName: 'English Name',
  tagline: '一句话身份标签（如：系统工程师 · 开源信徒）',
  taglineEn: 'English Tagline',
  bio: '核心自述 Bio 第一段...',
  bioEn: 'English Bio...',
  heroIntroZh: '首页 Hero 栏目导语...',
  heroIntroEn: 'Hero Intro in English...',
  avatar: '/images/avatar.png',
  headshotLight: '/images/headshot.jpg',
  headshotDark: '/images/portrait-square.jpg',
  poster: '/images/portrait-poster.png',
  location: '所在城市（如：Hangzhou, China）',
  locationCoordinates: {
    lat: '30.2741° N',
    lng: '120.1551° E',
  },
}
```

#### 3.2 渠道弹性配置 (`lib/channels.ts`)
在 `defaultChannels` 中填入人物真实存在的渠道。**没有的渠道直接注释或删除，绝对不写 `#`**：
```typescript
export const defaultChannels: ChannelConfig[] = [
  {
    id: 'github',
    kind: 'github-heatmap',
    labelZh: '代码仓库',
    labelEn: 'GitHub',
    url: 'https://github.com/your-username',
    handle: 'your-username',
    account: 'your-username',
    surface: ['home', 'footer', 'social-page'],
  },
  {
    id: 'email',
    kind: 'email',
    labelZh: '电子邮件',
    labelEn: 'Email',
    url: 'mailto:your@email.com',
    handle: 'your@email.com',
    surface: ['home', 'footer'],
  },
]
```

#### 3.3 静态图片素材放置 (`public/images/`)
按规范放入被测人物的图像：
- `public/images/avatar.png`：高清原色正方形头像（用于 Dock 栏小图标、微信弹窗、邮件印章）。
- `public/images/headshot.jpg`：日间明亮模式主肖像照片。
- `public/images/portrait-square.jpg`：夜间模式半调网点着色器主肖像照片。
- `public/images/wechat-qr.jpg`：（可选）若有微信公众号则放二维码图；若无则无需放置，系统自适应隐藏。

#### 3.4 原创文章放置 (`content/blog/<slug>/index.mdx`)
- 至少保留或新建 **2 篇以上** MDX 文章；
- 每篇文章 Frontmatter 必须包含：`title`、`description`、`publishedAt`、`image`；
- 文章正文中必须包含 **至少 2 个二级标题 (`##`)**，以便生成文章侧边刻度尺微缩导航。

#### 3.5 代表作与书架 (`lib/projects.ts` & `lib/personal.ts` -> `books`)
- `lib/projects.ts` 填入真实项目，每个项目包含 `title`、`description`、`href`、`icon`；
- `lib/personal.ts` 的 `books` 填入真实阅读或推荐书目，封面图对应放入 `public/images/books/`。

---

### 步骤 4: 运行前置综合体检仪 (pnpm run doctor 自愈闭环)

在进行任何构建和测试之前，先运行全站体检：
```bash
pnpm run doctor
```

#### 💡 自愈排障字典：
| 体检报错信息 | 根因说明 | 立即修复动作 (Self-Healing Action) |
|---|---|---|
| `MISSING_FIELD: brandConfig.name is empty` | 缺少中文品牌名 | 在 `lib/personal.ts` 中补齐 `name` 字段 |
| `TEMPLATE_RESIDUE: contains z-library` | 书籍链接残留非官方盗版库链接 | 将链接替换为豆瓣官方地址（`https://book.douban.com/subject/...`） |
| `TEMPLATE_RESIDUE: contains you19827801947` | 残留母版测试邮箱 | 替换为被测人物的真实邮箱或公开邮件 |
| `MISSING_ASSET: public/images/xxx.jpg not found` | 图片路径配置了但文件不存在 | 将对应图片放入 `public/images/` 或修正路径 |
| `ARTICLE_HEADINGS: article has < 2 headings` | 文章二级标题少于 2 个导致大纲崩塌 | 在对应 MDX 文章中增加至少 2 个 `## 小标题` |

> **通过标准**：终端输出 `✅ doctor 通过：品牌「xxx」... 无缺项、无模板残留`，退出码为 0。

---

### 步骤 5: 运行 6 维自动化门禁全量验证

自主执行以下 5 项流水线命令（全部必须 100% 退出码为 0）：

```bash
# 5.1 49 个 K-code 文件物理锁校验
python tests/test_smoke.py

# 5.2 TypeScript 严格类型检查
pnpm exec tsc --noEmit

# 5.3 68 项单元与集成契约测试
pnpm test

# 5.4 公开发现网关协议校验 (Sitemap / RSS / llms.txt)
pnpm verify:public-discovery

# 5.5 全站生产 SSG 静态编译 (生成 22 条静态路由)
pnpm build
```

> **通过标准**：
> 1. Smoke test: `All smoke tests passed (4/4)`
> 2. TypeScript: `0 errors`
> 3. Vitest: `8 passed (8), 68 passed (68)`
> 4. Verify discovery: `🎉 Public Discovery Gateway Verification Passed with 100% success!`
> 5. Build: `Generating static pages (22/22) ✓`

---

### 步骤 6: Git 语义快照沉淀与离场

在全量验证通过后，将成果固化为 Git 里程碑快照：
```bash
python scripts/xh_blog_cli.py snapshot \
  --tag "v1.0.0-snapshot-new-persona" \
  --message "完成新人物全槽位热插拔与全量门禁验收"
```

最后启动生产服务验证实机运行：
```bash
pnpm start --port 3000
```
访问 `http://localhost:3000`，确认首页、文章页、项目页、相册页与底栏微交互正常运行，交付完成。
