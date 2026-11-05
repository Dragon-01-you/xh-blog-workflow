import type { GitHubSnapshot } from '~/components/social-cards'
import bakedGithub from '~/content/github.json'
import { personalInfo } from '~/lib/personal'

export async function getGitHub(): Promise<GitHubSnapshot> {
  const githubUser = personalInfo.githubUser || personalInfo.handle || 'Dragon-01-you'

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3500)

    const [contrib, user] = await Promise.all([
      fetch(`https://github-contributions-api.jogruber.de/v4/${githubUser}?y=last`, {
        signal: controller.signal,
      }).then((r) => {
        if (!r.ok) throw new Error(`contributions ${r.status}`)
        return r.json()
      }),
      fetch(`https://api.github.com/users/${githubUser}`, {
        headers: { accept: 'application/vnd.github+json', 'user-agent': 'xinhuo.me' },
        signal: controller.signal,
      }).then((r) => {
        if (!r.ok) throw new Error(`user ${r.status}`)
        return r.json()
      }),
    ])

    clearTimeout(timeoutId)
    const days: Array<{ date: string; level: number }> = contrib.contributions
    return {
      user: githubUser,
      followers: user.followers ?? bakedGithub.followers,
      total: contrib.total?.lastYear ?? bakedGithub.total,
      to: days && days.length > 0 ? days[days.length - 1].date : bakedGithub.to,
      levels: days && days.length > 0 ? days.map((d) => d.level).join('') : bakedGithub.levels,
    }
  } catch {
    return bakedGithub as GitHubSnapshot
  }
}
