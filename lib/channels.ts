// V 槽位 #11 · 通用渠道矩阵与参数偏好
import type { IconKey } from '~/lib/channel-icons'
import { brandConfig, personalInfo } from '~/lib/personal'

export type ChannelKind = 'qr-image' | 'external' | 'email' | 'github-heatmap'
export type ChannelSlot = 'home' | 'footer' | 'dock'

export interface Channel {
  key: string
  label: string
  labelEn: string
  kind: ChannelKind
  href?: string
  image?: string
  hint?: string
  dockLabel?: string
  dockLabelEn?: string
  blurb?: string
  icon: IconKey
  tone?: string
  showIn: ChannelSlot[]
  weeks?: number
}

export const channelPrefs = {
  showContributionGraph: true,
  contributionWeeks: 26,
  showFollowerStats: true,
  copyrightYear: 'inherit' as 'inherit' | number,
}

function legacyChannels(): Channel[] {
  const list: Channel[] = []
  if (personalInfo.weChatOfficial && personalInfo.weChatOfficialQr) {
    list.push({
      key: 'wechat',
      label: personalInfo.weChatOfficial,
      labelEn: 'WeChat Official',
      kind: 'qr-image',
      image: personalInfo.weChatOfficialQr,
      hint: '微信扫一扫 · 关注公众号',
      dockLabel: '公众号',
      dockLabelEn: 'WeChat',
      blurb: '深度长文与认知资产沉淀',
      icon: 'wechat',
      tone: 'text-emerald-600 dark:text-emerald-400',
      showIn: ['home', 'footer', 'dock'],
    })
  }
  if (personalInfo.xiaoHongShu) {
    list.push({
      key: 'xiaohongshu',
      label: '小红书',
      labelEn: 'RED',
      kind: 'external',
      href: personalInfo.xiaoHongShu,
      icon: 'xiaohongshu',
      tone: 'text-rose-600 dark:text-rose-400',
      showIn: ['home', 'footer'],
    })
  }
  if (personalInfo.github || personalInfo.githubUser) {
    const user = personalInfo.githubUser || personalInfo.handle || brandConfig.enName
    list.push({
      key: 'github',
      label: 'GitHub',
      labelEn: 'GitHub',
      kind: 'github-heatmap',
      href: personalInfo.github
        ? `${personalInfo.github}?tab=repositories`
        : `https://github.com/${user}?tab=repositories`,
      icon: 'github',
      showIn: ['home', 'footer'],
      weeks: channelPrefs.contributionWeeks,
    })
  }
  if (personalInfo.xiaoBaoTong) {
    list.push({
      key: 'xiaobaotong',
      label: '小报童',
      labelEn: 'Newsletter',
      kind: 'external',
      href: personalInfo.xiaoBaoTong,
      icon: 'xiaobaotong',
      showIn: ['footer'],
    })
  }
  if (personalInfo.email) {
    list.push({
      key: 'email',
      label: '邮箱',
      labelEn: 'Email',
      kind: 'email',
      href: `mailto:${personalInfo.email}`,
      icon: 'mail',
      showIn: ['home', 'footer'],
    })
  }
  return list
}

export const extraChannels: Channel[] = []
export const disabledChannels: string[] = []

export function getChannels(): Channel[] {
  const merged = new Map<string, Channel>()
  for (const c of legacyChannels()) merged.set(c.key, c)
  for (const c of extraChannels) merged.set(c.key, { ...(merged.get(c.key) as Channel), ...c })
  for (const k of disabledChannels) merged.delete(k)
  return [...merged.values()].filter((c) => (c.kind === 'qr-image' ? !!c.image : !!c.href))
}

export function channelsFor(slot: ChannelSlot): Channel[] {
  return getChannels().filter((c) => c.showIn.includes(slot))
}
