# Repo Optimization Kit · v2.0

把任意 GitHub 仓库包装到「值得点 star」的水准。**给 AI 用，不给人用。**

- 一个主技能 `SKILL.md`（读完就知道按什么顺序干，含确定性触发映射）
- 10 份参考手册（按需加载，不占上下文）
- 6 个可运行脚本（审计 / 对标 / 渲染 / GIF / 裁切 / 安全检查）
- 6 个模板（审计报告 / 行动清单 / README / llms.txt / 元数据 / 分镜表）

## 怎么交给别的 AI

**方式一（推荐）**：把整个 `repo-optimization-kit/` 放进它的 skills 目录。
`SKILL.md` 的 `name` 与目录名一致，符合 Agent Skills 规范。

**方式二**：上传 zip，配一句话：

> 用 `repo-optimization-kit` 优化这个仓库。先跑 `scripts/audit.py <repo> --artifacts`
> 出 `REPO-AUDIT.md` + `ACTION-PLAN.md`，然后按 SKILL.md 的 Stage 0→7 执行。
> 每阶段给我验证证据（curl 状态 / CI run / 截图 / 抽帧）；做不到的标 `Hypothesis` 并写进未完成项。

**方式三**：只复制 `SKILL.md` + `scripts/audit.py`，其余按需再取。

## 5 分钟上手

```bash
# 1. 判档 + 打分 + 出两份交付物
python3 scripts/audit.py /path/to/repo --artifacts ./out

# 2. 对标顶流仓库（需要 GITHUB_TOKEN）
python3 scripts/benchmark.py owner/repo

# 3. 按 ACTION-PLAN 改，重跑审计看分数变化
python3 scripts/audit.py /path/to/repo
```

评分：门面 18 / SEO 18 / **GEO 22** / 内容 16 / 社区 10 / 工程 10 / 安全 6。
`>=80` 返回 0，可接 CI 做「门面不许退步」。

## 包含什么

```
SKILL.md                   AI 主入口：触发映射 / 命令表 / Stage 0-7 / 证据契约
references/
  00-rubric.md             评分权重、等级锚点、证据格式、常见误判（唯一事实源）
  01-repo-seo.md           描述公式 / 20 topics / 命名 / 社交预览
  02-geo.md                llms.txt / 问答结构 / 事实表 / 机读数据 / 分发与度量
  03-readme.md             README 黄金结构 / 排版 / 锚点 / 双语
  04-visuals.md            SVG→PNG / 终端 GIF / 社交图 / 极简风格
  05-promo-video.md        30 秒片：八镜 / 母版 / 三件套 / 抽帧 QA
  06-ci-release.md         CI 矩阵 / 三层测试 / Release / 社区文件
  07-gotchas.md            权限、渲染、Shell、视频、合规踩坑表
  08-archetypes.md         三档 README + uv / whisper / shadcn 拆解
scripts/
  audit.py                 7 维 100 分 + --artifacts 双产物
  benchmark.py             远程对标顶流，输出差距与可偷招式（判档后再比）
  render_svg.py            SVG → 2x PNG（Chrome，失败降级 rsvg/ImageMagick）
  make_terminal_gif.py     纯 PIL 终端演示 GIF
  crop_social_preview.py   16:9 → 1280×640
  verify_push.sh           推送前后敏感信息检查
templates/
  REPO-AUDIT.md            审计报告骨架（含置信标签与环境限制）
  ACTION-PLAN.md           行动清单骨架（P0/P1/P2 + 验证方式）
  README.skeleton.md       README 填空骨架
  llms.txt                 AI 爬虫入口
  repo-metadata.json       描述 / topics / 社交预览规范
  film-outline.md          30 秒片分镜表
examples/
  REPO-AUDIT.md            真实评分卡样例
  ACTION-PLAN.md           同一次审计的修复清单
```

## v2.0 相比 v1 的关键变化

| 变化 | 为什么 |
|---|---|
| 新增 **Stage 0 定档**（路由器/手册/研究型） | 一份 README 不可能同时服务三种场景；档位定错，后面全白做 |
| 新增 `references/00-rubric.md` | 评分口径有唯一事实源，可复算、可回归 |
| 新增 `references/08-archetypes.md` | 直接拆解 uv / whisper / shadcn，把「顶流长什么样」变成可对照的清单 |
| 新增 `scripts/benchmark.py` | 不只说「要优秀」，而是拉到真实顶流仓库旁边比 |
| `audit.py --artifacts` | 对齐成熟 skill 的交付契约：固定两份产物，而不是一段聊天回复 |
| SKILL.md 增加触发映射 + 证据契约 | 用户说一句话就能路由到固定流程；每条发现必须带 Evidence/Fix/Confidence |
| 明确「环境失败 ≠ 仓库缺陷」 | 限流、无权限、无 API 的项标 `Hypothesis`，不误伤 |

## 设计来源（都是公开可查的真实样本）

- [Agent Skills 规范](https://agentskills.io/specification)：frontmatter 约束、正文 <500 行、渐进披露、引用一层深
- [anthropics/skills](https://github.com/anthropics/skills)：官方 SKILL.md 写法与自包含目录
- [Agentic SEO Skill](https://github.com/Bhanunamikaze/Agentic-SEO-Skill)：确定性触发映射、证据格式、rubric、固定交付物
- [astral-sh/uv](https://github.com/astral-sh/uv)：深浅色 Hero、基准图、带数字的 Highlights
- [openai/whisper](https://github.com/openai/whisper)：顶部链接行、平台安装矩阵、可整行引用的事实表
- [shadcn-ui/ui](https://github.com/shadcn-ui/ui)：README 作为路由器，20 行也够

## 它不做什么

- 不替你编造功能、案例或数据
- 不能通过 API 上传社交预览图（GitHub 未开放，必须人工点一次）
- 不保证排名或引用率（GEO 是概率游戏，方法只提高上限）
- 不处理私有仓库的权限模型

## 一条总原则

> **每个优化点都要可验证。** 改完立刻 curl 一次、截图一次、抽帧一次。
> 没有验证证据的「已优化」，等于没做。
