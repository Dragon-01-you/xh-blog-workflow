# 芯火个人品牌站 (XH Blog) · 1:1 瑞士纸墨精工质感

> **在线开源地址**：[https://github.com/Dragon-01-you/xh-blog](https://github.com/Dragon-01-you/xh-blog)  
> **主理人**：来自07年的芯火（草字头 `芯`）  
> **设计语言**：1:1 像素级复刻 `cali.so` v3 瑞士国际主义网格系统、6,972 行工匠 CSS、WebGPU 等高线/墨丝/蓝图着色器与物理微交互。  
> **工程基准**：内置 `xh-blog-workflow` 热插拔生产体系，K 代码物理哈希锁死，V 槽位全真个人资产注入。

---

## 一、 核心特性

- 📰 **瑞士纸墨与温润双色调**：Oklch 纸白与碳黑色彩空间，细网格噪点与布莱叶盲文签名；
- 🖼️ **首屏双轨交互人像**：默认呈现报纸半调网点肖像（昼夜双源），**鼠标点击头像丝滑消融网点、100% 还原彩色真实肖像**，再次点击平滑切回网点；
- ✨ **动态 SVG 与弹簧跳字**：「AI 全栈构建者」内嵌开合笔记本与五色星芒 SVG，「刚刚好」内嵌星轨与逐字弹簧跳动，支持触控点击重播；
- 📊 **GitHub 深度贡献卡片**：悬停弹出 `Dragon-01-you` 真实 26 周 × 7 天（182 格）热力图网格与 Stars 统计；
- ✉️ **实体航空信封联系卡**：红蓝航邮齿孔边框、原色肖像邮票、星芒邮戳与收件地址；
- 📱 **公众号二维码弹窗**：点击 Dock 公众号按钮直接弹出「来自07年的芯火」高清二维码卡片（读取 `/images/wechat-qr.jpg`），拒绝死链；
- ✍️ **写作页墨丝场与 8 篇原创**：挂载 WebGPU `Strands` 墨丝流体着色器与 `.focus-list` 聚光灯压暗，全量收录 8 篇微信公众号亲笔原创深度好文；
- 📐 **项目页蓝图准星场**：挂载 WebGPU `FlowField` 蓝图网格与 `.projects-registration-mark` 悬停十字准星平滑吸附，展示 7 个开源实战项目；
- 📷 **拍立得暗房画廊**：纯粹拍立得微倾角（`--img-tilt`）、四角校准角标与 FLIP 放大灯箱；
- 💿 **循环播放黑胶与 3D 书架**：6 张常听唱片旋转出盘与 8 本珍藏原书 3D 书脊立体翻转；
- 🛡️ **质量与安全门禁**：68/68 个 Vitest 单元测试全绿，`tsc` 零报错，22 个路由页面全部静态预渲染（SSG）。

---

## 二、 快速拉取与本地运行 (Quick Start)

### 1. 克隆代码
```bash
git clone https://github.com/Dragon-01-you/xh-blog.git
cd xh-blog
```

### 2. 安装依赖并启动
```bash
# 启用 pnpm
pnpm install

# 本地开发预览
pnpm dev

# 或以生产模式预览完整 SSG 页面（推荐）
pnpm build
pnpm start --port 3000
```
打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可查看完整效果。

### 3. 运行自动化测试与类型检查
```bash
# 运行全部 68 项单元测试
pnpm test

# TypeScript 严格类型检查
pnpm typecheck

# 公共检索与 SEO 路由校验
pnpm run verify:public-discovery
```

---

## 三、 版本快照与回退空间 (Snapshots)

本项目严格执行「每一版的『操』都进行沉淀」的工程原则，任何时候均可无损回退：

```bash
# 回退到 1:1 源码级复刻与全真资产里程碑版本
git checkout v1.0.0-snapshot-cao2
```

---

## 四、 证书与鸣谢

- 视觉与交互原型灵感致敬 [Cali Castle](https://cali.so)；
- 本项目工程底盘由 **芯火 XH · AI 全栈工作流** 驱动生成。
