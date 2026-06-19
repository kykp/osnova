import { getPayload } from 'payload'
import React from 'react'

import type { Media, News as NewsItem } from '@/payload-types'
import config from '@/payload.config'
import { pickMediaSize } from '@/utils/mediaSize'

type NewsListProps = {
  heading?: string | null
  limit?: number | null
  allLinkLabel?: string | null
  allLinkUrl?: string | null
}

const ArrowIcon = () => (
  <span className="ic">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  </span>
)

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
    <section className="section" id="news">
      <div className="container">
        <div className="section-head row reveal">
          <div>
            <span className="eyebrow">Журнал</span>
            {heading && <h2>{heading}</h2>}
          </div>
          {allLinkUrl && allLinkLabel && (
            <a className="btn-text" href={allLinkUrl}>
              {allLinkLabel}
              <ArrowIcon />
            </a>
          )}
        </div>
        <div className="news reveal">
          {items.map((n) => {
            const cover =
              n.cover && typeof n.cover === 'object'
                ? pickMediaSize(n.cover as Media, 'card')
                : null
            return (
              <a key={n.id} className="post" href={`/news/${n.slug}`}>
                <div
                  className="cover"
                  style={
                    cover
                      ? {
                          backgroundImage: `url(${cover.url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }
                      : { background: 'var(--accent-soft)' }
                  }
                  aria-label={n.title}
                />
                <div className="body">
                  {n.publishedAt && <div className="date">{formatDate(n.publishedAt)}</div>}
                  <h3>{n.title}</h3>
                  {n.excerpt && <p>{n.excerpt}</p>}
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
