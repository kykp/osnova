import React from 'react'

import type { Media, Page } from '@/payload-types'
import { pickMediaSize } from '@/utils/mediaSize'

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

export function Hero({ heading, subheading, variant, image, cta }: HeroProps) {
  const media = typeof image === 'object' ? (image as Media | null) : null
  const picked = pickMediaSize(media, 'feature') ?? pickMediaSize(media, 'card')
  const v = variant ?? 'centered'
  const hasImage = Boolean(picked)
  const isSplit = v === 'split' && hasImage
  const isOverlay = v === 'overlay' && hasImage

  const text = (
    <div className="hero-text reveal">
      <h1>{heading}</h1>
      {subheading ? <p className="sub">{subheading}</p> : null}
      {cta?.label && cta?.url ? (
        <div className="cta">
          <a className="btn btn-primary btn-lg" href={cta.url}>
            {cta.label}
            <ArrowIcon />
          </a>
        </div>
      ) : null}
    </div>
  )

  if (isOverlay && picked) {
    return (
      <section className="hero is-overlay" id="hero">
        <img
          className="hero-bg"
          src={picked.url}
          alt={media?.alt || ''}
          width={picked.width}
          height={picked.height}
          loading="eager"
        />
        <div className="hero-bg-tint" aria-hidden="true" />
        <div className="container hero-grid">{text}</div>
      </section>
    )
  }

  return (
    <section className={`hero${isSplit ? ' is-split' : ''}`} id="hero">
      <div className="container hero-grid">
        {text}
        {isSplit && picked ? (
          <div className="hero-visual reveal">
            <img
              src={picked.url}
              alt={media?.alt || ''}
              width={picked.width}
              height={picked.height}
              loading="eager"
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}
