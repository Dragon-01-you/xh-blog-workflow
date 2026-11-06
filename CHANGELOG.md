# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-11-06

### Security & Hardening
- **Template Abstraction & Zero Residue**: Fully generalized `xh-blog-workflow` into an open-source starter template. Removed all hardcoded private author emails, contacts, and credentials from default configuration, replacing them with standard demo presets (`creator@example.com`).
- **Fail-Closed Admin Security**: Removed insecure fallback default password `xinhuo2026`. Enforced mandatory `ADMIN_PASSWORD` server-side check (returns HTTP 500/403 with locking message if unset).
- **Cryptographic HMAC Sessions**: Replaced static cookie string with SHA-256 HMAC signed session tokens (`timestamp.nonce.signature`) and added `GET /api/admin/verify` session validation API.
- **Removed Test Backdoor**: Completely removed `IS_REACT_ACT_ENVIRONMENT` automatic bypass from unlock error handler.
- **Portable Scripting**: Replaced machine-specific absolute paths in screenshot scripts with dynamic environment-driven outputs.
- **Automated Verification**: Added `tests/unit/admin-auth-api.test.ts` (10 test files, 74/74 passing, 4/4 smoke tests, 21 SSG routes).

## [1.3.0] - 2026-11-06

### Added & Fixed
- **Core Content Alignment**: Refined baseline articles to 6 high-value self-learning and engineering essays with 21 SSG routes.
- **3D Bookshelf Polish**: Resolved 3D bookshelf plank text overlap on book titles and quotes.
- **Pure Baseline View**: Kept vinyl shelf focused and pure with NetEase streaming cards.
- **Creator Philosophy Bio**: Upgraded brand bio to positive, assertive creator philosophy.

## [1.0.0] - 2026-11-04

### Added
- **1:1 Swiss Paper & Ink Master System**: Full port of Cali Castle (`cali.so` v3) design foundations with 6,972 lines of `globals.css` adapted for Windows Tailwind v4.
- **K-Code Kernel Hash Lock**: 49 core architecture files locked with SHA-256 hashes in `.kernel-lock.json` to guarantee zero design corruption.
- **Dynamic V-Slot Hot-Swap**: Isolated brand variables into `.slots.json` across 8 dimensions (Identity, Avatars, Phrases, Social Links, Timeline, Articles, Projects, Cultural Bookshelf).
- **Dual-Track Brand Avatars**: Integrated unified original childhood IP circular avatar (`/images/avatar.png`) alongside interactive Swiss halftone toggle photo.
- **Content Pipeline**: Initial MDX articles with 1200x675 covers, tags, and reading stats.
- **Real Engineering Showcase**: Project cards in `lib/projects.ts` with custom brand SVG icons.
- **Deterministic Testing Engine**: Vitest unit tests passing across components and utilities.
- **CLI Tooling & Agent Skills**: `scripts/xh_blog_cli.py` (`xh-blog`) supporting `bootstrap`, `inspect-slots`, `verify-kernel`, and `snapshot`.
- **Repo Optimization Kit Assets**: Full badges, dual-mode hero banners, terminal demo GIF, GEO `llms.txt`, and bilingual documentation.

### Origin & Credit
- Explicitly credited **Cali Castle** (`https://cali.so`, `https://github.com/CaliCastle/cali.so`) for the iconic visual and micro-interaction design foundation.
