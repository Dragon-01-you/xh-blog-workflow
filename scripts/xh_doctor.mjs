#!/usr/bin/env node
/**
 * xh-blog doctor · 换人硬门禁
 * 缺必填 / 残留原作者信息 / 声明了平台却没有链接或图样 → 打印「必须问本人的问题清单」并以非零码退出，阻断构建。
 * 逃生阀：确实没有该渠道，就把它写进 lib/channels.ts 的 disabledChannels，视为已显式声明。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const read = (p) => { try { return fs.readFileSync(path.join(root, p), 'utf8') } catch { return '' } }
const grab = (src, key) => (src.match(new RegExp(`${key}:\\s*'((?:[^'\\\\]|\\\\.)*)'`)) || [])[1] || ''
const arrOf = (src, key) => {
  const i = src.indexOf(key); if (i < 0) return []
  const s = src.indexOf('[', i), e = src.indexOf(']', s)
  return s < 0 || e < 0 ? [] : [...src.slice(s + 1, e).matchAll(/'([^']+)'/g)].map((m) => m[1])
}
const personal = read('lib/personal.ts'), channels = read('lib/channels.ts')
const questions = [], errors = []
const ask = (id, zh, why) => questions.push({ id, zh, why })

const name = grab(personal, 'name'), enName = grab(personal, 'enName')
const tagline = grab(personal, 'tagline'), email = grab(personal, 'email'), location = grab(personal, 'location')
if (!name) ask('identity.name', '这位创作者对外使用的名字是什么？（站名、页脚、肖像舞台都用它）', 'brandConfig.name 为空')
if (!enName || enName === name) ask('identity.enName', '他的英文名 / 拼音 / handle 是什么？（Title、OG 分享图、llms.txt 用）', 'brandConfig.enName 缺失或与中文名相同')
if (!tagline) ask('identity.tagline', '一句话身份宣言是什么？（首页 Hero 大字下那行）', 'brandConfig.tagline 为空')
if (!location) ask('identity.location', '常驻城市与时区？页脚坐标印章还需要经纬度', 'brandConfig.location 为空')
if (!email) ask('contact.email', '页脚邮戳用的联络邮箱？没有就明确留空，不要放占位邮箱', 'personalInfo.email 为空')

const allow = (() => { try { return JSON.parse(fs.readFileSync(path.join(root, '.doctor-allow.json'), 'utf8')) } catch { return [] } })()
const isAllowed = (file, token) => allow.some((a) => a.file === file && a.token === token)
const notes = []

// If creator is switching away from master template (name !== '芯火'), enforce strict residue zero-tolerance:
const isTemplateOwner = (name === '芯火')
const 指纹 = isTemplateOwner ? ['z-library'] : ['芯火', 'Xinhuo', 'xinhuo', 'Dragon-01-you', '来自07年', 'z-library']

for (const f of ['lib/personal.ts','lib/projects.ts','lib/photos.ts','lib/seo.ts','lib/llms.ts','lib/social-live.ts','app/og/route.tsx','components/social-cards.tsx','components/bottom-dock.tsx','.env.local','content/github.json']) {
  const src = read(f); if (!src) continue
  for (const k of 指纹) if (src.includes(k)) {
    if (isAllowed(f, k)) {
      const a = allow.find((x) => x.file === f && x.token === k)
      notes.push(`已确认保留：${f} 含「${k}」— ${a?.reason || '已放行'}`)
      continue
    }
    errors.push({
      code: 'TEMPLATE_RESIDUE',
      detail: `「${f}」仍含模板指纹 ${k}`,
      ask: `把 ${f} 里的 ${k} 换成这位创作者自己的信息；若属有意保留的母版致谢，请写入 .doctor-allow.json 并注明原因`
    })
  }
}

const disabled = arrOf(channels, 'disabledChannels')
const wxName = grab(personal, 'weChatOfficial'), wxQr = grab(personal, 'weChatOfficialQr')
const xhs = grab(personal, 'xiaoHongShu'), xbt = grab(personal, 'xiaoBaoTong'), gh = grab(personal, 'github')

if (!disabled.includes('wechat') && wxName) {
  if (!wxQr || !fs.existsSync(path.join(root, 'public', wxQr.replace(/^\//, '')))) {
    errors.push({
      code: 'CHANNEL_NO_TARGET',
      detail: `渠道「微信公众号·${wxName}」有名称却没有可显示的二维码图`,
      ask: '微信公众号二维码图片请上传到 public/images/ 并填 weChatOfficialQr；如果他没有公众号，把 wechat 写进 disabledChannels'
    })
  }
}

for (const [key, label, val] of [['xiaohongshu','小红书',xhs],['xiaobaotong','小报童',xbt],['github','GitHub',gh]]) {
  if (disabled.includes(key)) continue
  if (val && !/^https?:\/\//.test(val)) {
    errors.push({
      code: 'CHANNEL_NO_TARGET',
      detail: `${label} 填的值不是完整链接：${val}`,
      ask: `${label}他给的是主页链接还是二维码？链接请写完整 https://；二维码请作为 kind:'qr-image' 渠道并附 image`
    })
  }
}

const body = channels.slice(channels.indexOf('export const extraChannels'))
for (const m of body.matchAll(/key:\s*'([^']+)'[\s\S]{0,900}?\n {2}\}/g)) {
  const c = m[0], label = (c.match(/label:\s*'([^']+)'/) || [])[1] || m[1]
  const kind = (c.match(/kind:\s*'([^']+)'/) || [])[1]
  const href = (c.match(/href:\s*'([^']+)'/) || [])[1]
  const img = (c.match(/image:\s*'([^']+)'/) || [])[1]
  if (kind === 'external' && !href) {
    errors.push({ code: 'CHANNEL_NO_TARGET', detail: `渠道「${label}」标为 external 却没有 href`, ask: `「${label}」是链接还是二维码？链接请补 href（完整 https://）；二维码请改 kind:'qr-image' 并给 image` })
  }
  if (kind === 'qr-image' && (!img || !fs.existsSync(path.join(root, 'public', img.replace(/^\//, ''))))) {
    errors.push({ code: 'MISSING_ASSET', detail: `渠道「${label}」标为 qr-image 但图样不存在`, ask: `请把「${label}」的二维码/印记图片上传到 public/images/ 并填在 image 字段` })
  }
}

const postsDir = path.join(root, 'content/blog')
const slugs = fs.existsSync(postsDir) ? fs.readdirSync(postsDir).filter((d) => fs.existsSync(path.join(postsDir, d, 'index.mdx'))) : []
if (slugs.length === 0) {
  errors.push({ code: 'NO_CONTENT', detail: 'content/blog 下一篇文章都没有', ask: '他有可发布的原创文章吗？至少需要 1 篇（含 1200x675 题图与两个二级标题）' })
}

for (const s of slugs) {
  const mdx = read(`content/blog/${s}/index.mdx`)
  const title = (mdx.match(/title:\s*"([^"]+)"/) || [])[1] || s
  if ((mdx.match(/^## /gm) || []).length < 2) {
    ask(`article.headings:${s}`, `《${title}》正文少于 2 个二级标题，右侧导航刻度尺不会渲染，可否补两个小标题？`, 'post-toc 需要 >=2 个 landmark')
  }
  if (!fs.existsSync(path.join(postsDir, s, 'cover.jpg'))) {
    errors.push({ code: 'MISSING_ASSET', detail: `文章 ${s} 缺 cover.jpg`, ask: `${title} 的题图（1200x675）能提供吗？` })
  }
}

for (const [file, listName] of [['lib/personal.ts','books'],['lib/personal.ts','records'],['lib/projects.ts','projects']]) {
  const src = read(file), st = src.indexOf(`export const ${listName}`); if (st < 0) continue
  const block = src.slice(st, src.indexOf('\n]', st))
  const entries = block.split(/\n {2}\{/).length - 1
  const urls = [...block.matchAll(/url:\s*'([^']*)'/g)]
  for (const u of urls) if (u[1] && !/^https?:\/\//.test(u[1]) && !u[1].startsWith('/')) {
    errors.push({ code: 'BAD_URL', detail: `${listName} 存在非完整链接：${u[1]}`, ask: `${listName} 里那条目的直达链接请给完整 https:// 地址或内部相对路径` })
  }
  for (const a of [...block.matchAll(/(?:art|icon|cover):\s*'([^']*)'/g)]) {
    if (a[1].startsWith('/images') && !fs.existsSync(path.join(root, 'public', a[1].replace(/^\//, '')))) {
      errors.push({ code: 'MISSING_ASSET', detail: `${listName} 引用了不存在的图：${a[1]}`, ask: `能提供 ${a[1]} 这张封面图吗？没有就换一张或删除该条目` })
    }
  }
  if (urls.length < entries) {
    ask(`${listName}.urls`, `${listName} 有 ${entries} 条但只有 ${urls.length} 个链接，缺的那些条目的来源链接是什么？`, '条目缺 url 字段')
  }
}

if (questions.length) {
  console.log('\n【需要向创作者本人确认的问题】（补齐后重跑 pnpm doctor）')
  questions.forEach((q, i) => console.log(`  ${i + 1}. ${q.zh}\n     ↳ 触发原因：${q.why}`))
}
if (errors.length) {
  console.log('\n【阻塞项：换人未完成的痕迹】')
  for (const e of errors) console.log(`  ✗ [${e.code}] ${e.detail}\n     ↳ ${e.ask}`)
}
if (notes.length) {
  console.log('\n【已显式确认保留的母版字样】')
  notes.forEach((n) => console.log('  · ' + n))
}

if (!errors.length && !questions.length) {
  console.log(`✅ doctor 通过：品牌「${name}」的 ${slugs.length} 篇文章、渠道矩阵、书架与项目均无缺项、无模板残留。`)
  process.exit(0)
}
if (errors.length) {
  console.log(`\n❌ 体检未通过：${errors.length} 个阻塞项，构建已拦截。`)
  process.exit(1)
}
console.log(`\n⚠️ 体检待补：${questions.length} 个问题需要本人回答（同样视为阻塞）。`)
process.exit(1)
