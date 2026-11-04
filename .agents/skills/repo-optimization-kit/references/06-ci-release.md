# 06 · CI / Release / 社区文件

## 1. CI（第一个 workflow 就够了）

```yaml
name: CI
on:
  push: {branches: [main]}
  pull_request:
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        python-version: ['3.10', '3.11', '3.12', '3.13']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: {python-version: '${{ matrix.python-version }}', cache: pip}
      - run: pip install -r requirements.txt ruff
      - run: ruff check . --select F,E9          # 只拦真实错误
      - run: python -m yourpkg --version         # CLI 冒烟
      - run: python -m yourpkg <cmd> --help > /dev/null
      - run: python tests/run_smoke.py           # 秒级零成本用例
```

设计要点：

- **只查 `F,E9`**：风格噪声（行长、引号）不该让 CI 变红
- **冒烟要秒级完成**：任何带 `sleep`/网络重试的流程都别进 CI
- 矩阵跑 3.10–3.13：版本兼容问题在 CI 暴露，比在用户机器上暴露便宜
- 徽章只有 CI 绿了才会亮；红色徽章不如不放

## 2. 测试的三层

| 层 | 内容 | 要求 |
|---|---|---|
| 单元 | 纯函数/判定逻辑 | 零外部依赖，CI 必跑 |
| 回归 | 历史案例 → 期望结论 | 权重调整时防止静默改判 |
| 冒烟 | CLI 入口 + 零成本路径 | 秒级，验证"能启动" |

没有测试框架也行：`python tests/test_xxx.py` 用 `assert` + 退出码，
简单、无依赖、CI 一行命令。

## 3. Release

```bash
gh release create v1.2.3 --title "v1.2.3 — {主题}" --notes-file notes.md --target main
```

Notes 结构（四段，不要写成变更流水账）：

```markdown
## 定位
一句话说这次版本解决什么。

## 新增
- {能力}：{一句话说明 + 一个数字}

## 质量
- CI 矩阵 3.10–3.13 全绿；回归基准 X/X

## 验证
- {真实案例/实测结果}

**Full Changelog**: https://github.com/{o}/{r}/compare/v1.2.2...v1.2.3
```

- tag 与 `__version__` 严格一致
- 版本号只保留一处来源（`dynamic = ["version"]`）
- 每次 Release 都写"为什么"，Release 页本身也是 SEO/GEO 语料

## 4. 社区文件

| 文件 | 必含 |
|---|---|
| `CONTRIBUTING.md` | PR 五步、本地验证命令、**脱敏铁律**、欢迎方向 |
| `SECURITY.md` | 私密报告渠道、响应时限、密钥安全声明 |
| `CODE_OF_CONDUCT.md` | 简洁版即可（Contributor Covenant） |
| `.github/ISSUE_TEMPLATE/bug_report.md` | 环境、复现步骤、**脱敏提醒** |
| `.github/ISSUE_TEMPLATE/feature_request.md` | 先问题后方案 |
| `.github/pull_request_template.md` | 改了什么 / 怎么验证 / 是否含敏感数据 |

## 5. pyproject 最小正确姿势

```toml
[project]
name = "{pkg}"
dynamic = ["version"]
description = "{双语一句话}"
requires-python = ">=3.10"
dependencies = ["..."]           # 依赖越少越可信

[project.scripts]
{cmd} = "{pkg}.cli:main"

[project.urls]
Homepage = "https://github.com/{o}/{r}"
Repository = "..."
Issues = ".../issues"
Changelog = ".../blob/main/CHANGELOG.md"

[tool.setuptools.dynamic]
version = {attr = "{pkg}.__version__"}
```

- 命令名与包名一致；旧命令可留兼容别名
- `pip install git+https://github.com/{o}/{r}.git` 必须能跑通（写进 README 前先试）

## 6. 验收

- [ ] CI 在 4 个 Python 版本上全绿，徽章亮
- [ ] `python -m {pkg} --version` 与 tag 一致
- [ ] `pip install git+...` 全新环境可装
- [ ] 六个社区文件齐全
- [ ] Release Notes 有"定位 + 验证"，不是裸 changelog
