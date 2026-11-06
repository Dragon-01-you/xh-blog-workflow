import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

console.log('🔍 Starting Public Discovery & Gateway Verification (V-slot brand: dynamic)...')

// 1. Verify Content Blog Slugs
const blogDir = path.join(rootDir, 'content/blog')
const blogSlugs = fs
  .readdirSync(blogDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort()

assert.ok(blogSlugs.length >= 1, `At least 1 blog article must exist, found: ${blogSlugs.length}`)
for (const slug of blogSlugs) {
  assert.match(slug, /^[a-z0-9-]+$/, `Invalid slug name format: ${slug}`)
}
console.log(`  ✅ ${blogSlugs.length} core blog articles verified on filesystem.`)

// 2. Verify all articles have index.mdx and valid frontmatter
for (const slug of blogSlugs) {
  const mdxPath = path.join(blogDir, slug, 'index.mdx')
  assert.ok(fs.existsSync(mdxPath), `Missing index.mdx for ${slug}`)
  const raw = fs.readFileSync(mdxPath, 'utf8')
  const { data } = matter(raw)
  assert.ok(data.title, `Missing title in ${slug}`)
  assert.ok(data.date || data.publishedAt, `Missing date in ${slug}`)
}
console.log('  ✅ All blog articles have valid frontmatter.')

// 3. Verify public assets for projects and photos
const publicImagesDir = path.join(rootDir, 'public/images')
assert.ok(fs.existsSync(publicImagesDir), 'public/images directory must exist')

// Read projects.ts and photos.ts to extract image paths
const projectsTs = fs.readFileSync(path.join(rootDir, 'lib/projects.ts'), 'utf8')
const photosTs = fs.readFileSync(path.join(rootDir, 'lib/photos.ts'), 'utf8')

// Extract icons from projects.ts
const projectIconMatches = [...projectsTs.matchAll(/icon:\s*['"]([^'"]+)['"]/g)]
assert.ok(projectIconMatches.length > 0, 'projects.ts must declare project icons')
for (const match of projectIconMatches) {
  const iconPath = path.join(rootDir, 'public', match[1].replace(/^\//, ''))
  assert.ok(
    fs.existsSync(iconPath),
    `Project icon file missing on disk: ${iconPath}`,
  )
}
console.log(`  ✅ All ${projectIconMatches.length} project icon images exist on disk.`)

// Extract photos from photos.ts
const photoSrcMatches = [...photosTs.matchAll(/src:\s*['"]([^'"]+)['"]/g)]
for (const match of photoSrcMatches) {
  const photoPath = path.join(rootDir, 'public', match[1].replace(/^\//, ''))
  assert.ok(
    fs.existsSync(photoPath),
    `Photo image file missing on disk: ${photoPath}`,
  )
}
console.log(`  ✅ All ${photoSrcMatches.length} photo gallery images exist on disk.`)

// 4. Verify Route Source Files exist
const requiredRoutes = [
  'app/sitemap.ts',
  'app/robots.ts',
  'app/feed.xml/route.ts',
  'app/llms.txt/route.ts',
  'app/admin/page.tsx',
  'app/projects/page.tsx',
  'app/photos/page.tsx',
  'app/manifest.ts',
  'app/og/route.tsx',
]

for (const route of requiredRoutes) {
  const fullPath = path.join(rootDir, route)
  assert.ok(fs.existsSync(fullPath), `Required route missing: ${route}`)
}
console.log('  ✅ All required discovery & page routes exist.')

// 5. Verify Brand Name consistency in discovery files
const llmsContent = fs.existsSync(path.join(rootDir, 'lib/llms.ts'))
  ? fs.readFileSync(path.join(rootDir, 'lib/llms.ts'), 'utf8')
  : fs.readFileSync(path.join(rootDir, 'app/llms.txt/route.ts'), 'utf8')
assert.ok(/brandConfig|personalInfo/.test(llmsContent), 'llms text must derive the brand from V-slot data')
assert.ok(!llmsContent.includes('星火'), 'llms text must NOT contain the 星火 typo')

const feedsTs = fs.readFileSync(path.join(rootDir, 'lib/feeds.ts'), 'utf8')
assert.ok(feedsTs.includes('brandConfig.name'), 'lib/feeds.ts must reference brandConfig')

const sitemapTs = fs.readFileSync(path.join(rootDir, 'app/sitemap.ts'), 'utf8')
assert.ok(sitemapTs.includes('getAllPosts'), 'app/sitemap.ts must include all posts')

const robotsTs = fs.readFileSync(path.join(rootDir, 'app/robots.ts'), 'utf8')
assert.ok(robotsTs.includes("'/admin'"), 'app/robots.ts must disallow /admin')

console.log('  ✅ Brand name consistency & gateway configurations verified.')
console.log('🎉 Public Discovery Gateway Verification Passed with 100% success!')
