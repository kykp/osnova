'use client'

import React, { useState } from 'react'

import type { Media } from '@/payload-types'
import { pickMediaSize } from '@/utils/mediaSize'

import styles from './Component.module.css'

type Item = {
  id?: string | null
  quote: string
  author: string
  role?: string | null
  photo?: Media | number | null
}

type TestimonialsProps = {
  heading?: string | null
  variant: 'cards' | 'slider'
  items?: Item[] | null
}

export function Testimonials({ heading, variant, items }: TestimonialsProps) {
  const list = items ?? []
  if (list.length === 0) return null

  return (
    <section className={styles.root}>
      {heading && <h2 className={styles.heading}>{heading}</h2>}
      {variant === 'cards' ? <Cards items={list} /> : <Slider items={list} />}
    </section>
  )
}

function Card({ item }: { item: Item }) {
  const photo = typeof item.photo === 'object' ? pickMediaSize(item.photo, 'thumbnail') : null
  return (
    <figure className={styles.card}>
      <blockquote className={styles.quote}>{item.quote}</blockquote>
      <figcaption className={styles.meta}>
        {photo && <img src={photo.url} alt={item.author} className={styles.photo} />}
        <div>
          <div className={styles.author}>{item.author}</div>
          {item.role && <div className={styles.role}>{item.role}</div>}
        </div>
      </figcaption>
    </figure>
  )
}

function Cards({ items }: { items: Item[] }) {
  return (
    <ul className={styles.grid}>
      {items.map((it, i) => (
        <li key={it.id ?? i}>
          <Card item={it} />
        </li>
      ))}
    </ul>
  )
}

function Slider({ items }: { items: Item[] }) {
  const [idx, setIdx] = useState(0)
  const last = items.length - 1
  return (
    <div className={styles.slider}>
      <button
        type="button"
        className={styles.arrow}
        aria-label="Предыдущий"
        onClick={() => setIdx((p) => (p === 0 ? last : p - 1))}
      >
        ‹
      </button>
      <div className={styles.sliderTrack}>
        <Card item={items[idx]} />
      </div>
      <button
        type="button"
        className={styles.arrow}
        aria-label="Следующий"
        onClick={() => setIdx((p) => (p === last ? 0 : p + 1))}
      >
        ›
      </button>
      <div className={styles.dots}>
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            className={i === idx ? styles.dotActive : styles.dot}
            aria-label={`Отзыв ${i + 1}`}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>
    </div>
  )
}
