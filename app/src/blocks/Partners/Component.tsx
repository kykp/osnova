import React from 'react'

import type { Media } from '@/payload-types'
import { pickMediaSize } from '@/utils/mediaSize'

import styles from './Component.module.css'

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
    <section className={styles.root}>
      {heading && <h2 className={styles.heading}>{heading}</h2>}
      <ul className={styles.grid}>
        {list.map((it, i) => {
          const image = pickMediaSize(it.logo as Media, 'thumbnail')
          if (!image) return null
          const img = (
            <img
              src={image.url}
              alt={it.name || ''}
              className={styles.logo}
              loading="lazy"
            />
          )
          return (
            <li key={it.id ?? i} className={styles.cell}>
              {it.url ? (
                <a href={it.url} className={styles.link} target="_blank" rel="noopener noreferrer">
                  {img}
                </a>
              ) : (
                img
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
