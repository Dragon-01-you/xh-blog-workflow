#!/usr/bin/env bash
set -euo pipefail

# Determine repository root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "==> 1. Checking local Node.js and pnpm..."
NODE_VER="$(node -v 2>/dev/null || echo "not installed")"
PNPM_VER="$(pnpm -v 2>/dev/null || echo "not installed")"
echo "    Node version: ${NODE_VER}"
echo "    pnpm version: ${PNPM_VER}"

ENV_EXAMPLE="${REPO_ROOT}/.env.example"
ENV_LOCAL="${REPO_ROOT}/.env.local"

if [ ! -f "${ENV_LOCAL}" ]; then
  echo "==> 2. Creating .env.local with safe sandbox defaults..."
  cp "${ENV_EXAMPLE}" "${ENV_LOCAL}"

  # Replace placeholders with safe default values for local development
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' 's|^DATABASE_URL=.*|DATABASE_URL=postgresql://runtime:runtime@127.0.0.1:5432/xinhuo_local|' "${ENV_LOCAL}"
    sed -i '' 's|^NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=.*|NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_local_sandbox_placeholder|' "${ENV_LOCAL}"
    sed -i '' 's|^CLERK_SECRET_KEY=.*|CLERK_SECRET_KEY=sk_test_local_sandbox_placeholder|' "${ENV_LOCAL}"
    sed -i '' 's|^ADMIN_EMAIL=.*|ADMIN_EMAIL=owner@xinhuo.local|' "${ENV_LOCAL}"
    sed -i '' 's|^AMA_ENCRYPTION_KEY=.*|AMA_ENCRYPTION_KEY=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=|' "${ENV_LOCAL}"
    sed -i '' 's|^RATE_LIMIT_HASH_KEY=.*|RATE_LIMIT_HASH_KEY=AgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI=|' "${ENV_LOCAL}"
    sed -i '' 's|^PUBLIC_SITE_URL=.*|PUBLIC_SITE_URL=http://127.0.0.1:3000|' "${ENV_LOCAL}"
    sed -i '' 's|^SITE_URL=.*|SITE_URL=http://127.0.0.1:3000|' "${ENV_LOCAL}"
  else
    sed -i 's|^DATABASE_URL=.*|DATABASE_URL=postgresql://runtime:runtime@127.0.0.1:5432/xinhuo_local|' "${ENV_LOCAL}"
    sed -i 's|^NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=.*|NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_local_sandbox_placeholder|' "${ENV_LOCAL}"
    sed -i 's|^CLERK_SECRET_KEY=.*|CLERK_SECRET_KEY=sk_test_local_sandbox_placeholder|' "${ENV_LOCAL}"
    sed -i 's|^ADMIN_EMAIL=.*|ADMIN_EMAIL=owner@xinhuo.local|' "${ENV_LOCAL}"
    sed -i 's|^AMA_ENCRYPTION_KEY=.*|AMA_ENCRYPTION_KEY=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=|' "${ENV_LOCAL}"
    sed -i 's|^RATE_LIMIT_HASH_KEY=.*|RATE_LIMIT_HASH_KEY=AgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI=|' "${ENV_LOCAL}"
    sed -i 's|^PUBLIC_SITE_URL=.*|PUBLIC_SITE_URL=http://127.0.0.1:3000|' "${ENV_LOCAL}"
    sed -i 's|^SITE_URL=.*|SITE_URL=http://127.0.0.1:3000|' "${ENV_LOCAL}"
  fi

  echo "    Created: ${ENV_LOCAL}"
else
  echo "==> 2. Existing .env.local found, keeping it."
fi

echo "==> 3. Sandbox environment ready!"
