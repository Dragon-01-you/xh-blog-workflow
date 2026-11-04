# 05 · 30 秒宣传片（一套可复跑的流水线）

> 目标：16:9、30.000 s、**默认静音也能看懂**、片尾能被截图传播。
> 交付三件套：`promo-30s.mp4`（<10 MB）、`poster.jpg`、`teaser.gif`（<2 MB）。

## 1. 先写文案，再开渲染器

顺序不能反：**一句话 → 八镜 → 逐字稿 → 时间码 → 才开始做画面**。

- 一句话：观众看完只记住这一句（不是三个卖点）
- 八镜：钩子 / 问题 / 转折 / 真实运行 / 结果 / 方法 / 边界 / 片尾
- 每镜只允许一个焦点；两件事就拆两镜
- 逐字稿按 5.5–6.5 字/秒配时，留 0.15–0.3 s 气口
- 用 `templates/film-outline.md` 直接填

## 2. 三种实现路径

| 路径 | 适用 | 代价 |
|---|---|---|
| HTML 组合 + 无头浏览器逐帧截图 | 有前端能力、要精细排版 | 需要渲染 CLI 或自写截图脚本 |
| HyperFrames / Remotion | 已有 React/GSAP 工程 | 依赖重，但动画能力强 |
| ffmpeg 分镜拼图 | 纯图文快片 | 动画弱，胜在稳定 |

无论哪条路，**画面必须是代码可复现的**，不能是"剪映里拖出来的、只有你电脑上有工程"。

### 通用渲染命令（om 风格 CLI）

```bash
# 体检：时长/帧率/字号/对比度/素材清单
node cli/om.js check .

# 出片
OM_CHROME=/path/to/chrome node cli/om.js render .

# 质量报告：爆音、硬切、平均镜头、对比度、静止段
node cli/om.js qa .
```

没有这套 CLI 时，用等价做法：HTML 逐帧 `--screenshot` + `ffmpeg -framerate 30` 合成。

## 3. 母版（必做，否则时长永远差 0.1 s）

```bash
ffmpeg -v error -y -i out/raw.mp4 \
  -af loudnorm=I=-14:TP=-1.5:LRA=5 \
  -c:v copy -c:a aac -b:a 192k -ar 48000 \
  -movflags +faststart -t 30.000 \
  out/promo-30s.mp4
```

- `-14 LUFS` 是平台通用响度；`TP=-1.5` 防削波
- **`-t 30.000` 必须显式给**：编码器会把 30.0 拖成 30.1
- `faststart` 让网页端可以边下边播

## 4. 三件套

```bash
# 海报：取最有信息量的一帧（通常是结果卡片）
ffmpeg -v error -y -ss 15.5 -i out/promo-30s.mp4 -frames:v 1 -q:v 3 docs/promo/poster.jpg

# Teaser GIF：6.5 s、12 fps、960 宽、96 色调色板
ffmpeg -v error -y -t 6.5834 -i out/promo-30s.mp4 \
  -vf "fps=12,scale=960:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96[p];[b][p]paletteuse=dither=bayer:bayer_scale=5" \
  -loop 0 docs/promo/teaser.gif
```

- GIF 体积与帧数、调色板、抖动强相关；先控帧率，再控颜色
- 目标：960×540、< 2 MB、80 ms/帧

## 5. QA：靠抽帧，不靠感觉

```bash
# 关键时间点抽帧（片尾地址、结果卡、产品名）
for t in 15.5 20.5 27.4; do
  ffmpeg -v error -y -ss $t -i out/promo-30s.mp4 -frames:v 1 /tmp/frame_$t.png
done

# 三段时长必须完全一致
ffprobe -v error -show_entries format=duration,size -of default=nw=1 out/promo-30s.mp4
ffprobe -v error -select_streams v:0 -show_entries stream=duration -of default=nw=1 out/promo-30s.mp4
ffprobe -v error -select_streams a:0 -show_entries stream=duration -of default=nw=1 out/promo-30s.mp4

# 响度复核
ffmpeg -i out/promo-30s.mp4 -af ebur128 -f null - 2>&1 | tail -20
```

最小验收：**无爆音、硬切 ≤ 3、平均镜头 ≥ 6 s、片尾地址正确、静音可懂**。

## 6. 五个必踩的坑

1. **像素里的字不会跟着改名走**：README 改名后，片尾烧录的旧地址必须重渲染
2. **时长差 0.1 s**：不加 `-t 30.000` 就永远对不上
3. **GIF 超 2 MB**：先降 fps（12→10），再降色板（96→64）
4. **中文变方块**：渲染字体必须安装或内嵌（`fc-list | grep CJK`）
5. **默认静音看不懂**：每一镜都要有文字落点，不能靠配音解释

## 7. 交付清单

- [ ] `docs/promo/promo-30s.mp4` 三段时长均 30.000，< 10 MB
- [ ] `docs/promo/poster.jpg` 是最有信息量的那一帧
- [ ] `docs/promo/teaser.gif` < 2 MB，手机上能看清
- [ ] README 首屏可播放（GIF 或 mp4 封面）
- [ ] 抽帧核对过片尾地址、产品名、关键数字
- [ ] 素材/脚本/分镜表随仓库留存（别人能重做）
