# 深度复盘反思与「可插拔个人资产槽位规范」(1:1 复刻 Cali.so 基准)

> 记录时间：2026-11-03
> 核心原则：**「先 1:1 像素级与源码级复刻（抄），再通过唯一个人资产配置层换血（操），绝不擅自重写组件、绝不捏造虚假履历与内容」**。

---

## 一、 深度反思：为什么上一版会出现「形似神散」与「内容失真」？

通过对标源码库 [`ref-repos/cali.so`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/ref-repos/cali.so) 与当前 [`site-2`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/site-2) 的逐行比对，根本原因在于此前子智能体犯了两个工程大忌：
1. **没有直接复用原版源码与完整样式表，而是“看图手写简化版组件”**：原版 `app/globals.css` 高达 **6,972 行**，配合 `shaders/react` WebGPU 着色器实现极其细腻的纸张、墨迹、蓝图与弹簧微交互；而 `site-2` 仅保留了约 1,950 行 CSS，且子智能体自行臆造了简化的 React 组件。
2. **在缺乏核实的情况下擅自填塞“占位假数据”**：把知识库中拆解的对标案例（“姜胡说”的 4 篇文章）当成了「芯火」本人的原创文章；未去读取 [`02-资产/公众号发布库`](file:///e:/芯火知识库/芯火知识库/个人知识库/02-资产/公众号发布库) 与 GitHub [`Dragon-01-you`](https://github.com/Dragon-01-you) 的真实仓库，甚至凭空捏造了 2022–2024 年的工作履历。

### 逐项病灶拆解与原版真相对照

| 序号 | 你指出的问题 | 之前做错的原因（病灶） | `cali.so` 原版源码真相 & 修正方案 |
| :--- | :--- | :--- | :--- |
| **1** | **文章/项目/相册三页缺失原版交互** | 子智能体删掉了 WebGPU 着色器背景与焦点列表样式，只写了普通静态列表。 | - **写作页 (`/blog`)**：原版使用 [`WritingInkStage`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/ref-repos/cali.so/components/hidden-list-stage.tsx) + [`WritingInkField`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/ref-repos/cali.so/components/writing-ink-field.tsx)（`shaders/react` 的 `Strands` 墨丝流体着色器 + `.focus-list` 悬停聚光灯压暗兄弟项 + `.print-pile` 纸张叠放微动效）。<br>- **项目页 (`/projects`)**：原版使用 [`ProjectsBlueprintStage`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/ref-repos/cali.so/components/hidden-list-stage.tsx) + [`ProjectsBlueprintField`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/ref-repos/cali.so/components/projects-blueprint-field.tsx)（`FlowField` + `Grid` 蓝图着色器 + `.projects-registration-mark` 十字准星自动滑向当前悬停的项目图标）。 |
| **2** | **首屏人像点出奇怪的圆形与 `01-05` 按钮** | 子智能体在 [`portrait-hidden-stage.tsx`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/site-2/components/portrait-hidden-stage.tsx) 里自己编造了 `STAGE_LAYERS`（5 组高透明度同心圆 SVG + 切换按钮），点击还把头像往右下角推移。 | 原版 [`portrait-hidden-stage.tsx`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/ref-repos/cali.so/components/portrait-hidden-stage.tsx) + [`portrait-shader-field.tsx`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/ref-repos/cali.so/components/portrait-shader-field.tsx) 背后是极克制的 `opacity: 0.1` WebGPU `ContourLines` + `PerlinNoise` 等高线纹理场（带柔和径向遮罩，无任何数字按钮或怪异大圆圈）。 |
| **3** | **首屏头像点击应像文章封面一样还原真实原图** | 之前做成了位移偏转，没有理解你要的是「半调网点 ↔ 真实原图」的显影交互。 | 将文章封面 [`DitherVeil`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/ref-repos/cali.so/components/dither-veil.tsx) 的显影机制合入首屏 [`HalftonePortrait`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/site-2/components/halftone-portrait.tsx)：默认展示瑞士报纸半调网点人像，**点击头像即丝滑消融网点、100% 还原你的彩色真实原图**，再次点击恢复网点印刷质感。 |
| **4** | **首屏自我介绍缺少文字跳动与精致小图标动效** | [`home-introduction.tsx`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/site-2/components/home-introduction.tsx) 被写成了死板的纯文本 `<span>`。 | 1:1 迁回原版 [`home-introduction.tsx`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/ref-repos/cali.so/components/home-introduction.tsx) 与 [`home-intro-replay.tsx`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/ref-repos/cali.so/components/home-intro-replay.tsx)：<br>- 身份词带动态闪烁星芒与笔记本开合 SVG (`DesignEngineerMark`)；<br>- 理念词带环绕星轨 (`DetailsMark`) + 逐字弹簧波浪跳动 (`<span className="home-detail-unit">`)，点击可重播入场动效。 |
| **5** | **相册 (`/photos`) 交互不对，且塞了无用照片** | 子智能体画蛇添足加了红色分类按钮和框内说明字，还把非成果照片塞进了相册。 | 1:1 恢复原版 [`published-photo-wall.tsx`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/ref-repos/cali.so/components/published-photo-wall.tsx) + [`zoom-image.tsx`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/ref-repos/cali.so/components/zoom-image.tsx)（纯粹拍立得微倾角 `--img-tilt`、暗房校准角标 `.calibration-corners`、点击 FLIP 放大灯箱 + 底部渐显参数铭牌 `spec-plate`）。**同时立即清空现有杂乱照片**，支持优雅空状态，后续仅放入你精选的真实作品成果。 |
| **6** | **经历时间造假（出现 2022、2023 年）** | 子智能体照搬模板年份编造了虚假履历。 | 你是 **07 年生（来自07年的芯火）**，**2025 年**进入江西工业工程职业技术学院网安专业、开启 GitHub 与公众号并交付学校数据活名片，**2026 年**构建 AI 全栈工作流与开源工具矩阵。时间轴严格锁定在 **2025 – 2026** 真实区间。 |
| **7** | **公众号/小报童乱跳转、GitHub 缺乏深度卡片、邮箱乱填** | 之前没有移植 [`social-cards.tsx`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/ref-repos/cali.so/components/social-cards.tsx) 和 [`lib/social-live.ts`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/ref-repos/cali.so/lib/social-live.ts)，链接写死了假地址或 `#`。 | 1:1 还原 [`social-cards.tsx`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/ref-repos/cali.so/components/social-cards.tsx) 全部悬停实体卡片：<br>- **GitHub (`Dragon-01-you`)**：悬停弹出 **26周×7天真实贡献热力图**（实时拉取你过去一年 `150+` 次贡献网格与 Star 数），点击直达仓库页；<br>- **邮箱 (`you19827801947@qq.com`)**：悬停弹出带邮票与邮戳的**实体航空信封卡片 (`email-envelope-card`)**；<br>- **小红书**：悬停弹出小红书名片，点击直达 `https://xhslink.cn/o/74Svva7m0kZ`；<br>- **公众号 (`来自07年的芯火`)**：不设外链死跳，悬停/点击直接弹出你的**真实公众号二维码卡片 (`/images/wechat-qr.jpg`)**；<br>- **小报童**：当前无链接，仅展示文字或标记「筹备中」，绝不触发无效跳转。 |
| **8** | **把「姜胡说」的文章当成你的原创，项目列表造假** | 混淆了对标拆解素材与个人真实资产。 | - **文章**：彻底删除 4 篇「姜胡说」文章，100% 替换为你在 [`02-资产/公众号发布库`](file:///e:/芯火知识库/芯火知识库/个人知识库/02-资产/公众号发布库) 中亲笔撰写的 **8 篇真实原创文章**。<br>- **项目**：彻底删除编造项目，100% 替换为你 GitHub (`Dragon-01-you`) 上的 **7 个真实开源项目与实战工程**。 |
| **9** | **底部 Dock 栏与浏览器小图标直接塞了真人照片** | 原版 `/images/avatar.png` 是极简黑白线条符号，塞入真人抠图在 28px 圆框里显得局促违和。 | **双轨视觉规范**：首屏大图用你的真人照片生成半调网点 + 点击还原真彩；**底部 Dock 栏与网页 Favicon 专用你的专属品牌 Logo 图标**（等你发给我后立即接入）。 |

---

## 二、 核实入库的「芯火」100% 真实个人资产清单

### 1. 真实原创文章库（源自 `02-资产/公众号发布库`，共 8 篇）
1. **`2026-11-02`**：《停更两个月后，我想明白了一件事》
2. **`2026-10-25`**：《一句话将任何概念可视化》
3. **`2026-10-21`**：《顶尖的开发者在出题，而我们只是在答卷》
4. **`2026-10-17`**：《vibecoding 做出来了，却卡在部署？个人开发者该怎么选，一次讲清》
5. **`2026-06-15`**：《本周复盘：从工具测评到「AI 全栈工作流」的底层重构》
6. **`2026-04-08`**：《大一网安新生亲测｜小白零踩坑！5个100%合法本地练手靶场》
7. **`2026-04-03`**：《昨晚通宵搞定了Kali Linux，我用宿舍大白话把渗透测试讲透了》
8. **`2025-10-26`**：《我花了3周，给母校做了套数据活名片：把枯燥数字变成招生王牌》

### 2. 真实 GitHub 项目库（源自 `https://github.com/Dragon-01-you`）
1. **`xh-ai-fullstack-workflow`** (★1) — 芯火 XH · AI 全栈工作流：先搭环境，再出考卷，再让 AI 答卷。
2. **`xh-forensics`** (★2, TypeScript) — AI 中转站 API 验真取证工具：模型验真 · 系统提示词提取 · 上下游供应链溯源。
3. **`lesson-plan-skill`** (★4, Python) — AI-Powered Lesson Plan Generator for Claude Code | 智能教案生成器（5分钟生成完整教案）。
4. **`storage-analyzer`** (★2, Python) — Windows 磁盘清理工具 | 96个内置清理器 | 4层置信度系统 | 相似文件检测 | 数据迁移。
5. **`tool-fabric`** (★1, Python) — Universal tool adapter layer for AI agents — 一行代码连接任意工具，节省 60%+ Token。
6. **`MimoMeter`** (★1, JavaScript) — Local API usage monitor for MiMo Token Plan。
7. **`学校信息库与数据活名片`** (`2025.10`) — 为母校（江西工业工程职业技术学院）打造的招生与就业数据可视化名片系统。

### 3. 真实个人履历时间线（2025 – 2026）
- **`2026 — 现在`**：**芯火个人知识库 & AI 全栈工作流** · 独立开发者 / 创作者（构建 `xh-ai-fullstack-workflow`、`xh-forensics`、`lesson-plan-skill` 等开源工具矩阵，主理公众号「来自07年的芯火」）。
- **`2025 — 现在`**：**江西工业工程职业技术学院** · 网络安全专业（2025 级大一新生，独立开发母校「数据活名片」可视化系统，深耕 Web 安全渗透测试与 Agent 工程化）。

---

## 三、 流程沉淀：「可插拔个人资产槽位表」(Pluggable Personal Asset Schema)

为了让这套网站工作流成为真正可复用的标准化资产（当你分享给别人或新建站点时，对方只需填一张表，无需碰任何底层 Shaders 与 CSS），我们将全站可替换内容收敛为 **6 大标准槽位 (`site.config.ts`)**：

| 槽位分组 | 字段名称 | 说明与自适应规则 | 「芯火」当前配置值 |
| :--- | :--- | :--- | :--- |
| **1. 身份与双轨视觉槽** | `name` / `enName` | 站点主理人中英文名 | `芯火` / `Xinhuo` |
| | `brandLogo` | **底部 Dock 栏与浏览器 Favicon 专用图标**（黑白/单色符号最佳） | *待接入你发送的专属图标* |
| | `portrait.original` | **首屏人像真彩原图**（用于自动生成半调网点 + 点击还原真彩原图） | `/images/headshot.jpg` |
| | `location` / `coords` | 城市与经纬度印章 | `中国 · 江西` / `27.63° N, 113.85° E` |
| **2. 首屏动态宣言槽** | `rolePhrase` | 带闪烁星芒与笔记本动效的定位短语 (`DesignEngineerPhrase`) | `AI 全栈构建者` |
| | `craftPhrase` | 带环绕星轨与逐字弹簧跳动的匠心短语 (`DetailsPhrase`) | `刚刚好` |
| | `introParagraphs` | 首屏三段式个人自述 | 07年网安新生 × AI 全栈工作流探索 |
| **3. 社交与触达槽**<br>*(按需自适应显隐)* | `github` | 填用户名自动拉取 **26周×7天贡献热力图 + Star 数**；为空则隐藏 | `Dragon-01-you` |
| | `email` | 填邮箱自动生成**实体邮票航空信封悬停卡**；为空则隐藏 | `you19827801947@qq.com` |
| | `xiaohongshu` | 填链接自动生成**小红书悬停名片**并支持外跳；为空则隐藏 | `https://xhslink.cn/o/74Svva7m0kZ` |
| | `wechatOfficial` | 填公众号名 + 二维码路径，**点击/悬停直接弹出二维码卡片**（不外跳） | `来自07年的芯火` + `/images/wechat-qr.jpg` |
| | `xiaobaotong` | 填 URL 则可跳转；**URL 为空时仅显示文字（无跳转箭头、不点死链）** | `{ label: "小报童", url: null }` |
| | `x` / `youtube` / `bilibili` | 其他可选平台：**未配置时自动从页面与页脚移除，绝不留假链接** | `null`（自动隐藏） |
| **4. 真实履历槽** | `experience[]` | 真实时间段 (`period`)、角色 (`role`)、机构/项目 (`company`) | 严格对应 `2025–现在`、`2026–现在` |
| **5. 原创内容与项目槽** | `content/blog/*.mdx` | 100% 个人原创文章（自动统计字数、阅读时长、半调封面显影） | 公众号发布库 8 篇真实原创 |
| | `projects[]` | 真实开源仓库或线上产品（接入蓝图准星悬停场） | GitHub 7 个真实项目 |
| **6. 成果画廊与品味槽** | `photos[]` | 作品成果/实证影像墙（为空时展示暗房空状态，绝不塞无关照片） | `[]`（先清空，按你精选再上架） |
| | `records[]` / `books[]` | 留声机黑胶唱机与书架藏书 | 可选配置 |

---

## 四、 下一步隔离执行规划（3 个独立子智能体并行批次）

等你确认上述复盘并把**专属网站图标（Logo）**发给我后，我将严格通过 **`invoke_subagent` 派发 3 个独立子智能体**（绝不在主会话里直接堆砌改代码）：

1. **子智能体 A（原版视觉、6972行 CSS 与 WebGPU 着色器 1:1 还原专家）**
   - 将 [`ref-repos/cali.so/app/globals.css`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/ref-repos/cali.so/app/globals.css) 完整迁移至 `site-2`；
   - 1:1 移植 [`portrait-hidden-stage.tsx`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/ref-repos/cali.so/components/portrait-hidden-stage.tsx)、[`portrait-shader-field.tsx`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/ref-repos/cali.so/components/portrait-shader-field.tsx)（消灭奇怪的同心圆与 01-05 按钮，恢复原版细腻等高线场），并为 [`HalftonePortrait`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/site-2/components/halftone-portrait.tsx) 加上**点击消融网点、100% 还原彩色真实原图**的交互；
   - 1:1 移植写作页 [`WritingInkStage`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/ref-repos/cali.so/components/hidden-list-stage.tsx) + [`WritingInkField`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/ref-repos/cali.so/components/writing-ink-field.tsx)、项目页 [`ProjectsBlueprintStage`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/ref-repos/cali.so/components/hidden-list-stage.tsx) + [`ProjectsBlueprintField`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/ref-repos/cali.so/components/projects-blueprint-field.tsx)、相册页 [`PublishedPhotoWall`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/ref-repos/cali.so/components/published-photo-wall.tsx)（去掉红框分类按钮，恢复纯粹拍立得灯箱）。
2. **子智能体 B（首屏微交互、社交深度悬停卡片与 Dock 图标专家）**
   - 1:1 移植 [`home-introduction.tsx`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/ref-repos/cali.so/components/home-introduction.tsx) 与 [`home-intro-replay.tsx`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/ref-repos/cali.so/components/home-intro-replay.tsx)（恢复笔记本星芒 SVG 与「刚刚好」逐字弹簧跳动）；
   - 1:1 移植 [`social-cards.tsx`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/ref-repos/cali.so/components/social-cards.tsx) 与 [`lib/social-live.ts`](file:///e:/芯火知识库/芯火知识库/个人知识库/01-当前任务/网站设计工作流/ref-repos/cali.so/lib/social-live.ts)：接入 `Dragon-01-you` 实时 **26周×7天 GitHub 贡献热力图卡片**、`you19827801947@qq.com` **实体航空信封卡片**、**小红书跳转名片**、**公众号二维码弹窗卡片 (`/images/wechat-qr.jpg`)**，并将「小报童」设为无跳转纯文本状态；
   - 将你发送的专属网站图标接入底部 Dock 栏与浏览器 Favicon。
3. **子智能体 C（100% 真实内容换血与可插拔配置收敛专家）**
   - 删除 4 篇「姜胡说」文章，将你 [`02-资产/公众号发布库`](file:///e:/芯火知识库/芯火知识库/个人知识库/02-资产/公众号发布库) 中的 **8 篇真实原创文章**完整迁入 `site-2/content/blog/` 并生成对应封面；
   - 将 `Dragon-01-you` 的 **7 个真实 GitHub 仓库与母校数据活名片项目**写入项目库；
   - 将经历时间轴修正为真实的 **2025 – 2026**；
   - 清空 `/photos` 中的杂乱照片，收敛出统一的 `lib/site-config.ts` 可插拔个人资产配置文件，跑通全量测试与生产构建。
