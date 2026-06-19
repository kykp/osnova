import React from 'react'

import type { Media, Page } from '@/payload-types'
import { pickMediaSize } from '@/utils/mediaSize'

type ImageBlockProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'image' }>

export function ImageBlock({ image, caption, url }: ImageBlockProps) {
  const media = typeof image === 'object' && image !== null ? (image as Media) : null
  const picture = pickMediaSize(media, 'feature')
  if (!picture) return null

  const inner = (
    <div
      className="pic"
      style={{
        backgroundImage: `url(${picture.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      role="img"
      aria-label={media?.alt ?? ''}
    />
  )

  return (
    <section className="section tight alt">
      <div className="container">
        <figure className="figure reveal">
          {url ? <a href={url}>{inner}</a> : inner}
          {caption && (
            <figcaption>
              <span className="bar" />
              <span>{caption}</span>
            </figcaption>
          )}
        </figure>
      </div>
    </section>
  )
}
