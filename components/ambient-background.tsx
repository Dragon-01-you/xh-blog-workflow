import React from 'react'
import { ArcRulers } from '~/components/arc-rulers'

// 纸墨背景与制图规线 — Paper grain + drafting-guide rules
export function AmbientBackground() {
  return (
    <>
      <div aria-hidden="true" className="paper-grain" />
      <div aria-hidden="true" className="column-guides">
        <div className="column-guide-v" />
        <div className="column-guide-v" />
      </div>
      <div aria-hidden="true" className="column-rulers">
        <ArcRulers />
      </div>
      <div aria-hidden="true" className="viewport-edge-fade viewport-edge-fade-top" />
      <div aria-hidden="true" className="viewport-edge-fade viewport-edge-fade-bottom" />
    </>
  )
}
