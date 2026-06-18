'use client'

import React, { useEffect, useRef, useState } from 'react'

import type { Media } from '@/payload-types'
import { pickMediaSize } from '@/utils/mediaSize'

import styles from './Component.module.css'

type Slide = {
  id?: string | null
  image: Media | number
  caption?: string | null
  url?: string | null
}

type SliderProps = {
  heading?: string | null
  autoplay?: boolean | null
  slides?: Slide[] | null
}

export function Slider({ heading, autoplay, slides }: SliderProps) {
  const list = (slides ?? []).filter((s) => typeof s.image === 'object')
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!autoplay || paused || list.length < 2) return
    timer.current = setInterval(() => {
      setIdx((p) => (p + 1) % list.length)
    }, 5000)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [autoplay, paused, list.length])

  if (list.length === 0) return null
  const last = list.length - 1

  return (
    <section className={styles.root}>
      {heading && <h2 className={styles.heading}>{heading}</h2>}
      <div
        className={styles.frame}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className={styles.track} style={{ transform: `translateX(-${idx * 100}%)` }}>
          {list.map((s, i) => {
            const image = pickMediaSize(s.image as Media, 'feature')
            if (!image) return null
            const inner = (
              <>
                <img src={image.url} alt={s.caption || ''} className={styles.image} />
                {s.caption && <div className={styles.caption}>{s.caption}</div>}
              </>
            )
            return (
              <div key={s.id ?? i} className={styles.slide}>
                {s.url ? (
                  <a className={styles.link} href={s.url}>
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </div>
            )
          })}
        </div>

        {list.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowPrev}`}
              aria-label="Предыдущий слайд"
              onClick={() => setIdx((p) => (p === 0 ? last : p - 1))}
            >
              ‹
            </button>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowNext}`}
              aria-label="Следующий слайд"
              onClick={() => setIdx((p) => (p === last ? 0 : p + 1))}
            >
              ›
            </button>
            <div className={styles.dots}>
              {list.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={i === idx ? styles.dotActive : styles.dot}
                  aria-label={`Слайд ${i + 1}`}
                  onClick={() => setIdx(i)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
