import os
import shutil
import urllib.request
import io
import re
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw, ImageFont

SRC_DIR = os.environ.get("SRC_DIR", os.path.join(os.getcwd(), "source-articles"))
SITE2_DIR = os.environ.get("SITE2_DIR", os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
BLOG_DIR = os.path.join(SITE2_DIR, "content", "blog")
ASSETS_DIR = os.path.join(SRC_DIR, "assets")

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

def download_bytes(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as resp:
        return resp.read()

def make_1200x675_cover(raw_img_bytes=None, bg_color=(18, 20, 24)):
    target_w, target_h = 1200, 675
    if raw_img_bytes:
        raw = Image.open(io.BytesIO(raw_img_bytes)).convert('RGB')
        aspect = raw.width / raw.height
        if abs(aspect - (16/9)) < 0.05:
            return raw.resize((target_w, target_h), Image.Resampling.LANCZOS)
        
        scale = max(target_w / raw.width, target_h / raw.height)
        bg = raw.resize((int(raw.width * scale), int(raw.height * scale)), Image.Resampling.LANCZOS)
        left = (bg.width - target_w) // 2
        top = (bg.height - target_h) // 2
        bg = bg.crop((left, top, left + target_w, top + target_h))
        bg = bg.filter(ImageFilter.GaussianBlur(radius=28))
        bg = ImageEnhance.Brightness(bg).enhance(0.42)

        fg_w = target_w
        fg_h = int(raw.height * (target_w / raw.width))
        if fg_h > target_h:
            fg_h = target_h
            fg_w = int(raw.width * (target_h / raw.height))
        fg = raw.resize((fg_w, fg_h), Image.Resampling.LANCZOS)
        fg_x = (target_w - fg_w) // 2
        fg_y = (target_h - fg_h) // 2
        bg.paste(fg, (fg_x, fg_y))
        return bg
    else:
        return Image.new('RGB', (target_w, target_h), bg_color)

def make_typography_cover(title, subtitle, tag, quote="", portrait_path=None):
    target_w, target_h = 1200, 675
    img = Image.new('RGB', (target_w, target_h), (18, 20, 24))
    draw = ImageDraw.Draw(img)

    for x in range(0, target_w, 40):
        draw.line([(x, 0), (x, target_h)], fill=(26, 29, 35), width=1)
    for y in range(0, target_h, 40):
        draw.line([(0, y), (target_w, y)], fill=(26, 29, 35), width=1)

    if portrait_path and os.path.exists(portrait_path):
        try:
            port = Image.open(portrait_path).convert('RGBA')
            port_scale = 650 / port.height
            port_w = int(port.width * port_scale)
            port_h = 650
            port = port.resize((port_w, port_h), Image.Resampling.LANCZOS)
            
            gradient = Image.new('L', (port_w, port_h), 255)
            gdraw = ImageDraw.Draw(gradient)
            fade_w = int(port_w * 0.45)
            for gx in range(fade_w):
                alpha = int(255 * (gx / fade_w))
                gdraw.line([(gx, 0), (gx, port_h)], fill=alpha)
            
            port.putalpha(gradient)
            img.paste(port, (target_w - port_w - 20, 15), port)
        except Exception as e:
            print(f"Portrait blend error: {e}")

    font_bold = "C:\\Windows\\Fonts\\msyhbd.ttc"
    font_reg = "C:\\Windows\\Fonts\\msyh.ttc"
    
    try:
        f_tag = ImageFont.truetype(font_bold, 22)
        f_title = ImageFont.truetype(font_bold, 50)
        f_sub = ImageFont.truetype(font_reg, 26)
        f_quote = ImageFont.truetype(font_bold, 34)
        f_meta = ImageFont.truetype(font_reg, 20)
    except Exception:
        f_tag = f_title = f_sub = f_quote = f_meta = ImageFont.load_default()

    draw.rectangle([80, 80, 80 + 260, 80 + 44], fill=(235, 94, 40), outline=None)
    draw.text((95, 88), tag, font=f_tag, fill=(255, 255, 255))

    draw.text((80, 160), title[:15], font=f_title, fill=(245, 245, 247))
    if len(title) > 15:
        draw.text((80, 230), title[15:], font=f_title, fill=(245, 245, 247))
        offset_y = 325
    else:
        offset_y = 245

    if quote:
        draw.line([(80, offset_y), (80, offset_y + 90)], fill=(235, 94, 40), width=4)
        draw.text((98, offset_y + 8), f"“{quote}”", font=f_quote, fill=(235, 94, 40))
        draw.text((98, offset_y + 55), subtitle, font=f_sub, fill=(180, 185, 195))
    else:
        draw.text((80, offset_y), subtitle, font=f_sub, fill=(180, 185, 195))

    draw.text((80, 580), "来自07年的芯火 · XINHUO BLOG · 确定性认知资产", font=f_meta, fill=(120, 125, 135))
    return img

# ==============================================================================
# 1. reflecting-after-two-months
# ==============================================================================
slug1 = "reflecting-after-two-months"
dir1 = os.path.join(BLOG_DIR, slug1)
os.makedirs(dir1, exist_ok=True)

poster_path = os.path.join(SITE2_DIR, "public", "images", "portrait-poster.png")
cover1 = make_typography_cover(
    title="停更两个月后，我想明白了一件事",
    subtitle="成果不是你的，流程才是。凡是你必须亲自确认的点，才是核心竞争力。",
    tag="思考复盘 · 来自07年的芯火",
    quote="成果不是你的，流程才是。",
    portrait_path=poster_path
)
cover1.save(os.path.join(dir1, "cover.jpg"), "JPEG", quality=92)
print("Saved cover for 1. reflecting-after-two-months")

mdx1 = """---
title: "停更两个月后，我想明白了一件事"
date: "2026-11-02"
publishedAt: "2026-11-02T12:00:00.000Z"
summary: "如果脱离 AI，我们还剩什么？成果不是你的，流程才是。凡是你每次都必须亲自确认的点，才是你的核心竞争力。"
description: "如果脱离 AI，我们还剩什么？成果不是你的，流程才是。凡是你每次都必须亲自确认的点，才是你的核心竞争力。"
cover: "./cover.jpg"
coverWidth: 1200
coverHeight: 675
coverCaption: "停更两个月，我想明白了一件事：成果不是你的，流程才是"
tags: ["思考复盘", "AI全栈", "工作流", "认知资产"]
---

故事是这样的。

我停更了差不多两个月。

这两个月我一直在用 AI 干自己的事，做网站，做知识库，搭工作流。说实话，AI 帮我省下的时间是真的多，多到我一度觉得，这事儿好像已经彻底解决了。

直到某天我静下来想了三个问题：

1. **第一个问题：我到底在干什么？**
2. **第二个问题：如果把 AI 拿走，我还剩什么？**
3. **第三个问题：我们真正的竞争优势，是什么？**

当时我还挺得意的，觉得这三个问题问得挺深刻。

想了挺久，答案有点扎心：

> **如果脱离 AI，我们好像啥也不是。**

这句我一开始听着挺舒服的，甚至有点自嘲的爽感。但越想越不对。

它不对的地方，不在于“啥也不是”这四个字，而在于它默认了一个前提：成果是我们自己的。

我们做策划稿的都知道，AI 写出来的第一版，百分之八十是能交差的。

交差之后呢？下次这份稿子你还得接着改，还是会有一堆不满意的点。

**一次性的东西，不是你的。**

这事儿我是有体会的。我自己是做策划的，10 月光策划稿就出了 6 版，每版开头都是直接扔给 AI，写完确实能交差。但下一次呢？下次还是重头再来。

我原来一直觉得这是 AI 不够聪明，后来才想明白，这事儿根本不是聪明不聪明的问题——**是流程的问题。**

## 一、把流程固定下来：拆解确定性三步

我的想法其实很朴素。

既然每次做的东西有那么多是重复的，那就别每次都重新说，把整个流程固定下来就好了。

拆开其实就三步：

1. **第一步，把模板给它**：你这次要的东西长什么样，格式是什么，一次说清楚，然后让它去看，哪些是不变的，哪些是要变的；
2. **第二步，定变化规则**：要变的那部分，它每次该怎么变，这个规则要先定下来；
3. **第三步，亲自确认与判定**：哪些是每次非要我确认的，必须得我来进行，最后输出出来，再检查一遍。

听起来是不是特别没技术含量？对，就是没什么技术含量。

但它解决了一个很具体的问题：下次我不用再从零跟 AI 重新沟通一遍。就这一件事，我觉得值。

说实话，我一开始觉得这事挺反直觉的。AI 这么强，什么都能干，我为啥还要自己搞一套流程去框它？后来想明白了：AI 帮我执行，那没问题。但这个流程长什么样、哪些能固定、哪些不能固定，这个判断本身，是我做的。

所以后来我总结出一句话：

> **凡是你每次都必须亲自确认的点，就是你的核心竞争力；凡是你只确认一次的点，才可以外包给流程。**

你想想看这句话。我们总说 AI 替代不了我，但替代不了在哪？

替代不了的就是你每次都要拍板的那几个关键节点。而你每次都要拍板的东西，恰恰是最值钱的东西。如果你发现自己好像也没什么不可替代的，那可能不是 AI 太强，是你从来没把“你要确认什么”这件事想清楚过。

## 二、我获得的是成长，不是成果

那这两个月我到底获得了什么？

**是成长，不是成果。**

> AI 它可以做出来很多一样的成果，但是这些东西它都不是你的。

“一样”这两个字是关键。AI 能做出来的成果，谁都能做出来。那它就只是个成果，它不是你的。你同事换个模型，也能做出来一模一样的。

但你在过程中形成的判断力，是拿不走的。

那成果是啥？成果是 AI 帮你拿的一个好结果，好看、漂亮、能发朋友圈。但你在过程中真学到了什么，那个才是长在身上的。

我一直觉得，**判断力和品味**这俩东西，是 AI 最难替代的。不是因为 AI 笨，是因为判断本身需要你承担后果——你做错了要改稿，要被甲方批评，要承担线上事故。AI 不承担后果，所以它永远不会有真正的判断力，它只能算得很快。

## 三、别把你的大脑外包给 AI

如果说你现在想学 AI，我的建议有点反常识：**先别急着学**。

你学 AI 是为了什么？为了以后能指挥 AI 干活？那你不如直接去研究怎么把活干好，指挥这事儿不是根本。真正的重点是，你在干活的过程中，到底长出了什么。

拿一个真实的问题去让 AI 解决，跑完之后，问自己两个问题：

1. 这个过程我到底学会了什么？
2. 具体沉淀留下来了什么？

留下来的往往不是一个个孤立成果，而是一套可以复用的工程系统。

具体操作很简单：每次让 AI 做完，别急着收工，先花两分钟写三行字：
- 这事你为什么这么判断？
- AI 哪里做错了？
- 怎么把规则固化进下次的 Prompt 或规范里？

就这三行，下次你做同类的事，直接就能调出来。AI 会升级换代，但你的判断系统不会贬值。

## 四、几个踩过的真实大坑

在固化流程的过程中，我先替大家踩了三个大坑：

1. **上来就试图把所有东西全部固定**：有些东西根本不适合固定，因为现实业务场景每次的情况都不一样；
2. **把“要变”的部分也写死了**：这是最大的坑，变的那部分如果也定死，AI 每次给你的东西就千篇一律；
3. **妄想一步到位**：我第一次搞这套工作流时，改了七八轮才顺手，别指望一次就完美。

一开始可能会有点笨拙，花的时间比手动做还长。但坚持几周之后，你会发现省下来的时间呈指数级上升，而且你对 AI 的理解会真正内化为直觉。这个过程，就是逐步变成 **AI Native** 的过程。

## 总结：写在最后

我停更了两个月，想了挺多，也做了挺多。要说最大的收获，其实就是那句朴实但管用的话：

**成果不是你的，流程才是。凡是你每次都必须亲自确认的点，才是你的核心竞争力。**
"""

with open(os.path.join(dir1, "index.mdx"), "w", encoding="utf-8") as f:
    f.write(mdx1.strip() + "\n")

mdx1_en = """---
title: "Reflections After a Two-Month Pause: Workflows vs. Outcomes"
date: "2026-11-02"
publishedAt: "2026-11-02T12:00:00.000Z"
description: "What remains when we step away from AI? Tangible outcomes are fleeting, but deterministic workflows endure."
cover: "./cover.jpg"
coverWidth: 1200
coverHeight: 675
coverCaption: "Reflecting after two months: Outcomes are disposable; workflows are forever."
---

Over the past two months, I paused public publishing to dive deep into building knowledge systems, websites, and agentic pipelines.

AI saved me immense amounts of time. But when I paused to ask myself three core questions:
1. What am I really doing?
2. If AI is removed, what remains of me?
3. What constitutes our genuine competitive advantage?

The realization was humbling: **One-off outputs generated by AI are not truly yours.** Anyone with the same prompt and model can produce identical results.

## 1. Pinning Down Deterministic Workflows

I distilled human-AI collaboration into three pragmatic stages:
1. **Provide the structural template**: Clarify invariants vs. variants.
2. **Define variation constraints**: Lock down the logic governing dynamic elements.
3. **Personal judgment and verification**: Retain ownership of every critical decision point.

> **Whatever you must personally confirm every time is your core moat; whatever you confirm once can be safely outsourced to a workflow.**

## 2. Growth Over Outcomes

What compounds across projects is not disposable collateral, but the judgment, taste, and resilience you forge when things break.
"""

with open(os.path.join(dir1, "index.en.mdx"), "w", encoding="utf-8") as f:
    f.write(mdx1_en.strip() + "\n")

print("Created 1. reflecting-after-two-months")

# ==============================================================================
# 2. concept-visualization
# ==============================================================================
slug2 = "concept-visualization"
dir2 = os.path.join(BLOG_DIR, slug2)
os.makedirs(dir2, exist_ok=True)

cover2_bytes = download_bytes("https://mmbiz.qpic.cn/sz_mmbiz_jpg/vzmZUnDhKp0YUUZibKoBuLdkaZ0CpS0AtIFDew0X6PWnxyBJNiaf5icVXIlDx0taxVOsv1Wk8ic6gA9N56nh2KJz2ZpoKYBUNlch33aLV1Cgnb4/0?wx_fmt=jpeg")
cover2 = make_1200x675_cover(cover2_bytes)
cover2.save(os.path.join(dir2, "cover.jpg"), "JPEG", quality=92)

# Download body images for concept-visualization
# Rubik's cube & Anatomy illustration
try:
    rubiks_bytes = download_bytes("https://mmbiz.qpic.cn/sz_mmbiz_jpg/vzmZUnDhKp0YUUZibKoBuLdkaZ0CpS0AtIFDew0X6PWnxyBJNiaf5icVXIlDx0taxVOsv1Wk8ic6gA9N56nh2KJz2ZpoKYBUNlch33aLV1Cgnb4/640?wx_fmt=jpeg")
    with open(os.path.join(dir2, "rubiks-cube.jpg"), "wb") as f:
        f.write(rubiks_bytes)
except Exception as e:
    print(f"Error downloading rubiks img: {e}")

mdx2 = """---
title: "一句话将任何概念可视化"
date: "2026-10-25"
publishedAt: "2026-10-25T12:00:00.000Z"
summary: "搞懂复杂概念的关键在于脑海中有直观画面。分享一个结合 Anatomy skill 的概念拆解与学习法。"
description: "搞懂复杂概念的关键在于脑海中有直观画面。分享一个结合 Anatomy skill 的概念拆解与学习法。"
cover: "./cover.jpg"
coverWidth: 1200
coverHeight: 675
coverCaption: "概念可视化：魔方与复杂机理的结构化拆解"
tags: ["概念可视化", "AI技能", "学习方法", "Anatomy"]
---

以前我想要搞懂一个复杂的概念，脑子里往往根本没有这个概念的具象画面。比如数学里的贝叶斯定理、算法中的哈希碰撞，或者魔方的转动原理等等，抽象的文字讲得再多，脑子里还是一片模糊。

我之前总以为是这些概念太高深了，但后来才发现：**难的不是概念本身，而是你对这个东西缺乏一个直观立体的第一印象。**

今天和大家分享一个我最近一直在用的复杂概念学习法与 AI Skill（给 AI 配备的专项技能）。用起来非常简单，直接用下面这句话就能让大模型调用专门的可视化解构能力：

```text
帮我去 https://github.com/wheresryan22/anatomy 下载这个 skill，用它制作一个 [你想要搞懂的概念] 的逐层解构图
```

在模型选择上，国内建议使用 DeepSeek、Kimi 或 Qwen，在结构化代码与 SVG/Mermaid 生成上表现非常出色。

## 一、从火箭发动机到魔方解构

官方示例展示了猛禽 2 代（RAPTOR 2）火箭发动机，11 个关键部件被逐层拆解展开。这种爆炸图（Exploded View）让人一瞬间就能看明白燃料管路、涡轮泵与燃烧室的装配关系。

我自己也拿它来拆解魔方：

魔方不是 54 张彩色贴纸，而是 **26 个物理模块咬合在一起的三维机械整体**（8 个角块、12 个棱块、6 个中心块围绕内部核心轴旋转）。

![概念可视化图解](./cover.jpg)

*魔方机理解构：不是纸面贴图，而是 26 个模块咬合的系统*

当我结合这种空间结构化解构技能后，原本枯燥晦涩的还原公式瞬间变成了实体块的轨迹运动，我也终于顺利掌握了魔方还原的核心机理。

## 二、同一套画法拆解万物

最强大的地方在于这种解构逻辑的通用性：
- **机械工程**：四冲程发动机、汽车差速器、钟表擒纵机构；
- **计算机体系**：哈希表冲突寻址、分布式负载均衡、网络数据包封包解包；
- **生物医学**：突触信号传递、心肌细胞电传导。

人类大脑本质上是极其偏爱空间画面的。把枯燥文字变成可以“透视”的结构图，学习效率提升的不仅是速度，更是理解的深度。

最后，你手头有什么一直没想明白的概念吗？不妨也用这句话让 AI 帮你拆开看看！
"""

with open(os.path.join(dir2, "index.mdx"), "w", encoding="utf-8") as f:
    f.write(mdx2.strip() + "\n")

mdx2_en = """---
title: "Visualizing Any Complex Concept with a Single Prompt"
date: "2026-10-25"
publishedAt: "2026-10-25T12:00:00.000Z"
description: "Mastering complex concepts requires visceral mental representations. How to leverage the Anatomy skill for instant visual breakdowns."
cover: "./cover.jpg"
coverWidth: 1200
coverHeight: 675
coverCaption: "Concept visualization: structural dissection from Rubik's cube to distributed systems."
---

Whenever we struggle to grasp a difficult concept—be it Bayes' Theorem, hash map collision resolution, or the internal mechanics of a Rubik's cube—the hurdle is rarely raw complexity. It is the absence of an intuitive visual mental model.

By leveraging the Anatomy skill (`wheresryan22/anatomy`), we can prompt modern LLMs (such as DeepSeek or Claude) to render multi-layered exploded views of any concept.

## 1. Deconstructing the Rubik's Cube

A Rubik's cube is not 54 colored stickers; it is an interlocking 3D mechanical assembly of 26 physical cubies rotating around an internal 6-way spider core. Once visualized as spatial kinematics, standard algorithms transition from opaque rote memorization to tangible physics.

## 2. Universal Mechanical Blueprinting

The same blueprint methodology applies across mechanical engineering, distributed computing, and biological signaling pathways. Spatial clarity unlocks profound cognitive retention.
"""

with open(os.path.join(dir2, "index.en.mdx"), "w", encoding="utf-8") as f:
    f.write(mdx2_en.strip() + "\n")

print("Created 2. concept-visualization")

# ==============================================================================
# 3. top-developers-make-questions
# ==============================================================================
slug3 = "top-developers-make-questions"
dir3 = os.path.join(BLOG_DIR, slug3)
os.makedirs(dir3, exist_ok=True)

cover3_bytes = download_bytes("https://mmbiz.qpic.cn/mmbiz_jpg/vzmZUnDhKp3koXzfwfozGC1qu2A4kXy6RQwREib65nu8UibkZ1Kv6UibNFujAVFjiaP3o7dfjcC8617kL639CLBE9A2AoMoaOIFUicpgURRhNrUs/0?wx_fmt=jpeg")
cover3 = make_1200x675_cover(cover3_bytes)
cover3.save(os.path.join(dir3, "cover.jpg"), "JPEG", quality=92)

# Copy real GitHub repo showcase image
github_viewport_src = os.path.join(ASSETS_DIR, "GitHub-作品墙-视口.png")
if os.path.exists(github_viewport_src):
    shutil.copy2(github_viewport_src, os.path.join(dir3, "github-workflow.png"))
    print("Copied github-workflow.png to top-developers-make-questions")

mdx3 = """---
title: "顶尖的开发者在出题，而我们只是在答卷"
date: "2026-10-21"
publishedAt: "2026-10-21T12:00:00.000Z"
summary: "把时间花在回答 AI 上，还是花在给 AI 出题与验证上？环境搭建、需求澄清、TDD 测试先行——这一套才是差距的源头。"
description: "把时间花在回答 AI 上，还是花在给 AI 出题与验证上？环境搭建、需求澄清、TDD 测试先行——这一套才是差距的源头。"
cover: "./cover.jpg"
coverWidth: 1200
coverHeight: 675
coverCaption: "开发流程 vs 考试：顶尖开发者在出题，而我们只是在答卷"
tags: ["AI全栈", "TDD", "工作流", "开发哲学", "开源项目"]
---

你是不是也在用 AI 开发一些东西？只要输入几句话，喝一杯水的功夫，“啪”的一下 AI 全给你写完了。但关掉窗口后，总觉得心里空落落的：我的技术到底有没有提升？我还能从这种开发方式里真正学到东西吗？

我也为此苦恼了很久。直到我深入观察了国内外一线顶尖开发者的真实工作流，才发现他们与普通玩家的开发方式不仅不是一模一样，简直是差了十万八千里。

> **核心发现：我们是在疲于答卷；而那些顶尖的开发者，自始至终都在给 AI 出题。**

你把时间都花在“被动回答 AI 的提问”上，还是花在“给 AI 出考卷、设门禁并严格验证”上，这就是差距的根本源头。

顶尖全栈工作流大概包含六个关键环扣：
**环境搭建 → 需求澄清 → 最小测试 → 开发实现 → 验收上线 → 部署迭代**

如果把这套流程翻译成考试的语言，你会发现每一步都对应得严丝合缝：

## 一、环境搭建：给 AI 立好规矩与安全红线

大家最容易忽略的一步就是搭建环境。很多人以为环境搭建就是敲个 `git init`，其实远不止于此。

一个抗风险的 AI 协作环境必须包含：
1. **项目规范与地图 (`AGENTS.md`)**：清晰告知 AI 项目的架构 seam、依赖版本、目录边界与严禁触碰的红线；
2. **自动化提交门禁 (`pre-commit`)**：在代码提交前执行类型检查、格式化与单元测试，拦截任何劣质代码；
3. **版本快照回退能力**：确保每一步都有确定性 checkpoint。

给 AI 写规范绝非故弄玄虚——在开源世界里，`AGENTS.md` 规范已被数以万计的项目采纳。有了严密的环境边界，AI 才不会在上千行代码中出现上下文丢失、胡乱魔改或脱节崩塌。

## 二、需求澄清：不写代码前的“灵魂三问”

在让 AI 敲下第一行代码之前，先问自己三个问题：

1. **我们要的是最终成品，还是要掌握这项技能本身？**（如果是为了学习，就绝对不能让 AI 一把梭全部写完，而要让它引导与陪练）；
2. **交付的成功标准到底是什么？**（具体的验收指标，而非抽象的“好看、好用”）；
3. **时间与性能的边界条件是什么？**

最后必须产出明确的 `proposal.md`（设计提案文档）和 `task.md`（原子任务清单）。先对齐考纲，再开始答题。

## 三、测试先行 (TDD)：输出倒逼输入的终极哲学

第三点我认为是最核心的灵魂：**测试驱动开发（TDD）**。

传统的做法是写完代码再测，甚至压根不测。而 TDD 是完全反过来的：**开发前先出考卷**。

其经典循环是著名的“红-绿-重构”：
1. **故意报错（Red）**：先写一个单元测试，明确定义输入什么、期望输出什么。此时尚未实现功能，测试必然失败亮红；
2. **修复变绿（Green）**：让 AI 仅编写满足该测试的最小代码，直到测试变绿通过；
3. **重构优化（Refactor）**：在绿色安全网的保护下，让 AI 优化代码结构、消除冗余。

以用户注册为例：你先不写注册逻辑，而是先写一个测试用例——输入长度小于 3 的用户名必须抛出校验错误。跑一下必定报错；接着让 AI 写校验代码让测试通过；最后再让 AI 提高代码健壮性。

**TDD 的本质是用输出倒逼输入。**

在写这篇文章时，我也并非对所有技术细节了如指掌；但在出卷、设问、跑测试的过程中，不清楚的点全部暴露出来，倒逼我针对性地查证搞懂。这种用输出倒逼输入的哲学，不仅适用于软件工程，也是现实生活中最高效的终身学习方法。

## 四、开源固化：xh-ai-fullstack-workflow

我把这一整套工作流固化为了一个可被任何 AI 工具读取并重复执行的 skill 开源项目：

👉 **GitHub 仓库**：[Dragon-01-you/xh-ai-fullstack-workflow](https://github.com/Dragon-01-you/xh-ai-fullstack-workflow)

![我的真实仓库：把工作流固化成可重复执行的 skill](./github-workflow.png)

*仓库首页实拍：先搭环境，再出考卷，再让 AI 答卷*

我们和顶尖开发者的差距，不在于手里掌握了多少高级提示词，而在于你到底是在被动“答卷”，还是在主动“出题”。把环境搭牢、把需求理透、把测试写在前面，你才能从人机协同中获得真正带得走的本领。
"""

with open(os.path.join(dir3, "index.mdx"), "w", encoding="utf-8") as f:
    f.write(mdx3.strip() + "\n")

mdx3_en = """---
title: "Top Developers Design the Test; We Merely Fill in Answers"
date: "2026-10-21"
publishedAt: "2026-10-21T12:00:00.000Z"
description: "Do you spend your engineering hours answering AI prompts, or designing verification tests? The mindset shift behind elite AI-driven engineering."
cover: "./cover.jpg"
coverWidth: 1200
coverHeight: 675
coverCaption: "Engineering pipeline vs. examination: Elite developers craft questions; amateurs fill in blanks."
---

When interacting with AI models, developers frequently fall into a passive trap: asking for snippets, copying outputs, and reacting to hallucinations.

Observing world-class engineering workflows reveals the opposite paradigm: **Top developers design the examination; AI provides candidate answers.**

## 1. Setup as a Guardrail: AGENTS.md & Pre-Commit

Before writing code, establish a defensive envelope:
- Clear architectural constraints codified in `AGENTS.md`.
- Automated Git `pre-commit` hooks for linting, type-checking, and test runs.

## 2. Test-Driven Development (TDD) as the Golden Contract

By writing assertions before implementations, we create an objective verification harness:
1. **Red**: Define the contract with an intentionally failing test.
2. **Green**: Prompt the model to produce the minimal implementation that passes.
3. **Refactor**: Improve elegance and efficiency under test coverage.

## 3. Open Source Skill: xh-ai-fullstack-workflow

I packaged this end-to-end framework into an open-source specification available on GitHub:
[Dragon-01-you/xh-ai-fullstack-workflow](https://github.com/Dragon-01-you/xh-ai-fullstack-workflow).
"""

with open(os.path.join(dir3, "index.en.mdx"), "w", encoding="utf-8") as f:
    f.write(mdx3_en.strip() + "\n")

print("Created 3. top-developers-make-questions")

# ==============================================================================
# 4. vibecoding-deployment-guide
# ==============================================================================
slug4 = "vibecoding-deployment-guide"
dir4 = os.path.join(BLOG_DIR, slug4)
os.makedirs(dir4, exist_ok=True)

cover4_bytes = download_bytes("https://mmbiz.qpic.cn/sz_mmbiz_jpg/vzmZUnDhKp0ZRW16ib999BjMDTvjCBQJxLWabRP0IunGNn5dmXCRHCCAN3DZTI5mdfOKUVMj2iaxg7p9ESsg9UGjs8dia4fh1tWI4g2badFdGM/0?wx_fmt=jpeg")
cover4 = make_1200x675_cover(cover4_bytes)
cover4.save(os.path.join(dir4, "cover.jpg"), "JPEG", quality=92)

mdx4 = """---
title: "vibecoding 做出来了，却卡在部署？个人开发者该怎么选，一次讲清"
date: "2026-10-17"
publishedAt: "2026-10-17T12:00:00.000Z"
summary: "从静态托管 EdgeOne、全栈托管 CloudBase 到云服务器与宝塔面板，一次讲清个人开发者的部署选择路径与避坑指南。"
description: "从静态托管 EdgeOne、全栈托管 CloudBase 到云服务器与宝塔面板，一次讲清个人开发者的部署选择路径与避坑指南。"
cover: "./cover.jpg"
coverWidth: 1200
coverHeight: 675
coverCaption: "个人开发者部署选型决策树与全流程闭环"
tags: ["VibeCoding", "部署运维", "CloudBase", "个人开发者"]
---

最近发现好多伙伴都开始尝试 **VibeCoding**（通过自然语言和 AI 协同写代码），但大多都卡在了同一个坎上：**部署**。

代码让 AI 全写完了，在本地 `localhost:3000` 跑得好好的，可怎么把它变成一个全球任何人都能在手机和电脑上打开的真实网址？很多人一上来就被云服务器、公网 IP、域名备案、Nginx 配置给劝退了。

这篇指南把个人开发者部署从头到尾彻底梳理一遍：先做分类，再选路线，不讲空话。

> **全文总纲：部署本质上只有一条主线——把代码放到一台永不断电开机的机器上，配上域名让用户访问。**
> 
> 纯静态交给托管平台；有后端但数据轻量，让 AI 配合 CloudBase 全栈托管；真要复杂数据库与自定义服务，才自己租云服务器。

## 一、第一步先分清：你的项目要不要“后端 + 数据库”

这一步决定后面所有技术选型，千万别跳过。你只需要问自己两个问题：

1. **要不要后端服务？**
   纯展示、不需要用户登录、无需存储私有数据的，是**静态页面**（绝大多数作品集、产品展示页、工具落地页都属于此类）；需要用户注册、支付结算、调用私密密钥的，是**动态应用**。
2. **要不要持久化数据库？**
   动态应用中，是否需要将用户产生的数据长期留存并在不同设备同步？

想清楚这两问，路线就彻底清晰了。

## 二、静态站首选：托管平台几分钟上线 (EdgeOne Pages / Vercel)

如果你的项目是纯静态页面（如纯 HTML/CSS/JS、Vite/Next 静态导出），千万别花冤枉钱买云服务器。

直接使用腾讯云 EdgeOne Pages、Vercel 或 GitHub Pages 这类现代托管平台：
- **操作简单**：将项目代码推送到 GitHub，平台自动触发 CI/CD 构建；
- **全球加速**：自带 CDN 边缘节点与免费自动化 HTTPS SSL 证书；
- **成本极低**：对个人小站几乎提供零门槛免费额度。

“Ship in Minutes”——纯静态站用托管，把精力留给产品本身。

## 三、轻量全栈：让 AI 借助 CloudBase 一把梭

如果你的项目有简单的后端逻辑或轻量数据存储（例如表单提交、简易留言板、AI Token 查询工具），腾讯云 CloudBase 是极佳的轻量全栈选择：
- 它将前端静态托管、云函数（Serverless FaaS）、轻量数据库和文件存储打包合一；
- 你无需手动安装配置 Linux、Node 或 Docker；
- 现代 AI 编程工具（如 Cursor、CloudBase CLI）内置了专门的连接器，AI 能直接协助完成一键部署。

最关键的是，使用平台的二级子域名进行测试验证时，省去了漫长繁琐的自主备案周期。

## 四、复杂自建：云服务器 + 宝塔面板

当你需要运行 Python 脚本、本地 LLM 模型推理、Docker 容器编排或高性能独立 MySQL 数据库时，托管平台就受限了，此时需要选购云服务器（轻量应用服务器）。

### 1. 服务器地域选择
- **国内节点**：访问延迟极低、网络稳定，但绑定域名必须完成工信部 ICP 备案（个人备案约需数周）；
- **中国香港 / 海外节点**：免备案，开箱即用，适合快速上线验证或出海项目。

### 2. 宝塔面板：图形化降维管理
对于命令行不熟练的同学，连接 SSH 后一键安装宝塔 Linux 面板，能在浏览器里通过图形界面配置 Nginx 站点、一键申请 Let's Encrypt SSL 证书、管理数据库与查看系统资源监控。

## 五、新手高频踩坑避坑清单

1. **盲目购买高配服务器**：绝大多数新手 demo 静态托管完全足够，买服务器纯属浪费预算与运维精力；
2. **忽视国内备案前置期**：国内服务器绑定域名必须先备案，急于上线却被拦截；
3. **只暴露原始 IP 访问**：链接长且被浏览器标记为“不安全（Not Secure）”，用户根本不敢点击；
4. **上线后缺乏安全基线**：默认端口开放、弱口令甚至不设防火墙，极易被公网扫描器光顾。

## 总结：今天就能照着做的三步

个人开发者起步，路线越简明越好：
- **纯静态**：EdgeOne / Vercel 一键连 GitHub；
- **轻后端**：CloudBase 无服务器一把梭；
- **重运维**：轻量云服务器 + 宝塔面板。

找准自己的项目类型，别在不该硬扛的地方浪费时间！
"""

with open(os.path.join(dir4, "index.mdx"), "w", encoding="utf-8") as f:
    f.write(mdx4.strip() + "\n")

mdx4_en = """---
title: "Finished VibeCoding but Stuck on Deployment? A Solo Developer's Complete Guide"
date: "2026-10-17"
publishedAt: "2026-10-17T12:00:00.000Z"
description: "From static edge hosting (EdgeOne/Vercel) and Serverless full-stack (CloudBase) to VPS and graphical control panels."
cover: "./cover.jpg"
coverWidth: 1200
coverHeight: 675
coverCaption: "Deployment decision matrix and production pipeline for solo creators."
---

VibeCoding makes building functional software as effortless as conversing with an LLM. However, taking a project from `localhost:3000` to a globally accessible URL frequently stalls first-time builders.

## 1. Classify the Runtime Requirements
- **Static Frontend**: Static sites require no persistent server. Use edge platforms (EdgeOne Pages, Vercel, Cloudflare Pages).
- **Lightweight Full-Stack**: Integrate Serverless backends and document stores (CloudBase, Supabase).
- **Custom Daemons**: When deploying Docker containers, Python services, or relational DBs, provision a virtual private server (VPS).

## 2. SSL, Domains, and Automated Continuous Delivery
Never distribute bare IP addresses. Enforce HTTPS via automated Let's Encrypt certificates and link your repositories directly to deployment hooks.
"""

with open(os.path.join(dir4, "index.en.mdx"), "w", encoding="utf-8") as f:
    f.write(mdx4_en.strip() + "\n")

print("Created 4. vibecoding-deployment-guide")

# ==============================================================================
# 5. weekly-review-2026-06-15
# ==============================================================================
slug5 = "weekly-review-2026-06-15"
dir5 = os.path.join(BLOG_DIR, slug5)
os.makedirs(dir5, exist_ok=True)

cover5_bytes = download_bytes("http://mmbiz.qpic.cn/mmbiz_jpg/vzmZUnDhKp0TXViabKNTH3CT6ssZbGs6X1uBPE72ylxTibMu9kBneiaKUulBujTjegujI1OxJ9JicWtwEsnNicOjIJbdCLlnicMkI7NhU7R9wqZ9k/0?wx_fmt=jpeg")
cover5 = make_1200x675_cover(cover5_bytes)
cover5.save(os.path.join(dir5, "cover.jpg"), "JPEG", quality=92)

mdx5 = """---
title: "本周复盘：输入内化输出、专注力与认知资产"
date: "2026-06-15"
publishedAt: "2026-06-15T12:00:00.000Z"
summary: "从零散知识到结构化框架，在大学试错成本最低的环境里，如何构建高质量输入系统并将重复动作打包为资产。"
description: "从零散知识到结构化框架，在大学试错成本最低的环境里，如何构建高质量输入系统并将重复动作打包为资产。"
cover: "./cover.jpg"
coverWidth: 1200
coverHeight: 675
coverCaption: "输入、内化与输出：将重复动作打包为资产"
tags: ["认知复盘", "专注力", "思维模型", "个人成长"]
---

来吧，这周认真复盘一下。

在这周复盘时我发现了一个非常关键的问题：**输入太零散**，导致最后的复盘报告只是将学到的碎片知识生硬拼接而成。所以下周我给自己制定了更具体的学习计划：
1. 学习**结构化思维**的表达；
2. 搭建一套**高质量输入来源系统**。

之前感觉每天没有具体方向，看到哪学到哪。虽然我天生很抗拒死板的系统，但必须承认：人还是得有一个宏观大框架去学，不要盲目地散乱记录，这点至关重要。

## 一、寻找理想人生方向的四个维度

本周深度思考的主题是“如何找到理想的人生方向”。这事说简单也不简单，核心看四个维度的交集：

1. **喜欢**（有内驱力，能长期沉浸）；
2. **擅长**（具备比较优势，学得比别人顺手）；
3. **可复利**（随着时间推移，积累不会归零，而是指数级放大）；
4. **天花板高**（有足够宽广的发展空间）。

看起来只有四个维度好像很容易，但实际很难。我们不可能突然在某天顿悟出完美方向，甚至连确定自己现在真正喜欢什么都不容易。而且现在的喜欢不代表未来的喜欢，它在动态变化中——因此必须在实际行动中不断调整。

从宏观上看，世界有大数据的统计规律；但从个人微观视角看，世界就像一张网，你的每一次具体行动都会重塑对应的网络关系。世界不是宿命确定的，而是根据你的行为轨迹不断坍缩演化。

**大学期间是人生试错成本最低的环境**：没有沉重的生活与生存负担，这为我们提供了成本最低的探索试验场。

## 二、信息输入的三层过滤器

具体方法上，我每天的过程抽象概括就是：**输入 → 内化 → 输出**。

有什么样的输入，就有什么样的输出，决定性瓶颈在于如何内化。如果思维模型扎实、思考深度足够，或许能从平庸的事物里提取洞见；但一个真正具备深度的人，绝不会主动把时间浪费在垃圾信息上。因此输入源的纯净度是生命线。

我观察了身边许多卓越者的输入渠道，发现一个极为显著的共性：**他们几乎不看短视频算法流，阅读的内容绝大多数是经典名著与权威论文**。这些知识经历了数十年乃至数百年的时间检验，具备极高的抗衰期。

我将目前的信息源严格划分为三类：
1. **经典著作**（底层基石）；
2. **顶尖人物的思维模型与决策方法**；
3. **即时热点**（占比严格控制在极小比例）。

社会上多数人的信息结构恰好倒置：95% 是碎片热点，经典与底层模型连 5% 都不到。明白了这个道理，我就懂了为什么去研读那些看似“无用之用”的原理其实最有用——它们构成了看透本质的底层透镜。

## 三、警惕“烙饼式多任务”对深度专注力的侵蚀

在执行层面，我反思了一个坏习惯：**注意力碎片化**。

小学数学里有一种经典的“烙饼问题”：一个锅同时烙两张饼，通过交替翻面节省总时间。我发现自己经常不自觉地陷入这种“烙饼思维”——同一时间想并行政务、写代码、看视频、回消息，自以为在提高时间利用率，结果导致深度专注力被撕得粉碎。

**烙饼思维只适用于低认知负荷的体力动作，面对高强度的抽象深度思考，多任务切换是致命毒药。**

在接下来的阶段，我必须训练自己进入单线程深度心流的能力：一次只啃一块硬骨头。

## 四、什么是真正的“资产”与价值交换？

说了这么多个人成长，跟商业变现有什么关联？

> **商业产品本质上就是将你验证过的可重复动作打包标准化。**

比如你每天都要面对繁杂的信息筛选与写作，如果你把自己的工作流与认知模型固化为一套工具或知识库，这套系统本身就是一种数字资产。

你能赚到钱，本质上是你在某个垂直维度上走得比别人深一点，然后把你走通的路径打包给需要的人，完成价值交换。但只做一次性搬运是不长久的，必须依靠持续的学习、迭代与交付，才能形成源源不断的成长复利。
"""

with open(os.path.join(dir5, "index.mdx"), "w", encoding="utf-8") as f:
    f.write(mdx5.strip() + "\n")

mdx5_en = """---
title: "Weekly Review: Inputs, Synthesis, Focus and Cognitive Assets"
date: "2026-06-15"
publishedAt: "2026-06-15T12:00:00.000Z"
description: "Transitioning from fragmented notes to structured mental models. Building high-signal input filters during university years."
cover: "./cover.jpg"
coverWidth: 1200
coverHeight: 675
coverCaption: "Inputs, synthesis, and outputs: Turning repeatable workflows into compounding cognitive assets."
---

Reflecting on this week's progress highlighted a recurring trap: **fragmented inputs generate fragmented conclusions.**

## 1. The Four-Dimensional Career Vector
- Genuine Passion
- Natural Competence
- Compound Growth
- High Ceiling

University offers the lowest cost of error experimentation across an entire lifetime.

## 2. High-Signal Information Tiers
Most people invert the information hierarchy: consuming 95% algorithmically generated social feeds and 5% foundational principles. Flipping this ratio toward enduring classics constructs resilient mental models.

## 3. Packaging Repeatable Work as Assets
Monetization in software and creative fields stems from packaging what you do repeatedly into self-contained, high-leverage assets.
"""

with open(os.path.join(dir5, "index.en.mdx"), "w", encoding="utf-8") as f:
    f.write(mdx5_en.strip() + "\n")

print("Created 5. weekly-review-2026-06-15")

# ==============================================================================
# 6. five-legal-security-labs
# ==============================================================================
slug6 = "five-legal-security-labs"
dir6 = os.path.join(BLOG_DIR, slug6)
os.makedirs(dir6, exist_ok=True)

cover6_bytes = download_bytes("https://mmbiz.qpic.cn/mmbiz_jpg/vzmZUnDhKp0PWs0dwNx4L5xVssOnyqF223b8tPZDspmqOiauBvr9FDYuZvrgtjZU9iaHD0NT6VP9EMeeFibbBZ0iabdrIeJWicaiaycmyX2hzFic60/0?wx_fmt=jpeg")
cover6 = make_1200x675_cover(cover6_bytes)
cover6.save(os.path.join(dir6, "cover.jpg"), "JPEG", quality=92)

# Download lab illustrations
labs = [
    ("dvwa.jpg", "https://mmbiz.qpic.cn/sz_mmbiz_jpg/vzmZUnDhKp1NqnqW39IFmzlNSER0NHHFo35NicG9xInia5RZIJJTz85mCIqM9llm3bXlE664fwqZicKDgXibhM9pnRctwq8LE6bkjMrtmakaYPE/640?wx_fmt=jpeg"),
    ("webgoat.jpg", "https://mmbiz.qpic.cn/sz_mmbiz_jpg/vzmZUnDhKp2md49KWZnRiaiawaWhQwSQ27bYDTaO6fadM95OIJ6W5QcQX69UmP4tVdAqPdmkXjmYN2xHyupqcjNe4FvHasBt0XfkKUicMU74Ik/640?wx_fmt=jpeg"),
    ("metasploitable2.jpg", "https://mmbiz.qpic.cn/sz_mmbiz_jpg/vzmZUnDhKp0Qs8Pia4cXNgdvRyArFf6m4ZVhGDD9puBBkDky6OdjeNgaXwBA6wfIiaL8Yeegj6gicVT7ucniabRCyo6wibwQ8Iu4gHRJW2AxgGTo/640?wx_fmt=jpeg"),
    ("pikachu.jpg", "https://mmbiz.qpic.cn/sz_mmbiz_jpg/vzmZUnDhKp0AqLdzHms8SWDyx5QNHJ4awBItiadRWN4iczwaic3iaftws9AMpoal2UpGNPADuBQxCket0n2fdibicHEBn4sfJudUwOXeVf8PczhoY/640?wx_fmt=jpeg"),
    ("bwapp.jpg", "https://mmbiz.qpic.cn/mmbiz_jpg/vzmZUnDhKp1xK8kIStZribqERmJIlPiaqYVicDjetrIry1UUfjt4lc5Il8oBD1gibFnwiclsrkVRdGOQ3Llcwn0erzlCFNaaaUTTgYAxIOIUbt9U/640?wx_fmt=jpeg")
]

for fname, url in labs:
    try:
        b = download_bytes(url)
        with open(os.path.join(dir6, fname), "wb") as f:
            f.write(b)
        print(f"Downloaded lab image: {fname}")
    except Exception as e:
        print(f"Failed to download {fname}: {e}")

mdx6 = """---
title: "大一网安新生亲测｜小白零踩坑！5个100%合法本地练手靶场"
date: "2026-04-08"
publishedAt: "2026-04-08T12:00:00.000Z"
summary: "DVWA、OWASP WebGoat、Metasploitable2、Pikachu、BWAPP，大一网安新生亲测的 5 个本地安全靶场推荐与避坑提醒。"
description: "DVWA、OWASP WebGoat、Metasploitable2、Pikachu、BWAPP，大一网安新生亲测的 5 个本地安全靶场推荐与避坑提醒。"
cover: "./cover.jpg"
coverWidth: 1200
coverHeight: 675
coverCaption: "网安入门 5 大合法本地靶场推荐"
tags: ["网络安全", "靶场实战", "DVWA", "WebGoat", "白帽安全"]
---

作为一名刚进入网络安全专业的大一新生，最常被学弟和同级朋友问到的问题就是：“我想练渗透测试和网络攻防，到底去哪里找目标？”

> **⚠️ 法律铁律（绝对红线）：技术无罪，但人必须守法！**
> 
> 所有测试与攻防演练，**绝对且只能在本地隔离虚拟机、或本人独立购买的专用测试服务器中进行！**
> 严禁扫描、探测或攻击任何未经官方明确书面授权的网络目标！别技术没学成，先喜提“银手镯”，那可就血亏到姥姥家了。

今天我把我亲手刷过多遍、100% 合法且适合小白入门打基础的 **5 大本地开源靶场** 一次性汇总给大家。

## 一、DVWA：网安人必刷的“Hello World”神级靶场

![DVWA 靶场主界面](./dvwa.jpg)

### 靶场介绍与特色
DVWA（Damn Vulnerable Web App）是全球公认的网安入门第一神级靶场。我刚入学时 Web 基础全靠它打牢，前后刷了不下 3 遍。

### 核心功能与等级
- 覆盖 SQL 注入、XSS 跨站脚本、任意文件上传、CSRF 跨站请求伪造等经典 Web 漏洞；
- 独创 **Low / Medium / High / Impossible** 四个安全防御级别，支持逐级对抗进阶；
- PHP + MySQL 架构，社区资料极度丰富。

### Docker 一键部署命令
```bash
docker run -d -p 80:80 vulnerables/web-dvwa
# 访问地址：http://localhost/login.php
# 默认凭据：admin / password
```
官方仓库：`https://github.com/digininja/DVWA`

## 二、OWASP WebGoat：官方亲妈级教学靶场

![OWASP WebGoat 学习路径](./webgoat.jpg)

### 靶场介绍与特色
OWASP 官方团队专为教学打造的“带教老师”级靶场。和别的靶场直接扔给你一个黑盒不同，WebGoat **先讲原理、再给场景、最后引导你完成修复**。

### 核心亮点
- 详细的原理解释与学习路径，每道题自带知识卡片与参考答案；
- 覆盖最新的 API 接口安全、JWT 令牌缺陷、反序列化等现代化漏洞；
- Java 体系构建，适合深入理解企业级后端防护。

### Docker 运行命令
```bash
docker run -d -p 8080:8080 -p 9090:9090 webgoat/webgoat-8.0
# 访问地址：http://localhost:8080/WebGoat
```

## 三、Metasploitable2：内网渗透与系统提权神器

![Metasploitable2 终端实操](./metasploitable2.jpg)

### 靶场介绍与特色
Metasploit 官方出品的“千疮百孔”Linux 虚拟机环境，专为练习内网渗透与系统级漏洞利用打造。

**⚠️ 重要注意：只能在 VMware/VirtualBox 的 Host-Only（仅主机）私有网络中运行，切勿桥接到公网！**

### 核心玩法
- 模拟真实内网主机，内置 Samba、vsftpd 弱口令及未修补漏洞；
- 绝佳的 Nmap 端口扫描与 Metasploit（MSF）自动化利用练习场；
- 默认凭证：`msfadmin / msfadmin`。

## 四、Pikachu（皮卡丘）：国内开发者打造的中文友好靶场

![Pikachu 中文界面](./pikachu.jpg)

### 靶场介绍与特色
很多新生看英文界面吃力，Pikachu 靶场是国内安全研究员开发的纯中文靶场，对新手极其友好，再也不用一边实操一边切翻译软件。

### 核心功能
- 全中文交互，每个关卡附带中文漏洞原理说明与新手提示；
- 包含“新手入门区”，手把手讲解常见 Burp Suite 抓包操作；
- 完美支持 phpStudy 快速解压启动。

## 五、BWAPP：漏洞类型最全的“百科全书”

![BWAPP 漏洞矩阵](./bwapp.jpg)

### 靶场介绍与特色
当你在 DVWA 和 Pikachu 通关后，想挑战更广泛的冷门漏洞场景，BWAPP（buggy Web Application）就是最好的进阶库，包含超过 100 种真实 Web 漏洞场景。

### Docker 运行命令
```bash
docker run -d -p 80:80 raesene/bwapp
# 访问：http://localhost/bWAPP/login.php
# 凭据：bee / bug
```

## 总结：稳永远比快重要

网络安全是一门重实践、重责任的学科。这 5 大本地靶场从基础 Web 注入到内网扫描全方位覆盖，足够我们在本地踏踏实实夯实基石。

**技术是用来守护网络空间清朗与资产安全的盾牌，绝非炫技犯险的工具。** 一起在合法合规的边界内精进成长！
"""

with open(os.path.join(dir6, "index.mdx"), "w", encoding="utf-8") as f:
    f.write(mdx6.strip() + "\n")

mdx6_en = """---
title: "Cybersecurity Freshman Review: 5 100% Legal Local Practice Labs"
date: "2026-04-08"
publishedAt: "2026-04-08T12:00:00.000Z"
description: "DVWA, WebGoat, Metasploitable2, Pikachu, and BWAPP: Hands-on local testing targets for ethical hacking beginners."
cover: "./cover.jpg"
coverWidth: 1200
coverHeight: 675
coverCaption: "Top 5 legal local penetration testing practice targets."
---

Ethical cybersecurity training requires strictly sandboxed local environments. Never probe unauthorized remote targets.

## 1. DVWA (Damn Vulnerable Web Application)
The quintessential benchmark with low-to-impossible difficulty gradients.

## 2. OWASP WebGoat
Guided educational walk-throughs covering API security, JWT attacks, and modern OWASP Top 10 vulnerabilities.

## 3. Metasploitable 2
Linux VM for practicing internal network port scanning, Samba exploits, and privilege escalation via Metasploit.

## 4. Pikachu
Intuitive Chinese-language web security training ground ideal for beginners.

## 5. BWAPP
An encyclopedia of over 100 real-world vulnerability edge cases.
"""

with open(os.path.join(dir6, "index.en.mdx"), "w", encoding="utf-8") as f:
    f.write(mdx6_en.strip() + "\n")

print("Created 6. five-legal-security-labs")

# ==============================================================================
# 7. kali-linux-penetration-testing-intro
# ==============================================================================
slug7 = "kali-linux-penetration-testing-intro"
dir7 = os.path.join(BLOG_DIR, slug7)
os.makedirs(dir7, exist_ok=True)

cover7_bytes = download_bytes("https://mmbiz.qpic.cn/mmbiz_jpg/vzmZUnDhKp1ysS8dicma8b73ko6YUiaOZyk7zKiaJGzcEibCRkkP3WxUib33wrrnT17ParI1757micJnW2XxNqNtK9iadFNTmziavOCktWAribpXchZ8/0?wx_fmt=jpeg")
cover7 = make_1200x675_cover(cover7_bytes)
cover7.save(os.path.join(dir7, "cover.jpg"), "JPEG", quality=92)

kali_imgs = [
    ("banner.jpg", "https://mmbiz.qpic.cn/sz_mmbiz_jpg/vzmZUnDhKp3y7IquF52yibfz2VuMLKRt3yutHWngjLjhLnOOOqhaI8HEWPBFr7UaL8FWEEzCJYgTL7aNdDocn4iaWlHA3T2EeDVDIcugfHt6k/640?wx_fmt=jpeg"),
    ("kali-screen.jpg", "https://mmbiz.qpic.cn/sz_mmbiz_jpg/vzmZUnDhKp39XyomPqnx0HJ9MjoGXDChcM7VLxURHhW52yNV99kxSrXwOFN5tibcPogO7LvN8nJ9wcnOw4mgJRgjicZG74DsQLHs2AftNYj3c/640?wx_fmt=jpeg"),
    ("fire-drill.jpg", "https://mmbiz.qpic.cn/mmbiz_jpg/vzmZUnDhKp32oiaK4mmExwiatbYsr8TdjsYiaaQ9nicJu4eFb6eFBzjiazn1ZiayrlQQKoeDySFxLkA8QhQXN9wVlz8r8zket5rqKucEZW7mJ6ib2U/640?wx_fmt=jpeg"),
    ("five-steps.jpg", "https://mmbiz.qpic.cn/mmbiz_jpg/vzmZUnDhKp1rTg05iaLia2DY7bjvUvlyROloSxIBBibLp5DOscYg3f9Z8OjdANQziaSLQmeMTfo16icjMjsz4YB6Sicmib9I1koLfqSTT8cGdX6j8E/640?wx_fmt=jpeg"),
    ("ai-learning.jpg", "https://mmbiz.qpic.cn/sz_mmbiz_jpg/vzmZUnDhKp0LSdsmnvRggOhFGpPwthXYWJhITdASHbrHF47Rf7pF2GuicyTib2fHpl7ym9ExQPpibyhggedH0KWPpicWlm5IzaHnjAaGV0POpVk/640?wx_fmt=jpeg"),
    ("legal-rules.jpg", "https://mmbiz.qpic.cn/mmbiz_jpg/vzmZUnDhKp2yF8YdNiaib5aX7OczViaBlghuIUiaUp5ZDrENIYkRibhQXwzHZfQ5bfqd0ibmYFGU0wY1bicGaBq6cCMiaSCK5V0lFUhWV6Z8fuyicibUw/640?wx_fmt=jpeg")
]

for fname, url in kali_imgs:
    try:
        b = download_bytes(url)
        with open(os.path.join(dir7, fname), "wb") as f:
            f.write(b)
        print(f"Downloaded kali image: {fname}")
    except Exception as e:
        print(f"Failed to download {fname}: {e}")

mdx7 = """---
title: "昨晚通宵搞定了Kali Linux，我用宿舍大白话把渗透测试讲透了"
date: "2026-04-03"
publishedAt: "2026-04-03T12:00:00.000Z"
summary: "通宵装通 Kali 之后，用宿舍聊天大白话拆解渗透测试五步走战略、合规红线与 AI 优先学习法。"
description: "通宵装通 Kali 之后，用宿舍聊天大白话拆解渗透测试五步走战略、合规红线与 AI 优先学习法。"
cover: "./cover.jpg"
coverWidth: 1200
coverHeight: 675
coverCaption: "宿舍大白话拆解网络安全渗透测试五步法"
tags: ["网络安全", "Kali Linux", "渗透测试", "网安入门"]
---

哈喽兄弟们！我是睡你们上铺、昨晚通宵把 Kali Linux 虚拟机跑通的网安大一新生。

最近咱们专业课开始接触网络安全。说实话，刚翻开厚厚的专业教材时，脑子里全是电影里那种满屏绿色代码翻滚、回车一敲黑掉卫星的酷炫画面。结果自己动手一装……好家伙，光是那个镜像文件解压和虚拟机配置，就差点把我可怜的笔记本 C 盘给撑爆了！

为了让大家少走弯路，今天我不讲那些干瘪难懂的学术术语，就用咱们在宿舍吹水的大白话，把**网络渗透测试**到底是个啥彻底讲清楚。

![Kali Linux 桌面与安全环境](./kali-screen.jpg)

## 一、保命声明：技术无罪，但人必须有底线

在聊任何实操之前，先把保命红线焊死在脑子里：

所有的攻防演练必须在具备合法授权的实验靶场（如学校实验内网、本地虚拟机）里进行！未获得官方正式书面授权，哪怕只是随手扫别人服务器一个端口，都有可能触犯《网络安全法》，喜提“银手镯”加退学套餐。

**咱们是修补大门的工匠，绝不是溜门撬锁的贼！**

## 二、渗透测试到底是什么？

书本上说它是“评估计算机系统安全性的一种授权攻击”。听得人云里雾里。

其实它就像学校组织的**消防安全演练**：
为了确保宿舍楼在真实火灾中不发生伤亡，保卫处会找专业人员模拟极端情况——烟雾传感器灵不灵？灭火器有没有过期？逃生通道有没有被乱停的电单车堵塞？

渗透测试（Penetration Testing）也是一模一样的道理：**在真黑客动手之前，模拟黑客的手法，提前帮系统把围墙上的破绽全找出来并打好补丁**。我们就是那个“拿着通行证的假黑客”。

## 三、渗透测试的“五步走”标准化工程

专业的渗透测试绝非在键盘上一顿瞎敲，而是一套极其严谨的工程体系，分为五个标准阶段：

![渗透测试五步走流程](./five-steps.jpg)

### 1. 信息收集（踩点查水表）
这是最耗时的一步，往往占到整个流程的 60% 以上。就像去拜访前必须摸清路线一样，你得查清：目标服务器开了哪些端口？运行着什么操作系统与中间件？
- **神级工具**：Nmap
- **常用命令**：
  ```bash
  nmap -sV -Pn 192.168.1.1
  ```

### 2. 漏洞分析（寻找破绽）
拿着收集到的服务版本信息，比对已知漏洞库（CVE）。目标跑的是没打补丁的旧版 Apache？还是数据库用了弱口令 `root/123456`？

### 3. 漏洞利用（翻窗进屋）
这一步是大家觉得最酷炫的环节——通过漏洞验证拿到系统权限。
在实验环境中使用 Metasploit（MSF）自动化利用框架，加载对应的 exploit 模块：
```bash
use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS 192.168.1.100
exploit
```
当屏幕上弹回 `meterpreter >` 交互会话时，说明验证成功，漏洞确实可被利用。

### 4. 后渗透分析（权限维持与横向排查）
进入主机后，检查系统提权路径、提取哈希口令（`hashdump`），评估攻击者如果进入该节点，是否能横向扩散危害内网其他核心业务。

### 5. 报告编写（交付核心价值）
**这是最繁琐、但最体现专业价值的一步**。必须形成严谨的书面报告：哪里存在漏洞、复现步骤是什么、风险等级多高、具体的修复加固建议怎么写。没有合规报告，所有测试行为在法理上都缺乏依据。

## 四、AI 时代的“偷懒”学习法

咱们是身处 AI 时代的大学生，千万不要死记硬背那些枯燥复杂的命令行参数了！

![AI 辅助网安学习](./ai-learning.jpg)

1. **遇到报错直接抛给 AI**：把终端报错信息直接喂给模型，它两秒钟就能告诉你是不是内核依赖缺失或内存分配不足；
2. **通俗化概念理解**：搞不懂“TCP 三次握手”或“SYN 洪水攻击”？直接让 AI 用“食堂排队打饭被插队”的比喻讲给你听；
3. **辅助脚本编写**：让 AI 搭建 Python 扫描脚本的基础骨架，自己负责审查逻辑与调校参数。

## 总结

渗透测试和非法攻击的根本区别只有三条：**书面授权、明确范围、无破坏性**。

希望咱们都能踏踏实实打牢技术根基，做网络空间坚定的守护者！
"""

with open(os.path.join(dir7, "index.mdx"), "w", encoding="utf-8") as f:
    f.write(mdx7.strip() + "\n")

mdx7_en = """---
title: "All-Nighter with Kali Linux: Demystifying Penetration Testing in Dorm Terms"
date: "2026-04-03"
publishedAt: "2026-04-03T12:00:00.000Z"
description: "Demystifying penetration testing workflows, legal boundaries, and AI-accelerated learning from a dorm room all-nighter."
cover: "./cover.jpg"
coverWidth: 1200
coverHeight: 675
coverCaption: "Dorm-style breakdown of the five penetration testing phases."
---

Setting up a Kali Linux VM in a freshman dorm room leads quickly to a sobering truth: cinema representations of hacking bear little resemblance to systematic security engineering.

## 1. Penetration Testing as a Fire Drill
Like simulating building fires to verify alarm operability, ethical hacking tests defenses before malicious actors strike.

## 2. The 5-Phase Pipeline
1. **Reconnaissance & Footprinting**: Nmap port enumeration and service banner scanning.
2. **Vulnerability Analysis**: Cross-referencing version strings against CVE registries.
3. **Exploitation**: Controlled proof-of-concept execution via Metasploit.
4. **Post-Exploitation**: Assessing blast radius, privilege escalation, and lateral movement.
5. **Remediation Reporting**: Formulating actionable patch strategies.

## 3. Strict Legal Compliance
Written scope, bounded authorization, and zero destruction form the non-negotiable boundaries of ethical practice.
"""

with open(os.path.join(dir7, "index.en.mdx"), "w", encoding="utf-8") as f:
    f.write(mdx7_en.strip() + "\n")

print("Created 7. kali-linux-penetration-testing-intro")

# ==============================================================================
# 8. campus-data-card-for-alma-mater
# ==============================================================================
slug8 = "campus-data-card-for-alma-mater"
dir8 = os.path.join(BLOG_DIR, slug8)
os.makedirs(dir8, exist_ok=True)

cover8_bytes = download_bytes("http://mmecoa.qpic.cn/sz_mmecoa_jpg/QpypzewO3AHZha9gcWutUQBZsD13V2icNzh04wfUpvZwZNhvXjlm9ClpZW30vHAcn9Xa2jxXOupj5TznEsKRXqg/0?wx_fmt=jpeg")
cover8 = make_1200x675_cover(cover8_bytes)
cover8.save(os.path.join(dir8, "cover.jpg"), "JPEG", quality=92)

# Copy authentic dashboard image
dashboard_src = os.path.join(ASSETS_DIR, "驾驶舱-主页.png")
if os.path.exists(dashboard_src):
    shutil.copy2(dashboard_src, os.path.join(dir8, "dashboard.png"))
    print("Copied authentic dashboard.png to campus-data-card-for-alma-mater")

mdx8 = """---
title: "我花了3周，给母校做了套数据活名片：把枯燥数字变成招生王牌"
date: "2025-10-26"
publishedAt: "2025-10-26T12:00:00.000Z"
summary: "把枯燥的在校生人数、就业率和升学率转化为可互动浏览的五大可视化模块，把数字变成动人的招生王牌。"
description: "把枯燥的在校生人数、就业率和升学率转化为可互动浏览的五大可视化模块，把数字变成动人的招生王牌。"
cover: "./cover.jpg"
coverWidth: 1200
coverHeight: 675
coverCaption: "给母校打造的招生与就业数据活名片"
tags: ["数据可视化", "母校名片", "产品设计", "独立项目"]
---

一直在想，一所高职院校的真实办学数字，到底该怎么被大众真正看见。

以前传统的招生宣讲与宣传材料，要么是一张干瘪的折线图，要么是一段念稿式的官方汇报：
在校生 12,500 人、初次就业率 96.3%、专任教师 586 名、专升本录取率 78.1%……
数字密密麻麻印在册子上，但家长和考生翻过去就忘了。为什么？因为这些数字冷冰冰的，**缺乏画面感**。

这三周我沉下心来做的，就是把这些沉睡在报表里的枯燥数字，变成一块能被自由“漫游浏览”的交互式数字活名片。

![母校数据活名片驾驶舱主页](./dashboard.png)

*母校数据活名片交互驾驶舱：将五大核心维度转化为可视化的叙事看板*

## 一、核心思路：把学校当成一个可以被“逛”的产品

我没有一上来就去罗列图表，而是先站在考生和家长的视角问自己：如果一个人想真正了解这所位于江西的高校，他的认知动线是怎样的？

顺着这个思路，我把整套系统重构为五个递进的叙事模块，就像带着一位新生实地漫游校园一样，自然连贯：

**学校概况 → 师资力量 → 教学成果 → 竞赛高光 → 设施资源**

每一个模块，专注回答一个最关切的问题：
- 这所学校有多大体量？
- 授课老师是什么水准？
- 毕业生发展与升学通道顺畅吗？
- 学生在全国技能大赛中拿过什么奖项？
- 宿舍与实训硬件条件到底怎么样？

## 二、五个模块的精准定位

### 1. 学校概况（底盘初印象）
打头阵的概况看板将 12,500 名在校生、占地面积与重点院系设置清晰陈列，让访客在 3 秒内对学校办学规模形成坚实直观的宏观概念。

### 2. 师资力量（从数字到面孔）
586 名教师不再只是一个数字。系统细分了高级职称与“双师型”骨干教师的占比，把“有多少好老师”转化为“好老师结构长什么样”。

### 3. 教学成果（升学托举力）
在这一板块，**78.1% 的专升本升学率** 被设为全屏视觉焦点。对于很多专科生家庭而言，相比宽泛的就业率，这个数字更直接证明了学校能否托举学子向更高平台跨越。

### 4. 竞赛成果（高光时刻见证实训）
按国家级、省级与行业赛分类陈列历年获奖。奖杯不是装饰，而是专业技能硬实力的实证。

### 5. 设施资源（学习生活沉浸感）
工业级实训基地、数字化图书馆与标准化公寓环境，配上真实指标参数，让未来的校园生活触手可及。

## 三、设计的底层原则：把数字翻译为“画面”

同组数字，写在 Word 文档里没人读，做成一块有对比、有主次、能交互钻取的看板，人们就会主动停下来探索。

在这次设计中，我恪守了三条铁律：
1. **一个屏幕只突出一个核心主焦点**，其余辅助数据合理降噪；
2. **严谨的色彩层级系统**：重要指标采用品牌强调色，次要参数退回低对比度背景；
3. **模块既能独立成篇，组合起来又是一条闭环叙事**。

在招生宣讲现场打开这套数据看板，其说服力远胜厚厚厚十页宣传册。

三周的熬夜打磨并不轻松，但看到那些原本埋在年报里的数字第一次变得生动可触、让人记得住，就觉得所有付出都无比值得。

**数字本身或许不发声，但把数字讲成动人的画面，它就能照亮人心。**
"""

with open(os.path.join(dir8, "index.mdx"), "w", encoding="utf-8") as f:
    f.write(mdx8.strip() + "\n")

mdx8_en = """---
title: "Building a Live Interactive Data Card for My Alma Mater in 3 Weeks"
date: "2025-10-26"
publishedAt: "2025-10-26T12:00:00.000Z"
description: "Transforming dry institutional statistics—12,500 students, 78.1% upgrade rates—into an engaging visual dashboard."
cover: "./cover.jpg"
coverWidth: 1200
coverHeight: 675
coverCaption: "Live interactive admissions and institutional data dashboard engineered for Jiangxi Engineering Vocational College."
---

Institutional statistics printed in admissions pamphlets often fail to connect with students. Numbers like 12,500 enrolled students and a 78.1% vocational-to-university transition rate remain abstract unless spatialized.

Over three weeks, I designed and coded an interactive digital dashboard breaking institutional data into five intuitive chapters:
1. **Campus Overview**: Instant scale orientation.
2. **Faculty Excellence**: Structured breakdown of dual-qualification educators.
3. **Educational Outcomes**: Centering the 78.1% degree progression milestone.
4. **Competition Honors**: Empirical proof of vocational craft.
5. **Infrastructure & Facilities**: Practical residential and lab capacity metrics.

## Design Philosophy: Turning Data into Architecture
A single screen must center one primary metric. When data tells a visual story, it compounds credibility.
"""

with open(os.path.join(dir8, "index.en.mdx"), "w", encoding="utf-8") as f:
    f.write(mdx8_en.strip() + "\n")

print("Created 8. campus-data-card-for-alma-mater")
print("ALL 8 POSTS GENERATED SUCCESSFULLY!")
