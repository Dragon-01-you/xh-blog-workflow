'use client'

import React, { useState } from 'react'

interface AdminDashboardTabsProps {
  metricsContent: React.ReactNode
  initialBrand: {
    name: string
    enName: string
    tagline: string
    bio: string
    location: string
    lat: string
    lng: string
    email: string
    handle: string
    weChatOfficial: string
  }
}

export function AdminDashboardTabs({
  metricsContent,
  initialBrand,
}: AdminDashboardTabsProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<'metrics' | 'editor' | 'sync'>('metrics')

  // State for live slot quick editing
  const [form, setForm] = useState(initialBrand)
  const [copied, setCopied] = useState(false)

  const handleCopyTsConfig = () => {
    const code = `// 由站长控制台导出的槽位配置
export const brandConfig = {
  name: ${JSON.stringify(form.name)},
  enName: ${JSON.stringify(form.enName)},
  tagline: ${JSON.stringify(form.tagline)},
  taglineEn: ${JSON.stringify(form.tagline)},
  bio: ${JSON.stringify(form.bio)},
  bioEn: ${JSON.stringify(form.bio)},
  avatar: '/images/avatar.png',
  headshotLight: '/images/headshot.jpg',
  headshotDark: '/images/portrait-square.jpg',
  poster: '/images/portrait-poster.png',
  location: ${JSON.stringify(form.location)},
  locationCoordinates: {
    lat: ${JSON.stringify(form.lat)},
    lng: ${JSON.stringify(form.lng)},
  },
}
`
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadJson = () => {
    const json = JSON.stringify(
      {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        slots: {
          brand: form,
        },
      },
      null,
      2
    )
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'my-slots-update.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2 overflow-x-auto text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('metrics')}
          className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
            activeTab === 'metrics'
              ? 'bg-[var(--foreground)] text-[var(--background)] font-medium'
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-1)]'
          }`}
        >
          01 // 运维巡检大盘 (Metrics)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('editor')}
          className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
            activeTab === 'editor'
              ? 'bg-[var(--foreground)] text-[var(--background)] font-medium'
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-1)]'
          }`}
        >
          02 // 槽位极速编辑 (Quick Edit)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sync')}
          className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
            activeTab === 'sync'
              ? 'bg-[var(--foreground)] text-[var(--background)] font-medium'
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-1)]'
          }`}
        >
          03 // 日常更新与同步上线指引 (Daily Sync)
        </button>
      </div>

      {/* Tab 1: 运维巡检大盘 */}
      {activeTab === 'metrics' && (
        <div className="space-y-10">{metricsContent}</div>
      )}

      {/* Tab 2: 槽位极速编辑 */}
      {activeTab === 'editor' && (
        <div className="space-y-6">
          <div className="border border-[var(--border)] bg-[var(--surface-1)] rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div>
                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                  品牌基本信息实时在线修改
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] font-mono mt-0.5">
                  修改后可一键复制覆盖 lib/personal.ts 或导出备份
                </p>
              </div>
              <span className="text-xs font-mono text-[var(--signal)]">● Live Mode</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className="block text-[var(--muted-foreground)] mb-1">中文品牌名 (Name)</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-1.5 border border-[var(--border)] rounded bg-[var(--background)] text-[var(--foreground)]"
                />
              </div>
              <div>
                <label className="block text-[var(--muted-foreground)] mb-1">英文名称 (English Name)</label>
                <input
                  type="text"
                  value={form.enName}
                  onChange={(e) => setForm({ ...form, enName: e.target.value })}
                  className="w-full px-3 py-1.5 border border-[var(--border)] rounded bg-[var(--background)] text-[var(--foreground)]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[var(--muted-foreground)] mb-1">一句话身份标签 (Tagline)</label>
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="w-full px-3 py-1.5 border border-[var(--border)] rounded bg-[var(--background)] text-[var(--foreground)]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[var(--muted-foreground)] mb-1">核心个人简介 (Bio)</label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full px-3 py-1.5 border border-[var(--border)] rounded bg-[var(--background)] text-[var(--foreground)] leading-relaxed"
                />
              </div>
              <div>
                <label className="block text-[var(--muted-foreground)] mb-1">所在城市 (Location)</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-1.5 border border-[var(--border)] rounded bg-[var(--background)] text-[var(--foreground)]"
                />
              </div>
              <div>
                <label className="block text-[var(--muted-foreground)] mb-1">联络邮箱 (Email)</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-1.5 border border-[var(--border)] rounded bg-[var(--background)] text-[var(--foreground)]"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={handleCopyTsConfig}
                className="px-4 py-2 text-xs font-mono font-medium rounded bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1.5"
              >
                {copied ? '✓ 已复制到剪贴板！' : '📋 一键复制 TypeScript 配置代码'}
              </button>

              <button
                type="button"
                onClick={handleDownloadJson}
                className="px-4 py-2 text-xs font-mono rounded border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--surface-1)] transition-colors cursor-pointer"
              >
                💾 下载 .slots.json 备份
              </button>
            </div>
          </div>

          {/* Guide to full offline panel */}
          <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--muted-foreground)] space-y-2 font-mono">
            <div className="font-semibold text-[var(--foreground)] flex items-center gap-2">
              <span>💡 需要更深度的槽位定制？（3D 书架、黑胶、经历时间轴、相册瀑布流）</span>
            </div>
            <p className="leading-relaxed">
              请直接在电脑本地双击打开：<code>docs/slot-config-panel.html</code>。
              该面板提供 14 个完整槽位的可视化向导、20+ 全球核心城市坐标速选与多渠道弹性勾选，数据 100% 留存在本地，安全无泄露。
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: 日常更新与同步上线指引 */}
      {activeTab === 'sync' && (
        <div className="space-y-6 text-xs">
          {/* Card 1: 新建与发布长文 */}
          <div className="border border-[var(--border)] bg-[var(--surface-1)] rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
              <span className="p-1 rounded bg-blue-500/10 text-blue-500 font-mono">STEP 1</span>
              <span>如何发布一篇新的原创博客长文？</span>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-[var(--muted-foreground)] leading-relaxed pl-1 font-mono">
              <li>
                <strong className="text-[var(--foreground)]">创建文章目录</strong>：在 <code>content/blog/</code> 下新建一个文件夹（例如 <code>content/blog/my-new-post/</code>）。
              </li>
              <li>
                <strong className="text-[var(--foreground)]">放置题图与正文</strong>：在文件夹内放入 <code>index.mdx</code>（正文 Markdown）与一张 1200×675 比例的题图 <code>cover.jpg</code>。
              </li>
              <li>
                <strong className="text-[var(--foreground)]">规范小标题</strong>：文章正文必须包含<strong className="text-amber-500">至少 2 个 ## 二级小标题</strong>，以便右侧瑞士微缩大纲刻度尺正常渲染。
              </li>
              <li>
                <strong className="text-[var(--foreground)]">本地秒级体检</strong>：在终端运行 <code>pnpm run doctor</code>，看到全绿即可。
              </li>
            </ol>
          </div>

          {/* Card 2: 更新个人资料与资产 */}
          <div className="border border-[var(--border)] bg-[var(--surface-1)] rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
              <span className="p-1 rounded bg-emerald-500/10 text-emerald-500 font-mono">STEP 2</span>
              <span>如何修改个人头像、简介、书架或项目？</span>
            </div>
            <ul className="list-disc list-inside space-y-2 text-[var(--muted-foreground)] leading-relaxed pl-1 font-mono">
              <li>
                <strong className="text-[var(--foreground)]">文本修改</strong>：在上方「02 // 槽位极速编辑」或打开 <code>docs/slot-config-panel.html</code> 修改，一键覆盖 <code>lib/personal.ts</code>。
              </li>
              <li>
                <strong className="text-[var(--foreground)]">图片替换</strong>：将新照片放入 <code>public/images/</code> 对应目录（头像 <code>avatar.png</code>、明亮主图 <code>headshot.jpg</code>、暗黑网点图 <code>portrait-square.jpg</code>）。
              </li>
              <li>
                <strong className="text-[var(--foreground)]">安全校验</strong>：运行 <code>python tests/test_smoke.py</code> 校验核心文件与素材完整性。
              </li>
            </ul>
          </div>

          {/* Card 3: 自动化上线同步 */}
          <div className="border border-[var(--border)] bg-[var(--surface-1)] rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
              <span className="p-1 rounded bg-purple-500/10 text-purple-500 font-mono">STEP 3</span>
              <span>如何同步推送到线上公网（一键自动化部署）？</span>
            </div>
            <p className="text-[var(--muted-foreground)] leading-relaxed font-mono">
              本项目完全采用现代成熟的 <strong className="text-[var(--foreground)]">GitOps 自动化持续交付</strong> 机制。当你在本地完成内容或槽位修改后，只需执行以下标准三步：
            </p>
            <div className="p-3 rounded bg-[var(--background)] border border-[var(--border)] font-mono text-[11px] space-y-1 text-[var(--foreground)]">
              <p>git add .</p>
              <p>git commit -m &quot;feat(content): 发布新文章与更新槽位&quot;</p>
              <p>git push origin main</p>
            </div>
            <p className="text-[var(--muted-foreground)] leading-relaxed font-mono">
              💡 <strong className="text-[var(--foreground)]">原理说明</strong>：当你将代码推送到 GitHub，线上托管平台（如 Vercel、Cloudflare Pages 或 Netlify）会自动检测到新提交，在云端自动执行构建打包并在 1 分钟内无缝推向全球 CDN！你完全不需要人工登录服务器或手动上传文件。
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
