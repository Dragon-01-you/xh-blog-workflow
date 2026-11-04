#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""audit.py — 仓库门面 / SEO / GEO / 内容 / 社区 / 工程 / 安全 审计。

零依赖（纯标准库）。默认离线，只读本地仓库；加 --remote 可补查 GitHub 元数据。

用法:
    python3 scripts/audit.py /path/to/repo
    python3 scripts/audit.py /path/to/repo --json report.json
    python3 scripts/audit.py /path/to/repo --remote owner/name --token $GITHUB_TOKEN

退出码: 0 总分 >= 80；1 总分 < 80（便于接 CI 做"门面不许退步"）。
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path

SKIP_DIRS = {".git", "node_modules", ".venv", "venv", "dist", "build",
             "__pycache__", ".mypy_cache", ".ruff_cache", ".next", "target"}
TEXT_SUFFIX = {".py", ".js", ".ts", ".md", ".yml", ".yaml", ".json", ".sh",
               ".toml", ".cff", ".txt", ".env", ".cfg", ".ini", ".rb", ".go"}
SECRET_RE = [
    (re.compile(r"sk-[A-Za-z0-9]{16,}"), "OpenAI 风格 key"),
    (re.compile(r"gh[pousr]_[A-Za-z0-9]{20,}"), "GitHub token"),
    (re.compile(r"AKIA[0-9A-Z]{16}"), "AWS access key"),
    (re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"), "私钥"),
]
DOMAIN_RE = re.compile(r"[a-z0-9-]+\.(?:com|cn|net|org|io|ai)\b", re.I)


# ----------------------------------------------------------------------
# 基础
# ----------------------------------------------------------------------
def read(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return ""


def find_case_insensitive(root: Path, names: tuple[str, ...]) -> Path | None:
    for p in root.iterdir():
        if p.is_file() and p.name.lower() in names:
            return p
    return None


def walk(root: Path):
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            yield Path(dirpath) / fn


def load_pyproject(root: Path) -> dict:
    text = read(root / "pyproject.toml")
    out: dict = {"raw": text}
    m = re.search(r'name\s*=\s*"([^"]+)"', text)
    if m:
        out["name"] = m.group(1)
    m = re.search(r'description\s*=\s*"([^"]+)"', text)
    if m:
        out["description"] = m.group(1)
    m = re.search(r"keywords\s*=\s*\[(.*?)\]", text, re.S)
    if m:
        out["keywords"] = re.findall(r'"([^"]+)"', m.group(1))
    out["scripts"] = re.findall(r'^([A-Za-z0-9_.\-]+)\s*=\s*"[^"]+"',
                                text.split("[project.scripts]")[-1], re.M)
    out["urls"] = re.findall(r'^[A-Za-z]+\s*=\s*"https?://[^"]+"', text, re.M) \
        if "[project.urls]" in text else []
    return out


def badge_count(md: str) -> int:
    return len(re.findall(r"\[!\[", md)) + len(re.findall(r"<img[^>]+badge", md, re.I))


def md_links(md: str) -> list[str]:
    return re.findall(r"!\[[^\]]*\]\(([^)\s]+)", md) + \
        re.findall(r'<img[^>]+src="([^"]+)"', md, re.I)


def has_section(md: str, *keywords: str) -> bool:
    head = re.findall(r"^#{2,3}\s+.*$", md, re.M)
    for h in head:
        if any(k.lower() in h.lower() for k in keywords):
            return True
    return False


def check(cid: str, group: str, weight: float, status: str,
          detail: str, fix: str = "") -> dict:
    return {"id": cid, "group": group, "weight": weight, "status": status,
            "detail": detail, "fix": fix}


def ok(cid, group, weight, detail, fix=""):
    return check(cid, group, weight, "pass", detail, fix)


def warn(cid, group, weight, detail, fix=""):
    return check(cid, group, weight, "warn", detail, fix)


def bad(cid, group, weight, detail, fix=""):
    return check(cid, group, weight, "fail", detail, fix)


def skip(cid, group, weight, detail):
    return check(cid, group, weight, "skip", detail)


# ----------------------------------------------------------------------
# 各检查组
# ----------------------------------------------------------------------
def audit_facade(root: Path, md: str) -> list[dict]:
    g, r = "facade", []
    readme = find_case_insensitive(root, ("readme.md", "readme.rst"))
    r.append(ok("readme", g, 2, f"README {readme.name}") if readme
             else bad("readme", g, 2, "缺 README", "先写 README.md：一句话价值 + 快速开始"))

    first_h1 = re.search(r"^#\s+(.+)$", md, re.M)
    r.append(ok("h1", g, 1, first_h1.group(1)[:60]) if first_h1
             else bad("h1", g, 1, "README 没有 H1", "首行用 # 项目名 + 一句定位"))

    head = "\n".join(md.splitlines()[:30])
    has_hero = bool(md_links(head)) or "<img" in head.lower()
    r.append(ok("hero", g, 2, "首屏有图") if has_hero
             else warn("hero", g, 2, "首屏没有图", "Hero 图/横幅放在 H1 之后，width=100%"))

    n_badges = badge_count(md)
    r.append(ok("badges", g, 3, f"{n_badges} 枚徽章") if n_badges >= 4
             else warn("badges", g, 3, f"仅 {n_badges} 枚徽章",
                       "补 CI / stars / license / version / Python 版本 至少 4 枚"))

    has_demo = bool(re.search(r"!\[[^\]]*\]\([^)]*\.(gif|mp4|webm)", md, re.I)) \
        or bool(re.search(r"<video", md, re.I))
    r.append(ok("demo", g, 3, "有 GIF/视频演示") if has_demo
             else warn("demo", g, 3, "没有动态演示", "30 秒 GIF 或 mp4 放在首屏之后"))

    toc_links = len(re.findall(r"^-\s*\[[^\]]+\]\(#", md, re.M))
    r.append(ok("toc", g, 2, f"目录 {toc_links} 项") if toc_links >= 5
             else warn("toc", g, 2, "目录缺失或过短", "长 README 必须有可点击目录"))

    en = find_case_insensitive(root, ("readme_en.md", "readme.en.md", "readme-en.md"))
    r.append(ok("readme_en", g, 2, f"英文版 {en.name}") if en
             else warn("readme_en", g, 2, "没有英文 README", "README_EN.md 互链，扩大受众"))

    lic = find_case_insensitive(root, ("license", "license.md", "license.txt"))
    r.append(ok("license", g, 1, lic.name if lic else "") if lic
             else bad("license", g, 1, "缺 LICENSE", "MIT/Apache-2.0 择一并写进 README 徽章"))

    missing = []
    for link in md_links(md):
        if link.startswith(("http://", "https://", "data:", "#")):
            continue
        if not (root / link.split("?")[0]).exists():
            missing.append(link)
    r.append(ok("images_exist", g, 2, "图片链接全部可解析") if not missing
             else bad("images_exist", g, 2, f"图片缺失: {missing[:3]}",
                      "修好相对路径——README 裂图是最刺眼的自毁"))
    return r


def audit_seo(root: Path, md: str, meta: dict) -> list[dict]:
    g, r = "seo", []
    desc = meta.get("description") or ""
    n = len(desc)
    if not desc:
        r.append(bad("description", g, 2, "pyproject 无 description",
                     "写双语描述：中文价值 + English pitch，<=160 字符"))
    elif 20 <= n <= 200:
        r.append(ok("description", g, 2, f"{n} 字符"))
    else:
        r.append(warn("description", g, 2, f"{n} 字符偏{'长' if n > 200 else '短'}",
                      "压到 40–160 字符，前 80 字符放核心卖点"))

    kw = meta.get("keywords") or []
    r.append(ok("keywords", g, 2, f"{len(kw)} 个关键词") if len(kw) >= 5
             else warn("keywords", g, 2, "pyproject keywords 不足 5 个",
                       "补生态词 / 领域大词 / 竞品词 / 功能词"))

    r.append(ok("urls", g, 2, "有 Homepage/Repository 链接") if meta.get("urls")
             else warn("urls", g, 2, "pyproject 无 [project.urls]",
                       "补 Homepage / Repository / Issues / Changelog"))

    cite = find_case_insensitive(root, ("citation.cff",))
    r.append(ok("citation", g, 2, "CITATION.cff") if cite
             else warn("citation", g, 2, "无 CITATION.cff",
                       "学术引用入口，GitHub 会渲染 Cite this repository 按钮"))

    name = (meta.get("name") or "").lower()
    scripts = [s.lower() for s in (meta.get("scripts") or [])]
    dirname = root.resolve().name.lower()
    norm = lambda s: re.sub(r"[-_.]", "", s)  # noqa: E731
    aligned = bool(name) and (norm(name) == norm(dirname) or norm(name) in
                              [norm(s) for s in scripts])
    if not name:
        r.append(skip("naming", g, 4, "无 pyproject name，跳过一致性"))
    elif aligned:
        r.append(ok("naming", g, 4, f"仓库名 ≈ 包名 {name}"))
    else:
        r.append(warn("naming", g, 4, f"目录 {dirname} / 包 {name} 不一致",
                      "仓库名 = 包名 = 命令名，长期省下大量解释成本（改名请留 301）"))

    body = re.sub(r"^#.*", "", md, flags=re.M).strip()
    lead = body[:220]
    one_liner = bool(lead) and len(re.split(r"[。.!?]\s*", lead)[0]) <= 120
    r.append(ok("one_liner", g, 3, "开头是一句话定位") if one_liner
             else warn("one_liner", g, 3, "开头段落过长",
                       "H1 后第一段 <=120 字，先给定义再展开"))

    r.append(ok("h1_name", g, 1, "H1 含项目名") if first_h1_name(md, name, meta.get("scripts"))
             else warn("h1_name", g, 1, "H1 不含项目名/命令名", "H1 用项目名 + 一句价值"))

    social = find_case_insensitive(root, ("social_preview.jpg", "social_preview.png"))
    if not social:
        social = root / "assets" / "social_preview.jpg"
    r.append(ok("social", g, 2, "有社交预览素材") if social.exists()
             else warn("social", g, 2, "缺 assets/social_preview.jpg",
                       "1280×640 JPG <1MB；GitHub 无 API，只能网页 Settings 上传"))
    return r


def first_h1_name(md: str, name: str, scripts: list | None = None) -> bool:
    """H1 是否含项目名或命令名（兼容中文产品名 + 英文包名的组合）。"""
    m = re.search(r"^#\s+(.+)$", md, re.M)
    if not m:
        return False
    h1 = re.sub(r"[-_.\s]", "", m.group(1).lower())
    cands = [re.sub(r"[-_.]", "", (name or "").lower())]
    cands += [re.sub(r"[-_.]", "", s.lower()) for s in (scripts or [])]
    return any(c and c in h1 for c in cands)


def audit_geo(root: Path, md: str, meta: dict) -> list[dict]:
    g, r = "geo", []
    llms = find_case_insensitive(root, ("llms.txt",))
    llms_body = read(llms) if llms else ""
    r.append(ok("llms", g, 5, "llms.txt 存在") if llms
             else bad("llms", g, 5, "缺 llms.txt",
                      "AI 爬虫的入口文件：H1 + 一句话摘要 + 关键链接（见 templates/llms.txt）"))
    if llms:
        structured = llms_body.startswith("# ") and ">" in llms_body[:400] \
            and len(re.findall(r"\]\(http", llms_body)) >= 3
        r.append(ok("llms_struct", g, 3, "H1+摘要+链接齐备") if structured
                 else warn("llms_struct", g, 3, "结构不完整",
                           "首行 # 项目名；第二段 > 一句话定义；下面列 3+ 关键链接"))
    else:
        r.append(skip("llms_struct", g, 3, "无文件"))

    answer = bool(re.search(r"(它能回答|能回答|What it answers|Questions it answers|"
                            r"FAQ|常见问题)", md, re.I))
    r.append(ok("answer_first", g, 3, "有问答式结构") if answer
             else warn("answer_first", g, 3, "没有问答结构",
                       "把「它能回答 N 个问题」做成表格：问题 → 怎么回答"))

    tables = re.findall(r"^\|.+\|\s*$", md, re.M)
    r.append(ok("facts_table", g, 2, f"{len(tables)} 行表格") if len(tables) >= 6
             else warn("facts_table", g, 2, "事实表格过少",
                       "数字/规格/对比用表格——AI 引用时可整行摘走"))

    r.append(ok("comparison", g, 2, "有对比章节") if has_section(md, "对比", "比较", "compare", "alternatives")
             else warn("comparison", g, 2, "没有同类对比",
                       "「X vs Y」是 AI 回答里最高频的引用形态"))

    data_files = [p for p in walk(root)
                  if p.suffix in (".json", ".csv") and p.stat().st_size < 2_000_000
                  and "package-lock" not in p.name and "pyproject" not in p.name
                  and not p.name.startswith(".")][:20]
    r.append(ok("machine_data", g, 3, f"{len(data_files)} 个可机读数据文件") if len(data_files) >= 2
             else warn("machine_data", g, 3, "没有结构化数据",
                       "情报/规则/参数表另存 JSON/CSV——比散文更易被检索与引用"))

    r.append(ok("faq", g, 2, "有 FAQ") if has_section(md, "faq", "常见问题")
             else warn("faq", g, 2, "没有 FAQ", "用 <details> 折叠真实问题，问答可被抓取"))

    name = (meta.get("name") or "").lower()
    if not name:
        r.append(skip("entity", g, 2, "无包名，跳过实体一致性"))
    else:
        variants = {name, name.replace("-", "_"), name.replace("-", "")}
        counts = {v: md.lower().count(v) for v in variants}
        main_n = counts.get(name, 0)
        r.append(ok("entity", g, 2, f"主名出现 {main_n} 次") if main_n >= 5
                 else warn("entity", g, 2, f"主名仅出现 {main_n} 次",
                           "全文统一实体名（含别名说明），AI 才能把它识别成一个实体"))
    return r


def audit_content(root: Path, md: str) -> list[dict]:
    g, r = "content", []
    r.append(ok("quickstart", g, 2, "有快速开始") if has_section(md, "快速开始", "quick start", "getting started", "上手")
             else warn("quickstart", g, 2, "无快速开始章节", "三步上手：装 → 跑 → 看结果"))

    code_blocks = len(re.findall(r"^```", md, re.M)) // 2
    r.append(ok("code_blocks", g, 2, f"{code_blocks} 个代码块") if code_blocks >= 4
             else warn("code_blocks", g, 2, f"只有 {code_blocks} 个代码块",
                       "至少给安装、最小示例、进阶用法的可复制命令"))

    r.append(ok("env_table", g, 2, "有环境/依赖表") if has_section(md, "环境要求", "requirements", "依赖")
             else warn("env_table", g, 2, "无环境要求表", "Python/Node 版本 + 依赖说明，减少劝退"))

    r.append(ok("architecture", g, 2, "有架构/原理图") if has_section(md, "工作原理", "架构", "how it works", "architecture")
             or "```mermaid" in md else warn("architecture", g, 2, "无架构说明", "一张流程图胜过三段文字"))

    r.append(ok("roadmap", g, 2, "有路线图") if has_section(md, "路线图", "roadmap") or re.search(r"- \[[ x]\]", md)
             else warn("roadmap", g, 2, "无路线图", "复选框式 roadmap，让读者知道下一步"))

    r.append(ok("changelog", g, 2, "有 CHANGELOG") if find_case_insensitive(root, ("changelog.md",))
             else warn("changelog", g, 2, "无 CHANGELOG", "按 Keep a Changelog 记录，发布可追溯"))

    r.append(ok("case", g, 2, "有真实案例") if has_section(md, "案例", "case", "实战")
             else warn("case", g, 2, "无案例", "脱敏案例 + 前后对比，可信度靠这个"))
    return r


def audit_community(root: Path, md: str) -> list[dict]:
    g, r = "community", []
    checks = [
        ("contributing", 2, ("contributing.md",), "贡献指南"),
        ("security", 2, ("security.md",), "安全披露流程"),
        ("coc", 2, ("code_of_conduct.md", "code-of-conduct.md"), "行为准则"),
    ]
    for cid, w, names, label in checks:
        hit = find_case_insensitive(root, names)
        r.append(ok(cid, g, w, hit.name) if hit
                 else warn(cid, g, w, f"缺 {label}", f"补 {names[0]}，开源项目的信任基础设施"))
    tpl = root / ".github" / "ISSUE_TEMPLATE"
    n_tpl = len(list(tpl.glob("*.md"))) if tpl.is_dir() else 0
    r.append(ok("issue_tpl", g, 2, f"{n_tpl} 个 Issue 模板") if n_tpl >= 1
             else warn("issue_tpl", g, 2, "无 Issue 模板", "bug / feature 两个模板即可"))
    pr_tpl = root / ".github" / "pull_request_template.md"
    r.append(ok("pr_tpl", g, 1, "PR 模板") if pr_tpl.exists()
             else warn("pr_tpl", g, 1, "无 PR 模板", "列出本地验证命令与脱敏要求"))
    r.append(ok("contrib_link", g, 1, "README 有贡献入口") if re.search(r"contributing|参与贡献|contributing\.md", md, re.I)
             else warn("contrib_link", g, 1, "README 没链接到贡献指南", "加一行「欢迎 PR」并链过去"))
    return r


def audit_engineering(root: Path) -> list[dict]:
    g, r = "engineering", []
    wf = root / ".github" / "workflows"
    n_wf = len(list(wf.glob("*.yml")) + list(wf.glob("*.yaml"))) if wf.is_dir() else 0
    r.append(ok("ci", g, 4, f"{n_wf} 个 workflow") if n_wf >= 1
             else bad("ci", g, 4, "没有 CI", "至少一个 lint + 冒烟 job，徽章才有东西可亮"))

    tests = root / "tests"
    n_t = len(list(tests.rglob("test_*.py"))) if tests.is_dir() else 0
    r.append(ok("tests", g, 2, f"{n_t} 个测试文件") if n_t >= 1
             else warn("tests", g, 2, "没有测试", "哪怕一个 smoke test，也比裸奔可信"))

    deps = (root / "requirements.txt").exists() or (root / "pyproject.toml").exists() \
        or (root / "package.json").exists()
    r.append(ok("deps", g, 2, "依赖声明齐备") if deps
             else bad("deps", g, 2, "无依赖声明", "requirements.txt / pyproject.toml"))

    init = find_case_insensitive(root, ("__init__.py",))
    if init is None:
        pkgs = [p / "__init__.py" for p in root.iterdir()
                if p.is_dir() and (p / "__init__.py").exists()]
        init = pkgs[0] if pkgs else None
    version_srcs = []
    if init:
        version_srcs = re.findall(r'__version__\s*=\s*"[^"]+"', read(init))
    r.append(ok("version", g, 1, "版本单一来源") if version_srcs
             else warn("version", g, 1, "未发现 __version__", "版本只留一处，tag 与之对齐"))

    r.append(ok("manifest", g, 1, "有 MANIFEST.in/打包配置") if (root / "MANIFEST.in").exists()
             or "tool.setuptools" in read(root / "pyproject.toml")
             else warn("manifest", g, 1, "打包清单缺失", "确保 README/数据文件随包分发"))
    return r


def audit_security(root: Path) -> list[dict]:
    g, r = "security", []
    hits = []
    scanned = 0
    for p in walk(root):
        if p.suffix.lower() not in TEXT_SUFFIX or p.stat().st_size > 1_000_000:
            continue
        scanned += 1
        text = read(p)
        for rx, label in SECRET_RE:
            if rx.search(text):
                hits.append((str(p.relative_to(root)), label))
                break
    r.append(ok("secrets", g, 3, f"扫描 {scanned} 个文本文件，无硬编码密钥") if not hits
             else bad("secrets", g, 3, f"疑似密钥: {hits[:3]}",
                      "立刻撤销并改用环境变量；历史提交需 rewrite"))

    gi = read(root / ".gitignore")
    leaky = [ln for ln in gi.splitlines()
             if ln.strip() and not ln.strip().startswith("#") and DOMAIN_RE.search(ln)]
    r.append(ok("gitignore", g, 2, ".gitignore 为泛化规则") if not leaky
             else bad("gitignore", g, 2, f".gitignore 含具体域名: {leaky[:2]}",
                      ".gitignore 会公开——具体目标名放 .git/info/exclude"))

    big = [p for p in walk(root) if p.stat().st_size > 10_000_000]
    r.append(ok("large_files", g, 1, "无 >10MB 文件") if not big
             else warn("large_files", g, 1, f"{len(big)} 个大文件: {[str(p.name) for p in big[:2]]}",
                       "大文件进 Release 或 LFS，别污染 clone"))
    return r


# ----------------------------------------------------------------------
# 远端（可选）
# ----------------------------------------------------------------------
def audit_remote(owner_repo: str, token: str | None) -> list[dict]:
    g = "remote"
    if not token:
        return [skip("remote_all", g, 0, "未提供 token，跳过远端元数据检查")]
    import urllib.request
    req = urllib.request.Request(
        f"https://api.github.com/repos/{owner_repo}",
        headers={"Authorization": f"Bearer {token}",
                 "Accept": "application/vnd.github+json",
                 "User-Agent": "repo-audit"})
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.load(resp)
    except Exception as e:  # noqa: BLE001
        return [skip("remote_all", g, 0, f"远端查询失败: {str(e)[:80]}")]
    topics = data.get("topics") or []
    desc = data.get("description") or ""
    return [
        ok("remote_desc", g, 0, f"About 描述 {len(desc)} 字符") if 40 <= len(desc) <= 200
        else warn("remote_desc", g, 0, f"About 描述 {len(desc)} 字符，需 40–160",
                  "PATCH /repos/{owner}/{repo} 更新 description"),
        ok("remote_topics", g, 0, f"{len(topics)} 个 topics") if len(topics) >= 10
        else warn("remote_topics", g, 0, f"仅 {len(topics)} 个 topics",
                  "凑满 20 个：生态 + 领域 + 竞品 + 功能"),
        ok("remote_homepage", g, 0, data.get("homepage") or "") if data.get("homepage")
        else warn("remote_homepage", g, 0, "Website 字段为空", "填演示站或文档站"),
        ok("remote_license", g, 0, "检测到开源协议") if data.get("license")
        else warn("remote_license", g, 0, "未检测到 license", "加 LICENSE 文件"),
    ]


# ----------------------------------------------------------------------
GROUPS = [
    ("facade", "门面", 18),
    ("seo", "SEO", 18),
    ("geo", "GEO（AI 搜索）", 22),
    ("content", "内容深度", 16),
    ("community", "社区", 10),
    ("engineering", "工程", 10),
    ("security", "安全", 6),
]


def summarize(results: list[dict]) -> dict:
    groups = {}
    for key, label, maxp in GROUPS:
        rs = [r for r in results if r["group"] == key]
        total = sum(x["weight"] for x in rs if x["status"] != "skip")
        got = sum(x["weight"] * (1 if x["status"] == "pass" else 0.5 if x["status"] == "warn" else 0)
                  for x in rs if x["status"] != "skip")
        groups[key] = {"label": label, "max": maxp,
                       "earned": round(maxp * got / total, 1) if total else 0,
                       "checks": len(rs)}
    score = round(sum(v["earned"] for v in groups.values()))
    grade = "A" if score >= 90 else "B" if score >= 80 else "C" if score >= 65 else "D" if score >= 45 else "E"
    return {"score": score, "grade": grade, "groups": groups}


def render_md(path: Path, results: list[dict], s: dict) -> str:
    lines = [f"# 仓库优化审计：`{path.name}`", "",
             f"**总分 {s['score']}/100 · 等级 {s['grade']}**", "",
             "| 维度 | 得分 | 满分 | 状态 |", "|---|---:|---:|---|"]
    for key, g in s["groups"].items():
        ratio = g["earned"] / g["max"] if g["max"] else 0
        mark = "✅" if ratio >= 0.85 else "⚠️" if ratio >= 0.6 else "❌"
        lines.append(f"| {g['label']} | {g['earned']:.1f} | {g['max']} | {mark} |")
    lines += ["", "## 逐项结果", ""]
    icon = {"pass": "✅", "warn": "⚠️", "fail": "❌", "skip": "⏭️"}
    for key, label, _ in GROUPS:
        rs = [r for r in results if r["group"] == key]
        if not rs:
            continue
        lines += [f"### {label}", ""]
        for x in rs:
            lines.append(f"- {icon[x['status']]} **{x['id']}** — {x['detail']}")
    rs_remote = [r for r in results if r["group"] == "remote"]
    if rs_remote:
        lines += ["### 远端（GitHub API）", ""]
        for x in rs_remote:
            lines.append(f"- {icon[x['status']]} **{x['id']}** — {x['detail']}")
    fixes = sorted([r for r in results if r["status"] in ("fail", "warn")],
                   key=lambda r: -r["weight"])
    if fixes:
        lines += ["", "## 优先修复（按权重收益排序）", ""]
        for i, x in enumerate(fixes[:8], 1):
            lines.append(f"{i}. **{x['id']}**（{x['weight']} 分）— {x['fix'] or x['detail']}")
    lines += ["", "> 由 `scripts/audit.py` 生成；远端字段需 `--remote owner/repo --token`。"]
    return "\n".join(lines) + "\n"


def render_action_plan(root: Path, results: list[dict], s: dict) -> str:
    """把 warn/fail 转成按「收益/成本」排序的行动清单。"""
    manual = {"social", "remote_desc", "remote_topics", "remote_homepage", "large_files"}
    fixes = [r for r in results if r["status"] in ("fail", "warn") and r["weight"] > 0]
    fixes.sort(key=lambda r: (0 if r["weight"] >= 5 else 1 if r["weight"] >= 2 else 2,
                              -r["weight"]))
    lines = [f"# 行动清单 · `{root.name}`", "",
             f"> 当前 {s['score']}/100（{s['grade']}）。排序按「收益/成本」，不是按容易程度。", "",
             "| # | 优先级 | 动作 | 目标 | 执行者 | 验证 | 状态 |",
             "|---|:---:|---|---|---|---|---|"]
    for i, r in enumerate(fixes, 1):
        p = "P0" if r["weight"] >= 5 else "P1" if r["weight"] >= 2 else "P2"
        who = "人工" if r["id"] in manual else "AI"
        verify = {
            "social": "Settings 肉眼确认", "llms": "curl raw → 200",
            "ci": "gh run list → success", "secrets": "重新跑 audit.py",
        }.get(r["id"], "重跑 audit.py 该项变 ✅")
        lines.append(f"| {i} | {p} | {r['fix'] or r['detail']} | `{r['id']}` | "
                     f"{who} | {verify} | ☐ |")
    lines += ["", "## 未完成项", "",
              "- 社交预览图：GitHub 无公开 API，需人工在 Settings 上传",
              "- 远端元数据：需 `--remote owner/repo --token` 才能核验", ""]
    return "\n".join(lines)


def main() -> int:
    ap = argparse.ArgumentParser(description="仓库门面 / SEO / GEO / 社区 / 工程 / 安全审计")
    ap.add_argument("repo", help="本地仓库路径")
    ap.add_argument("--json", default=None, help="输出 JSON 报告路径")
    ap.add_argument("--out", default=None, help="输出 Markdown 报告路径（默认仅打印）")
    ap.add_argument("--artifacts", nargs="?", const=".", default=None, metavar="DIR",
                    help="落盘两份交付物 REPO-AUDIT.md + ACTION-PLAN.md 到 DIR（默认当前目录）")
    ap.add_argument("--remote", default=None, metavar="OWNER/REPO", help="补查 GitHub 远端元数据")
    ap.add_argument("--token", default=os.environ.get("GITHUB_TOKEN"), help="GitHub token（默认读环境变量）")
    args = ap.parse_args()

    root = Path(args.repo).expanduser().resolve()
    if not root.is_dir():
        print(f"路径不存在: {root}", file=sys.stderr)
        return 2
    md = read(find_case_insensitive(root, ("readme.md",)) or Path("/dev/null"))
    meta = load_pyproject(root)

    results: list[dict] = []
    results += audit_facade(root, md)
    results += audit_seo(root, md, meta)
    results += audit_geo(root, md, meta)
    results += audit_content(root, md)
    results += audit_community(root, md)
    results += audit_engineering(root)
    results += audit_security(root)
    if args.remote:
        results += audit_remote(args.remote, args.token)

    s = summarize(results)
    report = render_md(root, results, s)
    print(report)
    if args.out:
        Path(args.out).write_text(report, encoding="utf-8")
    if args.json:
        Path(args.json).write_text(json.dumps(
            {"repo": str(root), "summary": s, "checks": results},
            ensure_ascii=False, indent=2), encoding="utf-8")
    if args.artifacts:
        outdir = Path(args.artifacts)
        outdir.mkdir(parents=True, exist_ok=True)
        (outdir / "REPO-AUDIT.md").write_text(report, encoding="utf-8")
        (outdir / "ACTION-PLAN.md").write_text(
            render_action_plan(root, results, s), encoding="utf-8")
        print(f"[+] 交付物: {outdir / 'REPO-AUDIT.md'} / {outdir / 'ACTION-PLAN.md'}")
    return 0 if s["score"] >= 80 else 1


if __name__ == "__main__":
    raise SystemExit(main())
