import React from 'react'

import type { Media, Page } from '@/payload-types'
import { pickMediaSize } from '@/utils/mediaSize'

import styles from './Component.module.css'

type CardsBlockProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'cards' }>
type CardItem = NonNullable<CardsBlockProps['items']>[number]

export function Cards({ heading, items }: CardsBlockProps) {
  if (!items?.length) return null

  return (
    <section className={styles.root}>
      <div className={styles.inner}>
        {heading ? <h2 className={styles.heading}>{heading}</h2> : null}
        <ul className={styles.grid}>
          {items.map((item) => (
            <li key={item.id} className={styles.cell}>
              <Card item={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Card({ item }: { item: CardItem }) {
  const media = typeof item.image === 'object' && item.image !== null ? (item.image as Media) : null
  const picture = pickMediaSize(media, 'card')
  const Inner = (
    <>
      {picture ? (
        <img
          className={styles.image}
          src={picture.url}
          alt={media?.alt ?? ''}
          width={picture.width}
          height={picture.height}
          loading="lazy"
        />
      ) : null}
      <div className={styles.body}>
        <h3 className={styles.title}>{item.title}</h3>
        {item.description ? <p className={styles.description}>{item.description}</p> : null}
      </div>
    </>
  )

  if (item.url) {
    return (
      <a className={`${styles.card} ${styles.cardLink}`} href={item.url}>
        {Inner}
      </a>
    )
  }
  return <div className={styles.card}>{Inner}</div>
}
