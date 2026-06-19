import React from 'react'

import type { Page } from '@/payload-types'

type HeroProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'hero' }>

const ArrowIcon = () => (
  <span className="ic">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  </span>
)

export function Hero({ heading, subheading, cta }: HeroProps) {
  return (
    <section className="hero" id="hero">
      <div
        className="container hero-grid"
        style={{ gridTemplateColumns: '1fr', textAlign: 'center', maxWidth: 820 }}
      >
        <div className="reveal" style={{ marginInline: 'auto' }}>
          <h1>{heading}</h1>
          {subheading ? (
            <p className="sub" style={{ marginInline: 'auto' }}>
              {subheading}
            </p>
          ) : null}
          {cta?.label && cta?.url ? (
            <div className="cta" style={{ justifyContent: 'center' }}>
              <a className="btn btn-primary btn-lg" href={cta.url}>
                {cta.label}
                <ArrowIcon />
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
