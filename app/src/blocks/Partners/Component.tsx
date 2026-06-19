import React from 'react'

import type { Media } from '@/payload-types'
import { pickMediaSize } from '@/utils/mediaSize'

type Item = {
  id?: string | null
  logo: Media | number
  name?: string | null
  url?: string | null
}

type PartnersProps = {
  heading?: string | null
  items?: Item[] | null
}

export function Partners({ heading, items }: PartnersProps) {
  const list = (items ?? []).filter((it) => typeof it.logo === 'object')
  if (list.length === 0) return null

  return (
    <section className="section tight alt" id="partners">
      <div className="container">
        {heading && (
          <div className="section-head center reveal" style={{ marginBottom: 40 }}>
            <span className="eyebrow center">Партнёры</span>
            <h2 style={{ fontSize: 'clamp(24px,3vw,34px)' }}>{heading}</h2>
          </div>
        )}
        <div className="partners reveal">
          {list.map((it, i) => {
            const image = pickMediaSize(it.logo as Media, 'thumbnail')
            if (!image) return null
            const inner = (
              <img
                src={image.url}
                alt={it.name || ''}
                style={{ height: 30, width: 'auto' }}
                loading="lazy"
              />
            )
            return it.url ? (
              <a key={it.id ?? i} className="partner" href={it.url} aria-label={it.name ?? ''}>
                {inner}
              </a>
            ) : (
              <span key={it.id ?? i} className="partner">
                {inner}
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}
