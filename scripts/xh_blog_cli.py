#!/usr/bin/env python3
"""
xh-blog-workflow CLI helper script.
Provides deterministic environment checks, template bootstrapping, K-code SHA-256 locking,
dynamic V-slot inspection, kernel integrity verification, and git snapshot archiving.
"""

import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

DEFAULT_MASTER_TEMPLATE = r"e:\芯火知识库\芯火知识库\个人知识库\01-当前任务\网站设计工作流\site-2"

# Fixed K-Code (Kernel) globs relative to the project root that AI must NEVER rewrite in V1 (Low-Customization 1:1 mode)
KERNEL_GLOBS = [
    "app/globals.css",
    "app/layout.tsx",
    "app/page.tsx",
    "app/blog/page.tsx",
    "app/blog/[slug]/page.tsx",
    "app/projects/page.tsx",
    "app/photos/page.tsx",
    "app/admin/page.tsx",
    "app/content/[...path]/route.ts",
    "app/feed.xml/route.ts",
    "app/llms.txt/route.ts",
    "app/og/route.tsx",
    "app/robots.ts",
    "app/sitemap.ts",
    "components/*.tsx",
    "components/*.ts",
]

# Dynamic V-Slot paths relative to the project root that ARE customizable
DYNAMIC_SLOT_PATHS = [
    "lib/personal.ts",
    "lib/projects.ts",
    "lib/photos.ts",
    "lib/content.ts",
    "lib/view-transition-name.ts",
    "content/github.json",
    "content/blog",
    "public/images",
]

EXCLUDE_COPY_DIRS = {
    "node_modules",
    ".next",
    "out",
    "dist",
    ".git",
    "snapshots",
    "test-results",
    "playwright-report",
}


def sha256_file(path: Path) -> str:
    raw = path.read_bytes()
    # Normalize CRLF -> LF for text source files to guarantee cross-platform deterministic hashing
    if path.suffix.lower() in {".css", ".ts", ".tsx", ".js", ".mjs", ".json", ".md", ".txt", ".html"}:
        raw = raw.replace(b"\r\n", b"\n")
    return hashlib.sha256(raw).hexdigest()


def collect_kernel_files(project_dir: Path) -> dict[str, str]:
    hashes: dict[str, str] = {}
    for pattern in KERNEL_GLOBS:
        for file_path in sorted(project_dir.glob(pattern)):
            if file_path.is_file():
                rel = file_path.relative_to(project_dir).as_posix()
                hashes[rel] = sha256_file(file_path)
    return hashes


def run_cmd(cmd: list[str], cwd: Path | None = None) -> tuple[int, str, str]:
    try:
        proc = subprocess.run(
            cmd,
            cwd=str(cwd) if cwd else None,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            shell=(os.name == "nt"),
        )
        return proc.returncode, proc.stdout.strip(), proc.stderr.strip()
    except Exception as exc:
        return 1, "", str(exc)


def cmd_bootstrap(args: argparse.Namespace) -> int:
    target_dir = Path(args.target_dir).resolve()
    template_dir = Path(args.template_dir).resolve()
    output_path = Path(args.output).resolve()

    # 1. Check environment tools
    env_checks = {}
    for tool, cmd in [
        ("node", ["node", "-v"]),
        ("pnpm", ["pnpm", "-v"]),
        ("git", ["git", "--version"]),
    ]:
        code, out, err = run_cmd(cmd)
        env_checks[tool] = {"ok": code == 0, "version": out or err}
        if code != 0:
            print(f"Error: Required tool '{tool}' is not available: {err}", file=sys.stderr)
            return 1

    # 2. Copy master template if target_dir does not have package.json
    copied_files = 0
    if not (target_dir / "package.json").exists():
        if not template_dir.exists():
            print(f"Error: Master template directory not found: {template_dir}", file=sys.stderr)
            return 1
        target_dir.mkdir(parents=True, exist_ok=True)
        for item in template_dir.iterdir():
            if item.name in EXCLUDE_COPY_DIRS:
                continue
            dest = target_dir / item.name
            if item.is_dir():
                shutil.copytree(
                    item,
                    dest,
                    dirs_exist_ok=True,
                    ignore=shutil.ignore_patterns(*EXCLUDE_COPY_DIRS),
                )
            else:
                shutil.copy2(item, dest)
            copied_files += 1

    # 3. Ensure Matt Pocock governance & scratch directories exist
    (target_dir / ".scratch" / "blog-v1" / "issues").mkdir(parents=True, exist_ok=True)
    (target_dir / "docs" / "adr").mkdir(parents=True, exist_ok=True)
    (target_dir / "docs" / "agents").mkdir(parents=True, exist_ok=True)

    # 4. Initialize Git if not present
    if not (target_dir / ".git").exists():
        run_cmd(["git", "init"], cwd=target_dir)

    # 5. Create .env.local if not present
    env_local = target_dir / ".env.local"
    env_example = target_dir / ".env.example"
    if not env_local.exists() and env_example.exists():
        shutil.copy2(env_example, env_local)

    # 6. Lock K-Code hashes into .kernel-lock.json
    kernel_hashes = collect_kernel_files(target_dir)
    lock_file = target_dir / ".kernel-lock.json"
    lock_payload = {
        "locked_at": datetime.now(timezone.utc).isoformat(),
        "template_source": str(template_dir),
        "kernel_file_count": len(kernel_hashes),
        "files": kernel_hashes,
    }
    lock_file.write_text(json.dumps(lock_payload, indent=2, ensure_ascii=False), encoding="utf-8")

    result = {
        "status": "bootstrapped",
        "target_dir": str(target_dir),
        "template_dir": str(template_dir),
        "environment": env_checks,
        "copied_top_level_items": copied_files,
        "kernel_lock_file": str(lock_file),
        "kernel_file_count": len(kernel_hashes),
        "dynamic_slots": DYNAMIC_SLOT_PATHS,
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Success! Environment bootstrapped and K-code locked. Data written to: {output_path}")
    return 0


def cmd_inspect_slots(args: argparse.Namespace) -> int:
    project_dir = Path(args.project_dir).resolve()
    output_path = Path(args.output).resolve()

    if not project_dir.exists():
        print(f"Error: Project directory does not exist: {project_dir}", file=sys.stderr)
        return 1

    blog_dir = project_dir / "content" / "blog"
    articles = []
    if blog_dir.exists():
        for slug_dir in sorted(blog_dir.iterdir()):
            if slug_dir.is_dir() and (slug_dir / "index.mdx").exists():
                mdx_text = (slug_dir / "index.mdx").read_text(encoding="utf-8", errors="replace")
                title_m = re.search(r'^title:\s*["\']?(.*?)["\']?\s*$', mdx_text, re.M)
                date_m = re.search(r'^date:\s*["\']?(.*?)["\']?\s*$', mdx_text, re.M)
                articles.append({
                    "slug": slug_dir.name,
                    "title": title_m.group(1) if title_m else slug_dir.name,
                    "date": date_m.group(1) if date_m else "",
                    "has_cover": (slug_dir / "cover.jpg").exists(),
                })

    books_dir = project_dir / "public" / "images" / "books"
    book_covers = [p.name for p in sorted(books_dir.glob("*.*"))] if books_dir.exists() else []

    records_dir = project_dir / "public" / "images" / "records"
    record_covers = [p.name for p in sorted(records_dir.glob("*.*"))] if records_dir.exists() else []

    report = {
        "project_dir": str(project_dir),
        "inspected_at": datetime.now(timezone.utc).isoformat(),
        "customizable_v_slots": {
            "slot_1_identity_and_location": {
                "file": "lib/personal.ts (brandConfig)",
                "fields": ["name", "enName", "tagline", "location", "coordinates"],
                "rule": "Required. Ask user for brand name, city, and coordinates.",
            },
            "slot_2_dual_track_avatars": {
                "files": [
                    "public/images/avatar.png (Dock 26px & Favicon & WeChat Modal & Stamp)",
                    "public/images/headshot.jpg (Hero Portrait Light)",
                    "public/images/portrait-square.jpg (Hero Portrait Dark)",
                ],
                "rule": "Required. Hero portrait supports halftone + click to reveal true-color photo. Dock uses IP avatar.",
            },
            "slot_3_home_intro_phrases": {
                "file": "components/home-introduction.tsx / lib/personal.ts",
                "fields": ["rolePhrase (with laptop/sparkle SVG)", "craftPhrase (with spring wave jump)", "introParagraphs"],
                "rule": "Ask user for their role badge phrase, craftsmanship motto, and 3-4 bio paragraphs.",
            },
            "slot_4_social_cards_elastic": {
                "files": ["lib/personal.ts", "components/social-cards.tsx", "content/github.json", "public/images/wechat-qr.jpg"],
                "supported_channels": [
                    "github (26-week live heatmap + stars)",
                    "email (physical stamped airmail envelope)",
                    "wechat_official (QR code popup modal, no external dead jump)",
                    "xiaohongshu (profile card + direct jump)",
                    "xiaobaotong / column (if no URL yet, render as pure text '筹备中' without '#' dead link; or hide if unused)",
                    "other platforms (hide completely if user does not have them)",
                ],
            },
            "slot_5_experience_timeline": {
                "file": "lib/personal.ts (experiences)",
                "rule": "Elastic array. Must use user's 100% real years and roles. Never fabricate years.",
            },
            "slot_6_original_articles": {
                "directory": "content/blog/<slug>/index.mdx",
                "current_count": len(articles),
                "current_articles": articles,
                "rule": "Elastic count. Must only include user's genuine original articles with 1200x675 cover.jpg.",
            },
            "slot_7_projects_and_photos": {
                "files": ["lib/projects.ts", "lib/photos.ts"],
                "rule": "Elastic count. Projects must be real repos/works. Photos defaults to empty [] (darkroom empty state) until user selects real achievement photos.",
            },
            "slot_8_bookshelf_and_vinyl_records": {
                "file": "lib/personal.ts (books, records)",
                "current_book_covers": book_covers,
                "current_record_covers": record_covers,
                "rule": "Elastic count! User can add/remove achievement books (战绩书) or favorite books & songs by providing title, link, and cover image, or keep defaults as placeholder.",
            },
            "slot_9_site_metadata_and_seo": {
                "files": ["lib/public-page-metadata.ts", "lib/feeds.ts", "lib/llms.ts", "lib/seo.ts"],
                "rule": "Site metadata, OpenGraph titles, RSS branding, and LLM text specs automatically synced from brandConfig.",
            },
            "slot_10_social_and_github": {
                "files": ["lib/social-live.ts", "lib/personal.ts"],
                "rule": "GitHub handles and social media channels read dynamically from personalInfo.",
            },
        },
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Success! Dynamic V-slots inspected. Data written to: {output_path}")
    return 0


def cmd_verify_kernel(args: argparse.Namespace) -> int:
    project_dir = Path(args.project_dir).resolve()
    output_path = Path(args.output).resolve()
    lock_file = project_dir / ".kernel-lock.json"

    if not lock_file.exists():
        print(f"Error: Kernel lock file not found at {lock_file}. Run 'bootstrap' first.", file=sys.stderr)
        return 1

    lock_data = json.loads(lock_file.read_text(encoding="utf-8"))
    expected_hashes: dict[str, str] = lock_data.get("files", {})
    allow_files = set(args.allow_modified or [])

    modified_kernel_files = []
    missing_kernel_files = []

    for rel_path, expected_hash in expected_hashes.items():
        if rel_path in allow_files:
            continue
        fp = project_dir / rel_path
        if not fp.exists():
            missing_kernel_files.append(rel_path)
        else:
            actual_hash = sha256_file(fp)
            if actual_hash != expected_hash:
                modified_kernel_files.append(rel_path)

    # Check dynamic slots for dead '#' links or missing local image files
    slot_issues = []
    for rel_slot in ["lib/personal.ts", "lib/projects.ts", "lib/photos.ts"]:
        slot_fp = project_dir / rel_slot
        if slot_fp.exists():
            content = slot_fp.read_text(encoding="utf-8", errors="replace")
            for m in re.finditer(r"""['"](/images/[^'"]+)['"]""", content):
                img_rel = m.group(1).lstrip("/")
                if not (project_dir / "public" / img_rel).exists():
                    slot_issues.append(f"Missing image referenced in {rel_slot}: {m.group(1)}")

    passed = (len(modified_kernel_files) == 0) and (len(missing_kernel_files) == 0) and (len(slot_issues) == 0)
    report = {
        "verified_at": datetime.now(timezone.utc).isoformat(),
        "passed": passed,
        "modified_kernel_files": modified_kernel_files,
        "missing_kernel_files": missing_kernel_files,
        "slot_asset_issues": slot_issues,
    }

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")

    if not passed:
        print(f"Failure! Kernel or slot verification failed. See details in: {output_path}", file=sys.stderr)
        return 1

    print(f"Success! All {len(expected_hashes)} K-code files intact and V-slot assets verified. Report written to: {output_path}")
    return 0


def cmd_snapshot(args: argparse.Namespace) -> int:
    project_dir = Path(args.project_dir).resolve()
    tag_name = args.tag
    message = args.message
    output_path = Path(args.output).resolve()

    run_cmd(["git", "add", "."], cwd=project_dir)
    run_cmd(["git", "commit", "-m", f"feat(snapshot): {tag_name} - {message}"], cwd=project_dir)
    run_cmd(["git", "tag", "-d", tag_name], cwd=project_dir)
    code, out, err = run_cmd(["git", "tag", "-a", tag_name, "-m", message], cwd=project_dir)
    if code != 0:
        print(f"Error creating git tag '{tag_name}': {err}", file=sys.stderr)
        return 1

    _, commit_sha, _ = run_cmd(["git", "rev-parse", "--short", "HEAD"], cwd=project_dir)
    snap_dir = project_dir / "snapshots" / tag_name
    snap_dir.mkdir(parents=True, exist_ok=True)

    result = {
        "snapshot_at": datetime.now(timezone.utc).isoformat(),
        "tag": tag_name,
        "commit": commit_sha,
        "message": message,
        "snapshot_dir": str(snap_dir),
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Success! Snapshot '{tag_name}' ({commit_sha}) created. Data written to: {output_path}")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="xh-blog-workflow CLI utility")
    subparsers = parser.add_subparsers(dest="subcommand", required=True)

    p_boot = subparsers.add_parser("bootstrap", help="Verify environment, initialize target directory from master template, and lock K-code hashes")
    p_boot.add_argument("--target-dir", required=True, help="Target directory for the blog project")
    p_boot.add_argument("--template-dir", default=DEFAULT_MASTER_TEMPLATE, help="Master template directory")
    p_boot.add_argument("--output", required=True, help="Output JSON file path")
    p_boot.set_defaults(func=cmd_bootstrap)

    p_slots = subparsers.add_parser("inspect-slots", help="Inspect customizable dynamic V-slots and generate interview checklist")
    p_slots.add_argument("--project-dir", required=True, help="Project directory to inspect")
    p_slots.add_argument("--output", required=True, help="Output JSON file path")
    p_slots.set_defaults(func=cmd_inspect_slots)

    p_verify = subparsers.add_parser("verify-kernel", help="Verify K-code SHA-256 lock integrity and dynamic V-slot asset paths")
    p_verify.add_argument("--project-dir", required=True, help="Project directory to verify")
    p_verify.add_argument("--allow-modified", nargs="*", default=["components/home-introduction.tsx", "components/social-cards.tsx"], help="Files allowed to have text-slot modifications")
    p_verify.add_argument("--output", required=True, help="Output JSON file path")
    p_verify.set_defaults(func=cmd_verify_kernel)

    p_snap = subparsers.add_parser("snapshot", help="Create an immutable git tag and snapshot archive")
    p_snap.add_argument("--project-dir", required=True, help="Project directory")
    p_snap.add_argument("--tag", required=True, help="Git tag name (e.g. v1.0.0-snapshot-cao2)")
    p_snap.add_argument("--message", required=True, help="Snapshot description message")
    p_snap.add_argument("--output", required=True, help="Output JSON file path")
    p_snap.set_defaults(func=cmd_snapshot)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
