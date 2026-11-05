// V 槽位 #12 · 渠道图标库（默认图标随模板走，不想挑的人也能正常显示；想换只需改 icon 字段）
import { Archive, BookMarked, Contact, Feather, FileText, Globe, Library, Megaphone, MessageCircle, Music, Newspaper, Podcast, Radio, Rss, ScrollText, Send, Share2, Users } from 'lucide-react'
import type { ComponentType } from 'react'

export type IconKey =
  | 'wechat' | 'xiaohongshu' | 'github' | 'xiaobaotong' | 'newspaper' | 'mail' | 'rss' | 'book' | 'archive'
  | 'podcast' | 'video' | 'microblog' | 'forum' | 'scholar' | 'store' | 'photography' | 'writing' | 'community' | 'link'

const GLYPH_PATHS: Partial<Record<IconKey, string>> = {
  github: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  wechat: 'M8.691 2.188C4.341 2.188.804 5.07.804 8.625c0 1.93.987 3.659 2.533 4.812l-.64 2.373 2.502-1.282c.983.315 2.03.497 3.127.497.124 0 .245-.005.365-.011a6.67 6.67 0 0 1-.223-1.688c0-3.66 3.342-6.626 7.464-6.626.33 0 .653.02 1.002.055C16.143 4.966 12.756 2.188 8.691 2.188zm-2.22 3.375c.535 0 .969.434.969.969s-.434.969-.969.969-.969-.434-.969-.969.434-.969.969-.969zm4.438 0c.535 0 .969.434.969.969s-.434.969-.969.969-.969-.434-.969-.969.434-.969.969-.969zm4.72 4.156c-3.447 0-6.242 2.455-6.242 5.485 0 1.637.822 3.104 2.112 4.084l-.534 1.98 2.088-1.07c.82.264 1.693.414 2.608.414 3.447 0 6.242-2.455 6.242-5.484 0-3.03-2.795-5.485-6.242-5.485zm-1.854 2.813c.446 0 .808.362.808.808s-.362.808-.808.808-.808-.362-.808-.808.362-.808.808-.808zm3.708 0c.446 0 .808.362.808.808s-.362.808-.808.808-.808-.362-.808-.808.362-.808.808-.808z',
}
const LUCIDE_MAP: Partial<Record<IconKey, ComponentType<{ className?: string }>>> = {
  xiaohongshu: MessageCircle, xiaobaotong: Newspaper, newspaper: Newspaper, mail: Contact, rss: Rss,
  book: BookMarked, archive: Archive, podcast: Podcast, video: Megaphone, microblog: Send, forum: Users,
  scholar: Library, store: FileText, photography: Feather, writing: ScrollText, community: Users, link: Globe,
}
export const ICON_CHOICES: { key: IconKey; zh: string; en: string }[] = [
  { key: 'wechat', zh: '微信 / 即时通讯', en: 'WeChat / Messenger' },
  { key: 'xiaohongshu', zh: '小红书 / 图文社区', en: 'Xiaohongshu / Photo community' },
  { key: 'github', zh: '代码托管', en: 'Code hosting' },
  { key: 'xiaobaotong', zh: '小报童 / 付费专栏', en: 'Paid column' },
  { key: 'newspaper', zh: '报刊 / Newsletter / 抖音号', en: 'Print / Newsletter / Douyin' },
  { key: 'mail', zh: '邮箱', en: 'Email' },
  { key: 'rss', zh: 'RSS 订阅', en: 'RSS feed' },
  { key: 'book', zh: '书 / 出版物', en: 'Book / Publication' },
  { key: 'archive', zh: '档案库', en: 'Archive' },
  { key: 'podcast', zh: '播客', en: 'Podcast' },
  { key: 'video', zh: '视频平台', en: 'Video platform' },
  { key: 'microblog', zh: '微博 / X', en: 'Microblog / X' },
  { key: 'forum', zh: '社群 / 论坛', en: 'Forum / Community' },
  { key: 'scholar', zh: '学术主页', en: 'Scholar page' },
  { key: 'photography', zh: '摄影作品', en: 'Photography' },
  { key: 'writing', zh: '写作主页', en: 'Writing profile' },
  { key: 'link', zh: '个人网站', en: 'Personal site' },
]
export function ChannelGlyph({ icon, className = 'w-4 h-4' }: { icon: IconKey; className?: string }) {
  const path = GLYPH_PATHS[icon]
  if (path) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d={path} />
      </svg>
    )
  }
  const Cmp = LUCIDE_MAP[icon] ?? Share2
  return <Cmp className={className} />
}
