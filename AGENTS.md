# site-2（芯火个人品牌博客 · AI 协作总规矩）

> **文件通俗解释**：这份 `AGENTS.md` 就是贴在工地大门口的**「AI 施工总规矩」**。不管哪个 AI 进来干活，第一眼必须先读它。

**准备接手干活？（Picking up work?）** 请先阅读 [`docs/handoff.md`](./docs/handoff.md)（**交接班记录本**）——里面写着当前做到了哪一步、接下来要干什么、以及绝对不能踩的雷区。

---

## Agent skills（AI 技能与目录设置）

### Issue tracker（施工小工单存放在哪）

本项目的「自动规划需求书（`spec.md`）」与「拆分后的施工小工单（`issues`）」全部作为本地中文 Markdown 文件存放在 `.scratch/<功能名>/` 文件夹下。详见 [`docs/agents/issue-tracker.md`](./docs/agents/issue-tracker.md)。

### Triage labels（工单状态标签怎么贴）

使用 5 个标准状态标签来标记每张工单的进度（待评估 `needs-triage`、缺信息 `needs-info`、AI 可直接干 `ready-for-agent`、需人工拍板 `ready-for-human`、决定不做 `wontfix`）。详见 [`docs/agents/triage-labels.md`](./docs/agents/triage-labels.md)。

### Design（视觉与交互原型标准）

所有界面与动画开发必须严格遵守 [`docs/design-language.md`](./docs/design-language.md)（**视觉原型与交互标准说明书**）。在写界面或检查动画时，必须调用 `emil-design-eng`（**界面细节与物理动效打磨技能**）。

### Domain docs（内部黑话词典与技术拍板记录）

采用单项目结构：根目录下的 [`GLOSSARY.md`](./GLOSSARY.md) 是本项目的**「内部黑话与统一用词词典」**，[`docs/adr/`](./docs/adr/) 文件夹存放所有的**「技术选型拍板备忘录（ADR）」**。详见 [`docs/agents/domain.md`](./docs/agents/domain.md)。
