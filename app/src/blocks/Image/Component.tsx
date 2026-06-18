import React from 'react'

import type { Media, Page } from '@/payload-types'
import { pickMediaSize } from '@/utils/mediaSize'

import styles from './Component.module.css'

type ImageBlockProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'image' }>

export function ImageBlock({ image, caption, url }: ImageBlockProps) {
  const media = typeof image === 'object' && image !== null ? (image as Media) : null
  const picture = pickMediaSize(media, 'feature')
  if (!picture) return null

  const img = (
    <img
      className={styles.image}
      src={picture.url}
      alt={media?.alt ?? ''}
      width={picture.width}
      height={picture.height}
      loading="lazy"
    />
  )

  return (
    <section className={styles.root}>
      <figure className={styles.figure}>
        {url ? (
          <a className={styles.link} href={url}>
            {img}
          </a>
        ) : (
          img
        )}
        {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
      </figure>
    </section>
  )
}
