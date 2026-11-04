# 08 · 三档 README 与顶流拆解

> 先定档，再写。档位错了，后面所有优化都是白费。

## 1. 三档判定

| 档位 | 判定问题 | 结构 | 长度 |
|---|---|---|---|
| **路由器** | 你有独立文档站吗？ | 一句话 + Hero + 文档链接 + 贡献 + 协议 | 20–40 行 |
| **手册** | 用户只能从 README 学会用吗？ | 完整黄金结构（03-readme.md） | 150–400 行 |
| **研究型** | 卖点是论文/模型/实验结果吗？ | 链接行 + 指标表 + 图 + 复现命令 + 引用 | 100–250 行 |

混合情况取**主形态**：有文档站但快速开始仍需在 README（uv 就是这种，归"手册但指向文档"）。

## 2. 案例 A · shadcn/ui —— 路由器的极限

```markdown
# shadcn/ui

A set of beautifully designed components that you can customize, extend, and build on.
...
![hero](apps/v4/public/opengraph-image.png)

## Documentation
Visit https://ui.shadcn.com/docs to view the documentation.

## Contributing
Please read the [contributing guide](/CONTRIBUTING.md).

## License
Licensed under the [MIT license](./LICENSE.md).
```

**总共不到 90 个词。** 它敢这么短，是因为：

- 首图就是产品本身（组件画廊），图比字更有说服力
- 文档站承接 100% 的学习成本
- 首段用 "Open Source. Open Code." 这种短句立住调性
- 用 "**Use this to build your own component library**" 明确使用场景

**可偷**：如果你的 README 超过 300 行但已有文档站，砍到 30 行，把细节迁走。

**不可偷**：没有文档站时照抄 = 用户装不起来。

## 3. 案例 B · uv —— 手册的标杆

结构顺序（逐条都有用意）：

1. **3 枚徽章**（版本 / 支持版本 / Discord）——不堆
2. **一句话定义**：`An extremely fast Python package and project manager, written in Rust.`
3. **Hero 是基准图**，且用 `<picture>` 同时给深浅色两套图，下面一行斜体图注：
   `Installing Trio's dependencies with a warm cache.`
4. **Highlights**：每条都带**可验证数字或边界**
   - `10-100x faster` → 链到 `BENCHMARKS.md`
   - "replaces pip, pip-tools, pipx, poetry, pyenv, twine, virtualenv" → 用列举建立定位
   - "Installable without Rust or Python via curl or pip"
5. **Installation**：macOS/Linux、Windows、pip、pipx 四种方式，每种一个独立代码块
6. **Documentation** 一行外链，然后才进 Features
7. **Features** 每节一个真实终端 transcript（带耗时），不是伪代码

**可偷的四件事**：

- Hero 用**能证明卖点的图**（基准/对比/输出），不用装饰图
- 深浅色 `<picture>`：GitHub 暗色用户占一半
- 每个 claim 后面挂一个可点的证据文件
- 安装给全平台，每种方式单独代码块（复制即用）

## 4. 案例 C · whisper —— 研究型的事实密度

1. **顶部链接行**：`[[Blog]] [[Paper]] [[Model card]] [[Colab example]]` —— 四类读者一步到位
2. **一句话定义**：general-purpose speech recognition model
3. **Approach 图**：一张架构图解释"为什么一个模型能替代整条流水线"
4. **Setup**：先给版本约束，再给 5 个平台的 ffmpeg 装法（Ubuntu/Arch/macOS/Chocolatey/Scoop）
5. **模型事实表**：`Size / Parameters / English-only / Multilingual / VRAM / Relative speed`

这张表是全篇最重要的一段——**AI 回答"whisper 哪个模型适合我"时，会整行摘走它**。

6. **性能图 + WER/CER 说明**，并把细节指向论文附录 D.1/D.2/D.4
7. **CLI 用法 → Python 用法 → More examples → License**

**可偷的三件事**：

- 顶部链接行：论文/模型卡/博客/Colab，四类入口一次给全
- **参数表必须包含"用户决策所需的列"**（显存、相对速度），不是只列名字
- 细节不塞进 README，指向论文附录（保持可读 + 保留可核查）

## 5. 顶流共性（对照自查）

| 特征 | uv | whisper | shadcn | 你的仓库 |
|---|:---:|:---:|:---:|---|
| 一句话定义在第一屏 | ✅ | ✅ | ✅ | ? |
| Hero 图解释卖点 | ✅（基准） | ✅（架构） | ✅（产品） | ? |
| 每个 claim 有证据链接 | ✅ | ✅ | — | ? |
| 多平台/多方式安装 | ✅ | ✅ | — | ? |
| 事实表（可整行引用） | ✅ | ✅ | — | ? |
| 顶部外链行 | — | ✅ | ✅ | ? |
| 文档站分流 | ✅ | — | ✅ | ? |
| 协议与贡献入口 | ✅ | ✅ | ✅ | ? |
| 总长度 | 长 | 中 | 极短 | ? |

## 6. 决策清单

- [ ] 我属于哪一档？（路由器 / 手册 / 研究型）
- [ ] 我的 Hero 图能证明什么？（证明不了就换成能证明的）
- [ ] 我的第一个 claim 带数字吗？有对应证据文件吗？
- [ ] 安装方式覆盖用户的主要平台吗？
- [ ] 有没有一张"决策表"（选型/参数/档位），能被整行摘走？
- [ ] 我的 README 长度与档位匹配吗？

## 参考

- [shadcn-ui/ui README](https://github.com/shadcn-ui/ui)
- [astral-sh/uv README](https://github.com/astral-sh/uv)
- [openai/whisper README](https://github.com/openai/whisper)
