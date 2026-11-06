# 参与贡献指南 (Contributing to xh-blog-workflow)

感谢你关注并愿意为 **xh-blog-workflow** 做出贡献！

本项目致力于为个人创作者提供一套**高精度、防破坏、零样条降级**的瑞士纸墨质感博客生产体系。我们欢迎 Bug 修复、文档翻译优化以及新型展示组件的拓展。

---

## 贡献铁律

1. **绝对脱敏**: 提交的代码与 Pull Request 中，严禁夹带任何个人敏感密钥（如 API Tokens、私有服务器凭据等）。
2. **K 代码核心保护原则**: 未经充分讨论，不得擅自修改锁定在 `.kernel-lock.json` 中的 49 个核心内核文件。
3. **测试全绿**: 任何 PR 合并前，必须确保本地 74 个 Vitest 测试与 TypeScript 类型检查全部通过。

---

## 本地开发与验证流程

```bash
# 1. 克隆仓库
git clone https://github.com/Dragon-01-you/xh-blog-workflow.git
cd xh-blog-workflow

# 2. 安装依赖
pnpm install

# 3. 运行本地开发服务器
pnpm dev

# 4. 运行内核哈希校验与单元测试
python scripts/xh_blog_cli.py verify-kernel
pnpm test:run
pnpm exec tsc --noEmit
```

---

## 提交 PR 步骤

1. Fork 本仓库并基于 `main` 分支拉取新的特性分支（例如 `feature/new-card-layout`）。
2. 编写你的改动并保证本地测试全部通过。
3. 提交 Commit（采用 Conventional Commits 规范，例如 `feat: ...` 或 `fix: ...`）。
4. 提交 Pull Request，并在描述中详述改动背景与验证截图。
