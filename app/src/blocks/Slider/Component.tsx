'use client'

import React, { useEffect, useRef, useState } from 'react'

import type { Media } from '@/payload-types'
import { pickMediaSize } from '@/utils/mediaSize'

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

const ArrowLeft = () => (
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
)
const ArrowRight = () => (
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
)

export function Slider({ heading, autoplay, slides }: SliderProps) {
  const list = (slides ?? []).filter((s) => typeof s.image === 'object')
  const [idx, setIdx] = useState(0)
  const slidesRef = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!autoplay || list.length < 2) return
    timer.current = setInterval(() => {
      setIdx((p) => (p + 1) % list.length)
    }, 5000)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [autoplay, list.length])

  const prevIdx = useRef(0)
  useEffect(() => {
    const el = slidesRef.current
    if (!el) return
    const slide = el.children[idx] as HTMLElement | undefined
    if (slide) {
      // На wrap'е (последний → первый или наоборот) smooth-скролл
      // конфликтует с scroll-snap mandatory — слайдер «буксует» и
      // снапается к промежуточной картинке. Делаем мгновенный прыжок.
      const isWrap = Math.abs(idx - prevIdx.current) > 1
      el.scrollTo({
        left: slide.offsetLeft - el.offsetLeft,
        behavior: isWrap ? 'auto' : 'smooth',
      })
    }
    prevIdx.current = idx
  }, [idx])

  if (list.length === 0) return null
  const last = list.length - 1

  return (
    <section className="section tight alt" id="gallery">
      <div className="container">
        {heading && (
          <div className="section-head row reveal">
            <div>
              <span className="eyebrow">Галерея</span>
              <h2>{heading}</h2>
            </div>
          </div>
        )}
        <div className="slider reveal">
          <div className="slides" ref={slidesRef}>
            {list.map((s, i) => {
              const image = pickMediaSize(s.image as Media, 'feature')
              if (!image) return null
              const inner = (
                <>
                  <div
                    className="pic"
                    style={{
                      backgroundImage: `url(${image.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                    aria-label={s.caption ?? ''}
                  />
                  {s.caption && (
                    <div className="cap">
                      <div>
                        <h3>{s.caption}</h3>
                      </div>
                      <span className="go">
                        <ArrowRight />
                      </span>
                    </div>
                  )}
                </>
              )
              return s.url ? (
                <a key={s.id ?? i} className="slide" href={s.url}>
                  {inner}
                </a>
              ) : (
                <div key={s.id ?? i} className="slide">
                  {inner}
                </div>
              )
            })}
          </div>
          {list.length > 1 && (
            <div className="slider-ctrl">
              <div className="arrows">
                <button
                  type="button"
                  className="s-arrow"
                  aria-label="Назад"
                  onClick={() => setIdx((p) => (p === 0 ? last : p - 1))}
                >
                  <ArrowLeft />
                </button>
                <button
                  type="button"
                  className="s-arrow"
                  aria-label="Вперёд"
                  onClick={() => setIdx((p) => (p === last ? 0 : p + 1))}
                >
                  <ArrowRight />
                </button>
              </div>
              <div className="dots">
                {list.map((_, i) => (
                  <i
                    key={i}
                    className={i === idx ? 'on' : ''}
                    onClick={() => setIdx(i)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Слайд ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
