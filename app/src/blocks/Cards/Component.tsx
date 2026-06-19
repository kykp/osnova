import React from 'react'

import type { Media, Page } from '@/payload-types'
import { pickMediaSize } from '@/utils/mediaSize'

type CardsBlockProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'cards' }>
type CardItem = NonNullable<CardsBlockProps['items']>[number]

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

export function Cards({ heading, items }: CardsBlockProps) {
  if (!items?.length) return null

  return (
    <section className="section" id="fleet">
      <div className="container">
        {heading && (
          <div className="section-head center reveal">
            <span className="eyebrow center">Услуги</span>
            <h2>{heading}</h2>
          </div>
        )}
        <div className="tiles reveal">
          {items.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Card({ item }: { item: CardItem }) {
  const media =
    typeof item.image === 'object' && item.image !== null ? (item.image as Media) : null
  const picture = pickMediaSize(media, 'card')

  const inner = (
    <>
      <div
        className="pic"
        style={
          picture
            ? {
                backgroundImage: `url(${picture.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
        aria-label={media?.alt ?? ''}
      />
      <div className="body">
        <h3>{item.title}</h3>
        {item.description ? <p>{item.description}</p> : null}
        {item.url && (
          <span className="more">
            Подробнее
            <ArrowIcon />
          </span>
        )}
      </div>
    </>
  )

  if (item.url) {
    return (
      <a className="tile" href={item.url}>
        {inner}
      </a>
    )
  }
  return <div className="tile">{inner}</div>
}
