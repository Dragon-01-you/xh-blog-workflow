import { Marked } from 'marked'
import { codeToHtml } from 'shiki'
import { cleanHeading, SimpleSlugger } from './content'

interface CustomCodeToken {
  type: string
  text: string
  lang?: string
  highlighted?: string
}

export async function renderMarkdown(
  source: string,
  options?: { slug?: string; idPrefix?: string }
): Promise<string> {
  const slugger = new SimpleSlugger()
  const prefix = options?.idPrefix ?? ''

  const marked = new Marked({
    async: true,
    gfm: true,
    breaks: false,
  })

  marked.use({
    async walkTokens(token) {
      if (token.type === 'code') {
        const codeToken = token as unknown as CustomCodeToken
        const cleanLang = (codeToken.lang || 'text').split(/\s+/)[0]
        try {
          const html = await codeToHtml(codeToken.text, {
            lang: cleanLang,
            themes: {
              light: 'github-light-default',
              dark: 'github-dark-default',
            },
            defaultColor: false,
          })
          codeToken.highlighted = html
        } catch {
          codeToken.highlighted = `<pre class="my-6 overflow-x-auto rounded-md border border-[var(--border)] p-4 font-mono text-sm"><code>${escapeHtml(codeToken.text)}</code></pre>`
        }
      }
    },
    renderer: {
      heading({ tokens, depth, text }) {
        const rawText = tokens.map((t) => ('text' in t ? t.text : '')).join('') || text
        const label = cleanHeading(rawText)
        const id = `${prefix}${slugger.slug(label)}`
        return `<h${depth} id="${id}">${text}</h${depth}>\n`
      },
      code(token) {
        const codeToken = token as unknown as CustomCodeToken
        if (codeToken.highlighted) {
          return `<div class="code-block my-6 overflow-hidden rounded-md border border-[var(--border)]">${codeToken.highlighted}</div>\n`
        }
        return `<pre class="my-6 overflow-x-auto rounded-md border border-[var(--border)] p-4 font-mono text-sm"><code>${escapeHtml(token.text)}</code></pre>\n`
      },
      image({ href, title, text }) {
        const caption = title || text
        return `<figure class="post-figure my-8 block">
          <img src="${href}" alt="${text || ''}" class="w-full rounded border border-[var(--border)] shadow-sm" loading="lazy" />
          ${caption ? `<figcaption class="post-figcaption mt-2 text-center text-xs text-[var(--muted-foreground)]">${caption}</figcaption>` : ''}
        </figure>`
      },
    },
  })

  return marked.parse(source) as Promise<string>
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
