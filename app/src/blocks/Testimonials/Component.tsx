'use client'

import React, { useState } from 'react'

import type { Media } from '@/payload-types'
import { pickMediaSize } from '@/utils/mediaSize'

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

const Stars = () => (
  <div className="stars" aria-label="5 из 5">
    {Array.from({ length: 5 }).map((_, i) => (
      <span className="ic" key={i}>
        <svg viewBox="0 0 24 24">
          <path d="M12 3.5l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8L6.6 20l1-6L3.3 9.9l6-.9z" />
        </svg>
      </span>
    ))}
  </div>
)

function Quote({ item }: { item: Item }) {
  const photo = typeof item.photo === 'object' ? pickMediaSize(item.photo, 'thumbnail') : null
  return (
    <div className="quote">
      <Stars />
      <p>«{item.quote}»</p>
      <div className="by">
        <span
          className="av"
          style={
            photo
              ? {
                  backgroundImage: `url(${photo.url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : { background: 'var(--accent-soft)' }
          }
          aria-hidden="true"
        />
        <span>
          <b>{item.author}</b>
          {item.role && <span>{item.role}</span>}
        </span>
      </div>
    </div>
  )
}

export function Testimonials({ heading, variant, items }: TestimonialsProps) {
  const list = items ?? []
  if (list.length === 0) return null

  return (
    <section className="section alt" id="reviews">
      <div className="container">
        {heading && (
          <div className="section-head reveal">
            <span className="eyebrow">Отзывы</span>
            <h2>{heading}</h2>
          </div>
        )}
        {variant === 'cards' ? (
          <div className="quotes reveal">
            {list.map((it, i) => (
              <Quote key={it.id ?? i} item={it} />
            ))}
          </div>
        ) : (
          <SliderQuotes items={list} />
        )}
      </div>
    </section>
  )
}

function SliderQuotes({ items }: { items: Item[] }) {
  const [idx, setIdx] = useState(0)
  const last = items.length - 1
  return (
    <div className="reveal">
      <div style={{ maxWidth: 720, marginInline: 'auto' }}>
        <Quote item={items[idx]} />
      </div>
      <div className="slider-ctrl" style={{ justifyContent: 'center' }}>
        <div className="arrows">
          <button
            type="button"
            className="s-arrow"
            aria-label="Предыдущий"
            onClick={() => setIdx((p) => (p === 0 ? last : p - 1))}
          >
            <span className="ic">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </span>
          </button>
          <button
            type="button"
            className="s-arrow"
            aria-label="Следующий"
            onClick={() => setIdx((p) => (p === last ? 0 : p + 1))}
          >
            <span className="ic">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </div>
        <div className="dots">
          {items.map((_, i) => (
            <i
              key={i}
              className={i === idx ? 'on' : ''}
              onClick={() => setIdx(i)}
              role="button"
              tabIndex={0}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
