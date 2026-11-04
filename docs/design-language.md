# 芯火个人站 V1 · 1:1 复刻 `cali.so` 视觉规范与真实内容替换总表

> **第一阶段（抄 + 操）核心铁律**：
> 1. **100% 保持 [`cali.so`](https://cali.so/) 的版式架构、组件形状、交互机关与原版温润纸墨色彩系统不变**（不在第一阶段乱改架构和配色，所有破局改动统一留到第二阶段「超」做单变量迭代）。
> 2. **100% 将里面的个人内容槽位替换成「芯火」（草字头 `芯`）的真实内容**（去掉无关的赛车图，换上你的重构人像、你的自我介绍、你的社交名片、你的公众号/小报童镇店文章、你喜欢的音乐专辑、你喜欢的书、你的真实项目）。

---

## 一、`cali.so` 原版核心机关拆解（我们 1:1 保留的「壳」）

1. **右上角双层交互人像（[`components/halftone-portrait.tsx`](../../ref-repos/cali.so/components/halftone-portrait.tsx) + [`components/portrait-hidden-stage.tsx`](../../ref-repos/cali.so/components/portrait-hidden-stage.tsx)）**
   - **上层（半调网点印章 `HalftonePortrait`）**：将方形人像采样成 `3px` 间距的 `<canvas>` 油墨圆点矩阵（浅色模式用白底正片 `headshot.jpg`，深色模式用暗底肖像 `portrait-square.jpg`）。鼠标靠近 `150px` 内圆点会轻微膨胀（`SWELL = 0.08`）并向四周推开 `3px`。
   - **下层（点击/悬停背后的「花」`PortraitHiddenStage` + `PortraitShaderField`）**：鼠标悬停或手机点击人像时，人像背后会浮现一层缓缓流动的 **5 层 Perlin 噪波有机等高线花纹场（`ContourLines` + SVG 有机花纹兜底）**。
2. **首屏左侧四段式介绍 + 悬停实物名片（[`components/home-introduction.tsx`](../../ref-repos/cali.so/components/home-introduction.tsx) + [`components/social-cards.tsx`](../../ref-repos/cali.so/components/social-cards.tsx)）**
   - 顶部名字 + 右侧 `5px` 像素簇印章（`PixelCluster`）。
   - 正文内嵌手绘 SVG 动态小图标（`设计工程师`、`刚刚好`）与悬停弹出的拟物名片（小红书卡片、GitHub 贡献热力图卡片、带邮票与邮戳的信封 Email 卡片等）。
3. **首屏下方三扇门导航卡（[`components/nav-cards.tsx`](../../ref-repos/cali.so/components/nav-cards.tsx)）**
   - `写作`（三叠手稿纸页微缩模型 + 文章数）、`照片`（三张扇形展开的拍立得相纸 + 照片数）、`项目`（工程蓝图辅助线爆炸图标 + 项目数）。
4. **`03 // 循环播放中` 黑胶唱片架（[`components/vinyl-shelf.tsx`](../../ref-repos/cali.so/components/vinyl-shelf.tsx)）**
   - 横向排列的做旧纸套黑胶唱片（带程序化折痕 `sleeveFinish` 与书脊取色），悬停或滑动时抽出展示专辑封面。
5. **`04 // 珍藏书架` 3D 折叠书架（[`components/bookshelf.tsx`](../../ref-repos/cali.so/components/bookshelf.tsx)）**
   - 带自然物理倾角（`0.65°–1.55°`）的 3D 书脊阵列，点击任意一本书脊，以 `650ms` 旋转展开正面书封，相邻书脊顺势向它倾斜倚靠。
6. **文章详情页上层结构（[`app/_views/blog-post-page.tsx`](../../ref-repos/cali.so/app/_views/blog-post-page.tsx) + [`components/polaroid-cover.tsx`](../../ref-repos/cali.so/components/polaroid-cover.tsx)）**
   - 顶部拍立得封面框（`PolaroidCover`）+ 标题与像素印章 + 四格金属规格铭牌（`编号 No.` / `日期 Date` / `时长 Length` / `字数 Words`）+ 左侧章节锚点导轨（`PostToc`）。

---

## 二、芯火真实内容替换总表（8 大可替换槽位）

| 槽位编号 | 对应 `cali.so` 文件位置 | 原版 Cali 内容 | 替换为「芯火」真实内容（待你拍板/发素材） |
|---|---|---|---|
| **槽位 1：首屏人像与头像** | `public/images/headshot.jpg`<br/>`public/images/portrait-square.jpg`<br/>`public/images/avatar.png` | Cali 的黑白正片头像与深色肖像 | - **网点人像（`headshot.jpg` / `portrait-square.jpg`）**：等你把重构好的**干净无字人像图**发给我后直接替换（让网点算法和背后的等高线花纹完美显现）<br/>- **小头像印章（`avatar.png`）**：使用你的童年红帽 IP 头像或黑金火苗 Logo |
| **槽位 2：首屏名字与 4 段简介** | `components/home-introduction.tsx` | `胡켕琛 Cali` + 佐玩创始人、两个孩子的爸、设计工程师 | - **主标题**：`芯火`（副标 `Xinhuo`）<br/>- **4 段简介**：换成你的真实身份（专科大二公开构建者、AI 工作流与全栈设计探索者、打造「芯火」知识库与一人公司闭环、关注好点子与能拿走的结果） |
| **槽位 3：社交悬停名片与邮戳信封** | `components/social-cards.tsx`<br/>`content/social.json` | `@calicastle` (X/Twitter)、小红书、GitHub、台北寄出的信封 | - 换成你的 **公众号 / 小报童 / 小红书 / GitHub / 个人邮箱**<br/>- 实体信封卡片左上角寄件人改为 `FROM XINHUO`，邮票印章换上你的头像与 `XINHUO · 26` |
| **槽位 4：`01 // 经历` 时间线** | `lib/personal.ts` (`experience`) | 佐玩 Zolplay、very very spaceship 等 4 段经历 | - 换成你的真实成长与构建时间线（例如：`芯火知识库 & AI 一人公司实践`、`公众号「芯火」主理人`、校园项目与公开构建里程碑） |
| **槽位 5：`02 // 写作` 与文章上层** | `content/blog/<slug>/index.mdx`<br/>`app/_views/blog-post-page.tsx` | Cali 的 10 篇技术/生活博客 + 顶部默认打马赛克滤镜的拍立得封面 | - **文章内容**：放入 1–2 篇姜胡式三段式付费级镇店深文 + 你的真实公众号文章（《停更两个月后，我想明白了一件事》《一句话，将任何概念可视化》）<br/>- **文章上层微调**：拍立得封面去掉影响看清架构图文字的默认网点滤镜（或改为清晰展示你的海报 `portrait-poster.png` 与架构图），底部盲文改为中文图注金句 |
| **槽位 6：`03 // 循环播放中`（音乐）** | `lib/personal.ts` (`records`)<br/>`public/images/records/*` | Avicii、J. Cole、NF、Linkin Park 等 12 张唱片 | **已从网易云音乐官方接口下载 6 张真实原版专辑封面（点击底部标签直跳对应单曲播放页）**：<br/>1. 坂本龙一 — 《Merry Christmas Mr. Lawrence》原声黑胶封面（`merry-christmas-mr-lawrence.jpg`, `600×600`, 链接 `https://music.163.com/#/song?id=437715323`）<br/>2. 小野 — 《山野煮雨 / 山野煮水》官方单曲封面（`shanye-zhushui.jpg`, `600×600`, 链接 `https://music.163.com/#/song?id=2677687612`）<br/>3. 韩安旭 — 《多幸运》官方专辑封面（`duo-xing-yun.jpg`, `500×500`, 链接 `https://music.163.com/#/song?id=35847037`）<br/>4. 《解药》官方单曲封面（`jie-yao.jpg`, `600×600`, 链接 `https://music.163.com/#/song?id=3422235430`）<br/>5. GALA — 《追梦赤子心》官方专辑标枪封面（`zhui-meng-chi-zi-xin.jpg`, `600×600`, 链接 `https://music.163.com/#/song?id=355992`）<br/>6. 汪苏泷 — 《就让这大雨全都落下》（《联名》官方专辑封面 `jiu-rang-zhe-da-yu.jpg`, `600×600`, 链接 `https://music.163.com/#/song?id=1984475097`） |
| **槽位 7：`04 // 珍藏书架`（书籍）** | `lib/personal.ts` (`books`)<br/>`public/images/books/*` | 乔布斯传、The Great CEO Within 等 10 本书 | **已全部核验修正为 8 本真实原书正封（点击底部标签直跳 `z-library.sk` 对应书籍）**：<br/>1. 《史蒂夫·乔布斯传》中信出版社正封（`steve-jobs.jpg`, `1127×1503`）<br/>2. 《原则》瑞·达利欧 中信出版集团黑红白正封（`principles.jpg`, `1536×2048`）<br/>3. 《思考，快与慢》丹尼尔·卡尼曼 中信出版社铅笔正封（`thinking-fast-and-slow.jpg`, `768×1024`）<br/>4. 《价值心法》姜胡说 台海出版社正封（`value-mindset.jpg`, `563×800`）<br/>5. 《纳瓦尔宝典》中信出版集团白金正封（`naval-almanack.jpg`, `560×800`）<br/>6. 《富兰克林自传》国际文化出版公司正封（`benjamin-franklin.jpg`, `600×800`）<br/>7. 《穷查理宝典》查理·芒格 中信出版集团正封（`poor-charlie.jpg`, `1364×1819`）<br/>8. 《刻意练习》机械工业出版社牛皮纸 PEAK 正封（`deliberate-practice.jpg`, `768×1024`） |
| **槽位 8：`/projects` 项目与 `/photos` 照片** | `lib/projects.ts`<br/>`public/images/projects/*` | Cali 宝宝、佐玩官网、Well Word 等 8 个项目 | - **项目列表**：去掉无关的赛车图，只放你的真实代表作（如 `芯火 AI 建站与工作流系统`、`母校 64 专业数据可视化活名片`、`三阶认知魔方教学引擎`、`公众号与小报童内容体系`）<br/>- **照片墙**：放入你的精选视觉作品（含你的国潮海报 `portrait-poster.png` 等） |
