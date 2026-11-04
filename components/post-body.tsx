import React from 'react'
import { RevealScope } from '~/components/reveal-scope'

export function PostBody({
  html,
  lang = 'zh-CN',
}: {
  html: string
  lang?: string
}) {
  return (
    <RevealScope
      lang={lang}
      className="post-body-stage prose enter mt-10"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
