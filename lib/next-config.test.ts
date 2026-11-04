import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

import nextConfig from '../next.config'

describe('第二步：本地免密码练习场与网站底座配置验电测试', () => {
  it('1. 打包时自动包含仓库内的文章文件夹 content/blog/**/* 和 OG 海报依赖', () => {
    expect(nextConfig.outputFileTracingIncludes).toMatchObject({
      '/blog/**': expect.arrayContaining(['./content/blog/**/*']),
      '/en/blog/**': expect.arrayContaining(['./content/blog/**/*']),
      '/og': expect.arrayContaining(['./content/blog/**/*']),
    })
  })

  it('2. 全站安全头强制本地字体自托管，且仅在后台设置页允许 Google 授权跳转', async () => {
    const rules = await nextConfig.headers!()
    const globalPolicy = rules
      .find(({ source }) => source === '/:path*')
      ?.headers.find(({ key }) => key === 'Content-Security-Policy')?.value
    const googleOAuthPolicy = rules
      .find(({ source }) => source === '/admin/ama/settings')
      ?.headers.find(({ key }) => key === 'Content-Security-Policy')?.value

    expect(globalPolicy).toContain("font-src 'self' data:")
    expect(globalPolicy).toContain("form-action 'self'")
    expect(globalPolicy).not.toContain('https://accounts.google.com')
    expect(googleOAuthPolicy).toContain(
      "form-action 'self' https://accounts.google.com",
    )
  })

  it('3. 每个公开响应都自带 Link 头宣告 /llms.txt（AI 大模型导读索引）', async () => {
    const rules = await nextConfig.headers!()
    const llmsLink = rules
      .find(({ source }) => source === '/:path*')
      ?.headers.find(({ key }) => key === 'Link')?.value

    expect(llmsLink).toBe('</llms.txt>; rel="describedby"')
  })

  it('4. 本地免密码练习场脚本已自动生成 .env.local 且包含安全假密码', () => {
    const envLocalPath = path.resolve(import.meta.dirname, '..', '.env.local')
    expect(fs.existsSync(envLocalPath)).toBe(true)
    const content = fs.readFileSync(envLocalPath, 'utf8')
    expect(content).toContain('SITE_URL=http://127.0.0.1:3000')
    expect(content).toContain('ADMIN_EMAIL=owner@xinhuo.local')
    expect(content).toContain('AMA_ENCRYPTION_KEY=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=')
  })
})
