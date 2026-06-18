import { getPayload } from 'payload'
import React from 'react'

import type { Media, News as NewsItem } from '@/payload-types'
import config from '@/payload.config'
import { pickMediaSize } from '@/utils/mediaSize'

import styles from './Component.module.css'

type NewsListProps = {
  heading?: string | null
  limit?: number | null
  allLinkLabel?: string | null
  allLinkUrl?: string | null
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export async function NewsList({ heading, limit, allLinkLabel, allLinkUrl }: NewsListProps) {
  const payload = await getPayload({ config: await config })
  const result = await payload.find({
    collection: 'news',
    sort: '-publishedAt',
    limit: limit && limit > 0 ? limit : 3,
    where: { _status: { equals: 'published' } },
    depth: 1,
  })

  const items = result.docs as NewsItem[]
  if (items.length === 0) return null

  return (
    <section className={styles.root}>
      <header className={styles.header}>
        {heading && <h2 className={styles.heading}>{heading}</h2>}
        {allLinkUrl && allLinkLabel && (
          <a href={allLinkUrl} className={styles.allLink}>
            {allLinkLabel}
          </a>
        )}
      </header>
      <ul className={styles.grid}>
        {items.map((n) => {
          const cover =
            n.cover && typeof n.cover === 'object'
              ? pickMediaSize(n.cover as Media, 'card')
              : null
          return (
            <li key={n.id} className={styles.card}>
              <a className={styles.link} href={`/news/${n.slug}`}>
                {cover && <img src={cover.url} alt={n.title} className={styles.cover} />}
                <div className={styles.body}>
                  {n.publishedAt && <div className={styles.date}>{formatDate(n.publishedAt)}</div>}
                  <h3 className={styles.title}>{n.title}</h3>
                  {n.excerpt && <p className={styles.excerpt}>{n.excerpt}</p>}
                </div>
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
