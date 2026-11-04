#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""benchmark.py — 远程对标顶尖仓库，输出差距表与「可偷招式」。

不需要 clone。只读 GitHub API + raw README，零依赖。

用法:
    python3 scripts/benchmark.py owner/repo                    # 与内置顶流基准对比
    python3 scripts/benchmark.py owner/repo astral-sh/uv      # 指定一个对标
    python3 scripts/benchmark.py owner/repo --json out.json
    GITHUB_TOKEN=ghp_xxx python3 scripts/benchmark.py owner/repo

内置基准: astral-sh/uv · openai/whisper · shadcn-ui/ui · t3-oss/create-t3-app
注意: 这里算的是「档内分」——先判路由器/研究型/手册，再按该档的结构要求打分，
      与本地 audit.py 的 100 分口径不同，只用于同档横向比较，不可混用。
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.request

DEFAULT_REFS = ["astral-sh/uv", "openai/whisper", "shadcn-ui/ui",
                "t3-oss/create-t3-app"]
API = "https://api.github.com"
UA = "repo-optimization-kit/2.0"


def _req(url: str, token: str | None, raw: bool = False) -> tuple[int, str]:
    headers = {"User-Agent": UA, "Accept": "application/vnd.github.raw"
               if raw else "application/vnd.github+json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=headers),
                                    timeout=25) as r:
            return r.status, r.read().decode("utf-8", "ignore")
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception:  # noqa: BLE001
        return 0, ""


def fetch_repo(owner_repo: str, token: str | None) -> dict:
    out: dict = {"repo": owner_repo}
    code, body = _req(f"{API}/repos/{owner_repo}", token)
    out["api_status"] = code
    if code != 200:
        out["error"] = "rate limit / 无权限 / 仓库不存在" if code in (403, 404) else str(code)
        return out
    meta = json.loads(body)
    out.update({
        "description": meta.get("description") or "",
        "topics": meta.get("topics") or [],
        "homepage": meta.get("homepage") or "",
        "stars": meta.get("stargazers_count") or 0,
        "license": (meta.get("license") or {}).get("spdx_id") or "",
        "pushed_at": (meta.get("pushed_at") or "")[:10],
    })
    _, readme = _req(f"{API}/repos/{owner_repo}/readme", token, raw=True)
    out["readme"] = readme
    _, listing = _req(f"{API}/repos/{owner_repo}/contents/", token)
    names = []
    if listing:
        try:
            names = [x["name"].lower() for x in json.loads(listing) if isinstance(x, dict)]
        except ValueError:
            pass
    out["files"] = names
    return out


# ----------------------------------------------------------------------
def signals(d: dict) -> dict:
    md = d.get("readme") or ""
    head = "\n".join(md.splitlines()[:35])
    body = re.sub(r"^#.*", "", md, flags=re.M).strip()
    # 去掉 HTML 块与纯图片行，避免把徽章/横幅误当成首段
    clean = re.sub(r"<[^>]+>", "", body)
    clean = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", clean)
    paras = [p.strip() for p in re.split(r"\n\s*\n", clean)
             if p.strip() and not p.strip().startswith(("|", "-", "*", "+", ">"))]
    first_para = paras[0] if paras else ""
    tables = re.findall(r"^\|.+\|\s*$", md, re.M)
    table_rows = len(tables)
    links = re.findall(r"\[[^\]]+\]\((https?://[^)]+)\)", head)
    install = len(re.findall(r"^[ \t]*(curl|brew|apt|sudo apt|powershell|choco|"
                            r"scoop|pip install|python -m pip|npm i|npm install|"
                            r"npx|pnpm|yarn|cargo|go install|docker run)", md, re.M))
    return {
        "one_liner": bool(first_para) and len(first_para) <= 140,
        "hero": bool(re.search(r"!\[|<img|<picture", head, re.I)),
        "dark_light": "<picture" in md and "prefers-color-scheme" in md,
        "badges": len(re.findall(r"\[!\[", md)),
        "badge_imgs": len(re.findall(r"img\.shields\.io", md)),
        "demo": bool(re.search(r"\.(gif|mp4|webm)", md, re.I)),
        "toc": len(re.findall(r"^-\s*\[[^\]]+\]\(#", md, re.M)) >= 5,
        "link_row": len(links) >= 3,
        "install_matrix": install >= 2,
        "facts": table_rows >= 6,
        "bench": bool(re.search(r"benchmark|perf|x faster|ms\b|\bLUFS|throughput", md, re.I)),
        "compare": bool(re.search(r"(对比|比较|vs |compare|alternatives)", md, re.I)),
        "faq": bool(re.search(r"(FAQ|常见问题)", md, re.I)),
        "llms": "llms.txt" in (d.get("files") or []),
        "citation": bool(re.search(r"(CITATION\.cff|@article|citation)", md, re.I)),
        "docs": bool(re.search(r"(docs\.|documentation|文档)", md, re.I)),
        "readme_lines": len(md.splitlines()),
    }


def archetype(d: dict, s: dict) -> str:
    """按结构判档：路由器 / 研究型 / 手册。"""
    if s["readme_lines"] <= 60 and s["docs"]:
        return "router"
    if s["citation"] or (s["facts"] and s["bench"]):
        return "research"
    return "manual"


def score(d: dict, s: dict) -> tuple[str, int]:
    """按档位评分：同一档内的仓库才可比。"""
    arch = archetype(d, s)
    files = d.get("files") or []
    has_contrib = any("contributing" in f for f in files)
    if arch == "router":
        parts = [(s["one_liner"], 20), (s["hero"], 20), (s["docs"], 20),
                 (bool(d.get("license")), 15), (has_contrib, 15),
                 (s["readme_lines"] <= 60, 10)]
    elif arch == "research":
        parts = [(s["link_row"], 15), (s["one_liner"], 15), (s["hero"], 15),
                 (s["facts"], 20), (s["bench"], 15), (s["citation"], 10),
                 (s["install_matrix"], 10)]
    else:
        parts = [(s["one_liner"], 15), (s["hero"], 15),
                 (s["badge_imgs"] >= 3, 5), (s["install_matrix"], 20),
                 (s["bench"], 15), (s["docs"], 10), (s["facts"], 10),
                 (s["demo"] or s["toc"], 10)]
    return arch, round(sum(w for ok, w in parts if ok))


LABELS = {
    "one_liner": "一句话定位", "hero": "Hero 图", "dark_light": "深浅色 Hero",
    "demo": "动态演示", "toc": "目录", "link_row": "顶部外链行",
    "install_matrix": "多平台安装", "facts": "事实/决策表", "bench": "基准证据",
    "compare": "对比章节", "faq": "FAQ", "llms": "llms.txt",
    "citation": "引用入口", "docs": "文档分流",
}


# ----------------------------------------------------------------------
def main() -> int:
    ap = argparse.ArgumentParser(description="远程对标顶尖仓库")
    ap.add_argument("target", help="要优化的仓库 owner/repo")
    ap.add_argument("refs", nargs="*", help="对标仓库（默认内置 4 个）")
    ap.add_argument("--token", default=os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN"),
                    help="GitHub token（默认读 GITHUB_TOKEN / GH_TOKEN）")
    ap.add_argument("--json", default=None)
    args = ap.parse_args()

    refs = args.refs or DEFAULT_REFS
    repos = [args.target] + [r for r in refs if r.lower() != args.target.lower()]
    data, sigs, scores, archs = {}, {}, {}, {}
    for r in repos:
        d = fetch_repo(r, args.token)
        data[r] = d
        if d.get("error"):
            continue
        sigs[r] = signals(d)
        archs[r], scores[r] = score(d, sigs[r])

    ok = [r for r in repos if r in scores]
    if not ok:
        print("无法获取任何仓库数据：请检查 GITHUB_TOKEN 与仓库名。", file=sys.stderr)
        return 2

    t = args.target
    if t not in scores:
        print(f"[!] 目标仓库 {t} 拉取失败：{data[t].get('error')}（环境限制，不代表仓库差）",
              file=sys.stderr)
        return 2

    print(f"\n# 远程对标 · `{t}`\n")
    print("| 仓库 | 档位 | 档内分 | 描述 | topics | 徽章 | Hero | 事实表 | llms.txt | README 行 |")
    print("|---|---|---:|---:|---:|---:|:---:|:---:|:---:|---:|")
    for r in ok:
        d, s = data[r], sigs[r]
        mark = lambda b: "✅" if b else "—"  # noqa: E731
        print(f"| `{r}` | {archs[r]} | **{scores[r]}** | {len(d.get('description') or '')} | "
              f"{len(d.get('topics') or [])} | {max(s['badges'], s['badge_imgs'])} | "
              f"{mark(s['hero'])} | {mark(s['facts'])} | {mark(s['llms'])} | "
              f"{s['readme_lines']} |")

    # ---- 可偷招式：基准有、目标没有 ----
    print("\n## 可偷招式（对标有，你没有）\n")
    gaps: dict[str, list[str]] = {}
    for key, label in LABELS.items():
        want = [r for r in ok if r != t and sigs[r].get(key)]
        if sigs[t].get(key) or not want:
            continue
        gaps[label] = want
    if gaps:
        for label, who in gaps.items():
            print(f"- **{label}** —— 参考: {', '.join('`'+w+'`' for w in who[:3])}")
    else:
        print("- 关键结构已齐备，差距主要在内容质量与分发，不在结构。")

    # ---- 长度与定位 ----
    target_arch = archs[t]
    ranges = {"router": (20, 40), "manual": (150, 400), "research": (100, 250)}
    lo, hi = ranges[target_arch]
    print(f"\n> 你的档位：**{target_arch}**，该档建议 {lo}–{hi} 行；"
          f"当前 {sigs[t]['readme_lines']} 行。")
    if sigs[t]["readme_lines"] > hi:
        print("> 超长：把细节迁到文档站或 references/，README 只留决策所需。")

    if args.json:
        with open(args.json, "w", encoding="utf-8") as f:
            json.dump({r: {"score": scores[r], "signals": sigs[r],
                           "meta": {k: data[r].get(k) for k in
                                    ("description", "topics", "stars", "license")}}
                       for r in ok}, f, ensure_ascii=False, indent=2)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
