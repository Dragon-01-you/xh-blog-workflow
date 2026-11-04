#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""render_svg.py — 把 SVG 渲染成高清 PNG（无 Pillow / 无 cairosvg 依赖）。

原理：SVG 当唯一事实源 → 用无头 Chrome 以 2x deviceScaleFactor 截图。
字体、发丝线、小字都能保持矢量级的锐度，适合 README 配图。

用法:
    python3 scripts/render_svg.py art.svg out.png
    python3 scripts/render_svg.py art.svg out.png --width 1200 --scale 2
    OM_CHROME=/path/to/chrome python3 scripts/render_svg.py art.svg out.png

Chrome 查找顺序: $OM_CHROME → $CHROME_PATH → puppeteer 缓存 → 系统 chromium/chrome。
"""
from __future__ import annotations

import argparse
import glob
import os
import shutil
import subprocess
import tempfile
from pathlib import Path

CANDIDATES = [
    os.environ.get("OM_CHROME"),
    os.environ.get("CHROME_PATH"),
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
]
PUPPETEER_GLOBS = [
    os.path.expanduser("~/.cache/puppeteer/chrome/*/chrome-linux64/chrome"),
    os.path.expanduser("~/Library/Caches/ms-playwright/chromium-*/chrome-mac/Chromium.app/Contents/MacOS/Chromium"),
]


def find_chrome() -> str | None:
    for c in CANDIDATES:
        if c and Path(c).exists():
            return c
    for pattern in PUPPETEER_GLOBS:
        hits = sorted(glob.glob(pattern))
        if hits:
            return hits[-1]
    return shutil.which("google-chrome") or shutil.which("chromium")


def svg_size(svg_text: str) -> tuple[float, float]:
    import re
    vb = re.search(r'viewBox="(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+'
                   r'(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)"', svg_text)
    if vb:
        return float(vb.group(3)), float(vb.group(4))
    w = re.search(r'width="(\d+(?:\.\d+)?)', svg_text)
    h = re.search(r'height="(\d+(?:\.\d+)?)', svg_text)
    if w and h:
        return float(w.group(1)), float(h.group(1))
    raise SystemExit("无法从 SVG 读取尺寸：请给它 viewBox 或 width/height")


def _render_chrome(chrome: str, svg_text: str, png_path: Path, w: int, h: int,
                   scale: float, bg: str) -> bool:
    page = f"""<!doctype html><html><head><meta charset="utf-8">
<style>html,body{{margin:0;padding:0;background:{bg};}}
svg{{display:block;width:{w}px;height:{h}px;}}</style></head>
<body>{svg_text}</body></html>"""
    with tempfile.TemporaryDirectory() as tmp:
        page_path = Path(tmp) / "page.html"
        page_path.write_text(page, encoding="utf-8")
        cmd = [chrome, "--headless=new", "--no-sandbox", "--disable-gpu",
               "--hide-scrollbars", "--force-device-scale-factor", str(scale),
               f"--window-size={w},{h}",
               f"--screenshot={png_path.resolve()}", page_path.as_uri()]
        try:
            subprocess.run(cmd, check=True, capture_output=True, text=True)
        except subprocess.CalledProcessError as e:
            tail = (e.stderr or "").strip().splitlines()
            print("[!] Chrome 渲染失败：" + (tail[-1] if tail else "未知错误"), flush=True)
            return False
    return png_path.exists()


def _render_cli(svg_path: Path, png_path: Path, w: int, h: int,
                scale: float, bg: str) -> bool:
    """无 Chrome 时的降级：rsvg-convert → ImageMagick。质量略低但可用。"""
    tools = [
        ("rsvg-convert", ["rsvg-convert", "-w", str(int(w * scale)),
                          "-h", str(int(h * scale)), "-b", bg,
                          "-o", str(png_path), str(svg_path)]),
        ("convert", ["convert", "-background", bg, "-density",
                     str(int(96 * scale)), "-resize",
                     f"{int(w * scale)}x{int(h * scale)}", str(svg_path),
                     str(png_path)]),
    ]
    for name, cmd in tools:
        if shutil.which(name):
            print(f"[!] 未使用 Chrome，降级为 {name}（复杂 SVG 可能有排版差异）", flush=True)
            try:
                subprocess.run(cmd, check=True, capture_output=True, text=True)
            except subprocess.CalledProcessError as e:
                tail = (e.stderr or "").strip().splitlines()
                print(f"[!] {name} 失败：" + (tail[-1] if tail else "未知错误"),
                      flush=True)
                continue
            return png_path.exists()
    return False


def render(svg_path: Path, png_path: Path, width: int | None, scale: float,
           bg: str) -> None:
    svg_text = svg_path.read_text(encoding="utf-8")
    vw, vh = svg_size(svg_text)
    w = width or int(vw)
    h = int(w * vh / vw)
    chrome = find_chrome()
    done = bool(chrome) and _render_chrome(chrome, svg_text, png_path, w, h, scale, bg)
    if not done:
        done = _render_cli(svg_path, png_path, w, h, scale, bg)
    if not done:
        raise SystemExit(
            "渲染失败：Chrome 缺少系统库（如 libatk-1.0.so.0），"
            "且本机 SVG 光栅化工具（rsvg-convert / ImageMagick SVG 代理）不可用。\n"
            "可选：apt-get install -y libatk1.0-0 libatk-bridge2.0-0 libcups2 "
            "libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 "
            "libpango-1.0-0 libnss3，或安装 librsvg2-bin。")
    print(f"[+] {png_path}  {png_path.stat().st_size:,} B  ({int(w * scale)}×{int(h * scale)})")


def main() -> int:
    ap = argparse.ArgumentParser(description="SVG → PNG（无头 Chrome，2x）")
    ap.add_argument("svg")
    ap.add_argument("png")
    ap.add_argument("--width", type=int, default=None, help="输出逻辑宽度（默认用 SVG 尺寸）")
    ap.add_argument("--scale", type=float, default=2.0, help="deviceScaleFactor，默认 2")
    ap.add_argument("--bg", default="transparent", help="背景色，默认透明")
    args = ap.parse_args()
    r = render(Path(args.svg), Path(args.png), args.width, args.scale, args.bg)
    return 0 if r is None else 0


if __name__ == "__main__":
    raise SystemExit(main())
