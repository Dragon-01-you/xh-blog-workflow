# 04 · 配图与视觉资产

> 原则：**代码画图，而不是拿 AI 图凑数。**
> 图要能解释结构，不能只是"看起来专业"。

## 1. 三条选型

| 需求 | 做法 | 产出 |
|---|---|---|
| 流程图 / 原理图 / 数据关系 | 纯 Python 生成 SVG → Chrome 2x 截图 | `.svg` + `.png` |
| 终端演示 | PIL 逐帧渲染 | `.gif` |
| 社交预览 | 设计 16:9 → 裁 2:1 | `.jpg` 1280×640 |

AI 生成图只在一个场景下用：**需要真实质感的首图/Hero**（产品照、场景照）。
结构图一律代码画——可复现、可改字、可重渲染。

## 2. 极简黑白 / editorial 风格规范

（若你的品牌另有规范，替换这一节）

- 不用纯黑 `#000`、纯白 `#fff`：用 `#111` / `#f4f2ee`
- 分隔线用 1px 发丝线（`stroke-width: 0.5–1`），不用色块分区
- 只允许**一个强调色**，且只给焦点元素
- 字号层级 ≤ 3 级：标题 24–28、正文 13–15、注释 10–11
- 禁止：渐变、阴影、发光、圆角 > 8px、无意义图标、emoji
- 每一屏只讲一件事；讲两件就拆两张图

好的图长这样：一张纸、几条线、几个数字、一个结论。
坏的图：六种颜色、十几个箭头、每个节点都有图标。

## 3. SVG → PNG 流水线

```bash
python3 scripts/render_svg.py assets/how_it_works.svg assets/how_it_works.png --scale 2
```

- `--scale 2` 是硬要求：README 在 Retina 屏上按 2x 像素渲染，1x 图会糊
- 字体必须在本机可用（`fc-list | grep -i "Noto Sans CJK"`），否则中文变方块
- 透明背景默认开启；需要白底时 `--bg "#f4f2ee"`
- 体积目标：单张 PNG < 400 KB（超了就降 width 或减少细节）

**SVG 作为唯一事实源**：所有文字写在 SVG 里，改文案就改 SVG 再重渲染。
不要"在 PNG 上 PS 改字"——下一次重渲染就丢了。

## 4. 终端演示 GIF（无录屏方案）

适用：CI/沙箱没有 ttyrec、asciinema 的环境。

```bash
python3 scripts/make_terminal_gif.py \
  --lines-json '[["$ your-tool --version","cmd"],["[*] scanning","info"],["[+] done","ok"]]' \
  --out assets/demo.gif --title "project — zsh"
```

- 三阶段：命令打字效果 → 输出逐行出现 → 停留 + 光标闪烁
- 配色用 GitHub dark（`#0d1117` 底），四类行：cmd 青 / ok 绿 / warn 黄 / bad 红
- 体积：820×500、约 110 帧 ≈ 540 KB；**超过 1 MB 就降帧或缩尺寸**
- 内容必须是真实运行的浓缩回放，不能编造输出
- 无 CJK 字体时，GIF 内容全英文，否则豆腐块

## 5. 社交预览

```bash
python3 scripts/crop_social_preview.py hero_16x9.png assets/social_preview.jpg
```

- 目标 1280×640、<1 MB、JPG
- 居中裁切，保留主体；文字放在安全区内（四周留 8%）
- 图里最多一行主标题 + 一行副标题

## 6. 验收

- [ ] 所有图在 GitHub 上 200，且宽度一致
- [ ] Retina 下不发虚（2x）
- [ ] 中文字体正常，无豆腐块
- [ ] 单图 < 400 KB，GIF < 1 MB
- [ ] SVG 源文件已入库（可改文案）
- [ ] 深色/浅色主题下都能读（若支持）
