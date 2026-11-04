$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot

Write-Host "==> 1. Checking local Node.js and pnpm..." -ForegroundColor Cyan
$nodeVer = (node -v).Trim()
$pnpmVer = (pnpm -v).Trim()
Write-Host "    Node version: $nodeVer"
Write-Host "    pnpm version: $pnpmVer"

$envExample = Join-Path $RepoRoot ".env.example"
$envLocal = Join-Path $RepoRoot ".env.local"

if (-not (Test-Path $envLocal)) {
  Write-Host "==> 2. Creating .env.local with safe sandbox defaults..." -ForegroundColor Cyan
  Copy-Item -Path $envExample -Destination $envLocal -Force
  $content = [System.IO.File]::ReadAllText($envLocal, [System.Text.Encoding]::UTF8)
  $defaults = @{
    "DATABASE_URL"                      = "postgresql://runtime:runtime@127.0.0.1:5432/xinhuo_local"
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" = "pk_test_local_sandbox_placeholder"
    "CLERK_SECRET_KEY"                  = "sk_test_local_sandbox_placeholder"
    "ADMIN_EMAIL"                       = "owner@xinhuo.local"
    "AMA_ENCRYPTION_KEY"                = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="
    "RATE_LIMIT_HASH_KEY"               = "AgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI="
    "PUBLIC_SITE_URL"                   = "http://127.0.0.1:3000"
    "SITE_URL"                          = "http://127.0.0.1:3000"
  }
  foreach ($key in $defaults.Keys) {
    $val = $defaults[$key]
    $content = $content -replace "(?m)^$([regex]::Escape($key))=.*$", "$key=$val"
  }
  [System.IO.File]::WriteAllText($envLocal, $content, [System.Text.Encoding]::UTF8)
  Write-Host "    Created: $envLocal" -ForegroundColor Green
} else {
  Write-Host "==> 2. Existing .env.local found, keeping it." -ForegroundColor Green
}

Write-Host "==> 3. Sandbox environment ready!" -ForegroundColor Green
