export type PostTransitionElement = 'cover' | 'title'

function postTransitionId(slug: string): string {
  switch (slug) {
    case 'reflecting-after-two-months':
      return 'p01'
    case 'concept-visualization':
      return 'p02'
    case 'top-developers-make-questions':
      return 'p03'
    case 'vibecoding-deployment-guide':
      return 'p04'
    case 'weekly-review-2026-06-15':
      return 'p05'
    case 'campus-data-card-for-alma-mater':
      return 'p06'
    default: {
      let hash = 0
      for (let i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) | 0
      return `p${Math.abs(hash % 1000).toString().padStart(3, '0')}`
    }
  }
}

// View-transition names are CSS identifiers.
export function postViewTransitionName(
  element: PostTransitionElement,
  slug: string,
): string {
  return `${element}-${postTransitionId(slug)}`
}
