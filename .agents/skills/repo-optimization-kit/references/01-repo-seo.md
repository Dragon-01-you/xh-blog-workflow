# 01 · 仓库级 SEO

> 目标：让人在 GitHub 搜索、Google 搜索、以及"别人推荐"这三个入口都能撞见你。

## 1. About 描述（最高权重，5 分钟见效）

**公式**：`[它是什么]：[三个核心能力，顿号分隔] | [English one-liner]`

```
AI 中转站 API 验真取证工具：模型验真 · 系统提示词提取 · 上下游供应链溯源 | LLM relay API forensics: verify models, extract system prompts, trace upstream supply chains
```

- 前 80 字符必须能独立成句（移动端会截断）
- 上限 160 字符；中文占比高时字母数更少，够用
- 不写"最好用""一站式"——写**可验证的功能名词**
- 中英双语：GitHub 的英文用户占比高，但中文用户搜中文词

```bash
curl -s -X PATCH https://api.github.com/repos/{owner}/{repo} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -d '{"description":"..."}'
# 注意是 PATCH；PUT 会 404
```

> 权限坑：GitHub App 的 user token（`ghu_`）通常没有 `Administration: write`，
> 改 description / topics / 改名都会 `403 Resource not accessible by integration`。
> 遇到就交给用户在网页操作——不要让 AI 死磕。

## 2. Topics（GitHub 搜索流量的直接入口，上限 20）

四类词各占 4–6 个，**不要堆同义词**：

| 类别 | 作用 | 例子 |
|---|---|---|
| 生态词 | 被"技术栈 + 需求"检索到 | `python` `cli-tool` `developer-tools` `terminal` |
| 领域大词 | 被泛需求检索到 | `security` `ai-security` `llm` `observability` |
| 竞品关联词 | 搜竞品的人撞到你 | `openai-api` `chatgpt` `claude` `deepseek` |
| 功能词 | 被精确需求检索到 | `forensics` `prompt-extraction` `api-testing` |

````bash
curl -s -X PUT https://api.github.com/repos/{owner}/{repo}/topics \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github.mercy-preview+json" \
  -d '{"names":["python","cli-tool","llm","ai-security","openai-api","deepseek"]}'
````

选词判断：**这个词在 GitHub 搜索框里打出来，前 20 个结果里有你的竞品吗？** 有 → 值得占。

## 3. 命名一致性（长期收益最大）

`仓库名 = 包名 = 命令名 = 文档里的产品名`。

- Python：`name = "xh-forensics"` + `[project.scripts] xh = ...`
- 旧命令保留为兼容别名（`api-detective = ...`），老用户脚本不断
- 改名后 GitHub 保留 **301**：`github.com/old/repo` 与 `raw.githubusercontent.com/old/...` 都还能用
- 但**像素里的名字不会自动跳转**——README 里的图片、宣传片片尾、社交预览图都需要重做

## 4. 徽章矩阵（≤ 8 枚，别变成圣诞树）

必备 5 枚：

```
CI      https://github.com/{o}/{r}/actions/workflows/ci.yml/badge.svg
License https://img.shields.io/badge/license-MIT-{color}.svg
Runtime https://img.shields.io/badge/python-3.10%2B-blue.svg
Stars   https://img.shields.io/github/stars/{o}/{r}?style=social
Version https://img.shields.io/badge/version-1.2.3-blue.svg
```

可选：Downloads、Docs、Discord。**每多一枚，首屏的可读性就下降一点。**

## 5. 社交预览图（唯一必须手动的一步）

- 规格：**1280×640（2:1）、JPG、<1 MB**
- GitHub **没有公开 API**（REST/GraphQL 都不暴露）——只能 Settings → Social preview → Upload
- 制作：设计一张 16:9 主图，再用 `scripts/crop_social_preview.py` 居中裁成 2:1
- 图里放：产品名 + 一句话 + 一个数字；**不要放小字**（在信息流里只有拇指大
- 素材本身存 `assets/social_preview.jpg` 入库，方便下次换

## 6. 搜索排序的真实因素（按影响排序）

1. 仓库名与描述里的关键词匹配
2. Topics 覆盖
3. Star / fork / 最近更新时间
4. README 是否包含用户搜索的原句（"how to verify API relay"）
5. 外部链接（awesome-list、博客、HN/Reddit 帖子）
6. Release 与 CHANGELOG 的更新频率

> 结论：**描述和 topics 是你能立刻改的 40%，剩下 60% 靠内容与分发。**

## 7. 验收

- [ ] `curl /repos/{o}/{r}` 返回的 `description` 长度 40–160
- [ ] `/topics` 返回 ≥ 10 个，四类齐全
- [ ] `homepage` 字段非空
- [ ] 社交预览图已上传（**必须人工确认**，API 查不到）
- [ ] README 首屏图片、徽章、GIF 全部 200
- [ ] 改名后旧地址 301 仍然有效
