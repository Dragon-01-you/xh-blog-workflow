import { getAllPosts } from '~/lib/content'
import { brandConfig, personalInfo } from '~/lib/personal'
import { projects } from '~/lib/projects'
import { publicPageMetadata } from '~/lib/public-page-metadata'
import { seo } from '~/lib/seo'

function absoluteUrl(path: string): string {
  return new URL(path, seo.url).href
}

function oneLine(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function markdownLink(label: string, url: string, note: string): string {
  const safeLabel = oneLine(label).replaceAll('[', '\\[').replaceAll(']', '\\]')
  return `- [${safeLabel}](${url}): ${oneLine(note)}`
}

export function buildLlmsText(): string {
  const posts = getAllPosts()

  return [
    `# ${brandConfig.name} (${brandConfig.enName})`,
    '',
    `> ${brandConfig.tagline}。${brandConfig.bio}`,
    '',
    '## 核心原则与站点架构',
    '',
    `- 站点主理人：${brandConfig.name} (${brandConfig.enName})`,
    `- 微信公众号：「${personalInfo.weChatOfficial}」`,
    `- GitHub：${personalInfo.github}`,
    `- 坐标：${brandConfig.location}`,
    '- 设计系统：瑞士纸墨设计系统（Swiss Paper & Ink）、严格网格排版与确定性认知资产',
    '',
    '## 核心栏目 (Core Sections)',
    '',
    markdownLink(
      publicPageMetadata.home.zh.title,
      absoluteUrl('/'),
      publicPageMetadata.home.zh.description,
    ),
    markdownLink(
      publicPageMetadata.blog.zh.title,
      absoluteUrl('/blog'),
      publicPageMetadata.blog.zh.description,
    ),
    markdownLink(
      publicPageMetadata.projects.zh.title,
      absoluteUrl('/projects'),
      publicPageMetadata.projects.zh.description,
    ),
    markdownLink(
      publicPageMetadata.photos.zh.title,
      absoluteUrl('/photos'),
      publicPageMetadata.photos.zh.description,
    ),
    '',
    '## 深度思考与镇店文章 (Writing)',
    '',
    ...posts.map((post) =>
      markdownLink(
        post.title,
        absoluteUrl(`/blog/${post.slug}`),
        post.summary || post.description || '芯火深度思考文章',
      ),
    ),
    '',
    '## 代表工程与工作流项目 (Projects)',
    '',
    ...projects.map((project) =>
      markdownLink(
        project.name,
        project.url.startsWith('/') ? absoluteUrl(project.url) : project.url,
        `${project.domain} · ${project.description}`,
      ),
    ),
    '',
    '## 发现与检索基础设施 (Discovery)',
    '',
    markdownLink(
      'RSS 2.0 订阅源',
      absoluteUrl('/feed.xml'),
      '全站最新文章与更新的标准化 XML 订阅源',
    ),
    markdownLink(
      '站点地图 (Sitemap)',
      absoluteUrl('/sitemap.xml'),
      '搜索引擎与网络爬虫的标准 XML 索引',
    ),
    markdownLink(
      '爬虫协议 (Robots.txt)',
      absoluteUrl('/robots.txt'),
      '开放爬取公域路由并保护内部后台',
    ),
    '',
  ].join('\n')
}
