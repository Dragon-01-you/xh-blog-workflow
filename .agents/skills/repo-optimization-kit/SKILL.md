---
name: repo-optimization-kit
description: "把任意 GitHub 仓库优化到顶尖开源项目标准的一站式技能：门面（Hero/徽章/演示）、仓库级 SEO（描述、20 个 topics、社交预览）、GEO/AEO（让 ChatGPT/Perplexity/Claude 引用你的仓库）、README 分档与黄金结构、配图与 30 秒宣传片流水线、CI/Release/社区文件、脱敏与安全扫描。用于新仓库发布前包装、既有仓库改造、README 重写、宣传片制作，或用户提到 repo SEO、GEO、README polish、demo GIF、social preview、对标顶尖仓库时。"
license: MIT
compatibility: "需要 Python 3.10+；scripts/benchmark.py 需要网络与 GITHUB_TOKEN；SVG 渲染需要 headless Chrome（或 rsvg-convert 降级），其余脚本零依赖。"
metadata:
  author: xh-forensics
  version: "2.0.0"
  updated: "2026-11-04"
---

# Repo Optimization Kit

把仓库包装成「值得点 star」的样子。**先判断仓库属于哪一档，再按 rubric 打分，最后只交两份产物。**
所有结论必须带证据；没有证据的「已优化」等于没做。

## When to use

- 「帮我包装 / 优化 README / 加徽章和演示」
- 「怎么让 AI 搜索引用我的项目」（GEO / AEO / llms.txt）
- 「做一个 30 秒宣传片 / 终端 GIF / 社交预览图」
- 「对标 XX 仓库，我们差在哪」← 用 `benchmark.py`
- 「发布前检查一遍，别丢人」

## 确定性触发映射

| 用户说的 | 走哪条流程 | 必读 |
|---|---|---|
| 优化这个仓库 / 包装一下 / 发布前检查 | 全量：Stage 0→7 | 本文全部 |
| 只看 README / 重写 README | Stage 0 + 2 + 5，跳过视频与 CI | `03-readme.md` |
| 让 AI 搜索收录 / GEO / AEO | Stage 0 + 4 | `02-geo.md` |
| 做演示 GIF / 宣传片 / 配图 | Stage 0 + 3 | `04-visuals.md` 或 `05-promo-video.md` |
| 对标某个顶流仓库 | `scripts/benchmark.py` → 差距表 | `08-archetypes.md` |
| 要发布 / 发版 | Stage 6 + `06-ci-release.md` | — |

## Commands

| 命令 | 作用 | 产出 |
|---|---|---|
| `python3 scripts/audit.py <repo>` | 本地全量审计（7 维 100 分） | 评分卡 + 优先修复 |
| `python3 scripts/audit.py <repo> --artifacts` | 同上，落盘两份交付物 | `REPO-AUDIT.md` + `ACTION-PLAN.md` |
| `python3 scripts/benchmark.py <owner/repo> ...` | 远程对标顶尖仓库 | 差距表 + 可偷招式 |
| `python3 scripts/render_svg.py a.svg a.png` | SVG → 2x PNG | 高清配图 |
| `python3 scripts/make_terminal_gif.py ...` | 终端演示 GIF | `assets/demo.gif` |
| `python3 scripts/crop_social_preview.py ...` | 16:9 → 1280×640 | `assets/social_preview.jpg` |
| `bash scripts/verify_push.sh <owner/repo>` | 推送前后安全检查 | PASS/FAIL |

## Workflow

### Stage 0 · 定档（先做，决定后面所有取舍）

| 档位 | 特征 | README 策略 |
|---|---|---|
| **路由器** | 有独立文档站 / 官网 | 20–40 行：一句话 + Hero + 文档链接 + 贡献 + 协议 |
| **手册** | 无文档站，README 就是唯一入口 | 完整结构（本 kit 的黄金结构） |
| **研究型** | 论文/模型/实验产物 | 结果先行：指标表 + 图 + 复现命令 + 引用 |

判错档位的代价：手册写成路由器 → 用户装不起来；路由器写成手册 → 首屏被目录淹没。
详见 [08-archetypes.md](references/08-archetypes.md)。

### Stage 1 · 采集证据（不许先下结论）

```bash
python3 scripts/audit.py <repo> --json /tmp/audit.json
python3 scripts/benchmark.py <owner/repo> <对标1> <对标2>   # 可选
```

- 远端元数据（description / topics / homepage / license）**只能通过 API 或网页确认**
- 社交预览图**没有任何 API**，必须人工确认或明确写进「未完成项」
- 拿不到的数据 → 标 `Hypothesis`，不要猜成事实

### Stage 2 · 门面与元数据

描述公式、20 个 topics 的四类配比、命名一致性、社交预览 →
[01-repo-seo.md](references/01-repo-seo.md)

### Stage 3 · 视觉资产

SVG 作唯一事实源 → Chrome 2x；终端 GIF；社交裁切；极简 editorial 规范 →
[04-visuals.md](references/04-visuals.md)

### Stage 4 · GEO（AI 搜索）

`llms.txt`、定义句前置、问答表、事实表、机读数据、实体一致性、20 条查询集度量 →
[02-geo.md](references/02-geo.md)

### Stage 5 · 内容与 README

黄金结构、排版微规则、锚点、双语同构、内容诚实度 →
[03-readme.md](references/03-readme.md)
宣传片 → [05-promo-video.md](references/05-promo-video.md)

### Stage 6 · 工程与发布

CI 矩阵、三层测试、Release Notes 四段式、社区六件套 →
[06-ci-release.md](references/06-ci-release.md)

### Stage 7 · 验收与交付

```bash
python3 scripts/audit.py <repo> --artifacts      # 必须比 Stage 1 分数高
bash scripts/verify_push.sh <owner/repo>
```

浏览器/抽帧复核：图片 200、GIF 播放、徽章渲染、目录可点、表格不溢出、片尾地址正确。

## 证据契约（每条发现都要长这样）

```
Finding:  README 首屏没有动态演示
Evidence: README.md 前 30 行无 .gif/.mp4 引用（scripts/audit.py: demo=fail）
Impact:   8 秒内看不到"它会动"，跳出率显著上升；GEO 也少一个可引用素材
Fix:      录一次真实运行，按 04-visuals.md 出 820×500 GIF，<1MB，放 H1 之后
Confidence: Confirmed
```

置信标签只有三档：

| 标签 | 什么时候用 |
|---|---|
| `Confirmed` | 有脚本输出 / API 返回 / 截图可直接证明 |
| `Likely` | 结构信号强但缺一环（如图片存在但未确认是否裂图） |
| `Hypothesis` | 无法验证（无权限、无 API、需人工）——必须写进「未完成项」 |

## 交付物（固定两份，缺一不可）

1. **`REPO-AUDIT.md`** —— 评分卡：总分/等级、七维得分、逐项 ✅⚠️❌、置信标签
2. **`ACTION-PLAN.md`** —— 按「收益/成本」排序的修复清单：做什么、改哪个文件、怎么验证、谁来做（AI / 人工）

模板：[templates/REPO-AUDIT.md](templates/REPO-AUDIT.md)、[templates/ACTION-PLAN.md](templates/ACTION-PLAN.md)。

## 评分规则

权重、档位锚点、加分项、常见误判 → [00-rubric.md](references/00-rubric.md)
（rubric 是**唯一事实源**，改权重只改这一处和 `scripts/audit.py`。）

## 硬约束

- **不虚构**：演示、案例、数字必须来自真实运行；估算要标 `~`
- **环境失败 ≠ 仓库缺陷**：网络/权限/限流导致的失败标为 `Environment limitation`，继续跑其余项，不重试死循环
- **不堆词**：每个形容词都要能被一个事实替换
- **人工步骤必须显式列出**：社交预览上传、域名/DNS、付费服务
- **一次 PR 一件事**：大改 README 前先开分支

## 参考索引（按需读，别一次全读）

| 文件 | 内容 |
|---|---|
| [00-rubric.md](references/00-rubric.md) | 评分权重、等级锚点、证据格式、误判清单 |
| [01-repo-seo.md](references/01-repo-seo.md) | 描述 / topics / 命名 / 社交预览 |
| [02-geo.md](references/02-geo.md) | GEO/AEO 原理、llms.txt、分发与度量 |
| [03-readme.md](references/03-readme.md) | 黄金结构、排版、锚点、双语 |
| [04-visuals.md](references/04-visuals.md) | SVG→PNG、GIF、社交图、风格规范 |
| [05-promo-video.md](references/05-promo-video.md) | 30 秒片全流水线 |
| [06-ci-release.md](references/06-ci-release.md) | CI / 测试 / Release / 社区文件 |
| [07-gotchas.md](references/07-gotchas.md) | 权限、渲染、Shell、视频、合规踩坑 |
| [08-archetypes.md](references/08-archetypes.md) | 三档 README + uv/whisper/shadcn 拆解 |
