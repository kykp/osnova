'use client'

import React, { useState } from 'react'

type Item = {
  id?: string | null
  icon?: string | null
  metric?: string | null
  title: string
  description?: string | null
}

type FeaturesProps = {
  heading?: string | null
  subheading?: string | null
  variant: 'icons-grid' | 'cards-metric' | 'tabs'
  items?: Item[] | null
}

export function Features({ heading, subheading, variant, items }: FeaturesProps) {
  const list = items ?? []
  if (list.length === 0) return null

  return (
    <section className="section alt" id="features">
      <div className="container">
        {(heading || subheading) && (
          <div className="section-head center reveal">
            <span className="eyebrow center">Преимущества</span>
            {heading && <h2>{heading}</h2>}
            {subheading && <p className="sub">{subheading}</p>}
          </div>
        )}

        {variant === 'tabs' ? (
          <FeaturesTabs items={list} />
        ) : (
          <div className="feat-grid reveal">
            {list.map((it, i) => (
              <div key={it.id ?? i} className="feat">
                {it.icon && (
                  <div className="ic-wrap" aria-hidden="true">
                    <span style={{ fontSize: 22 }}>{it.icon}</span>
                  </div>
                )}
                {variant === 'cards-metric' && it.metric && (
                  <div className="metric">{it.metric}</div>
                )}
                <h3>{it.title}</h3>
                {it.description && <p>{it.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function FeaturesTabs({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0)
  const current = items[active]
  return (
    <div className="feat-grid reveal" style={{ gridTemplateColumns: '1fr' }}>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          justifyContent: 'center',
          marginBottom: 32,
        }}
      >
        {items.map((it, i) => (
          <button
            key={it.id ?? i}
            type="button"
            className={i === active ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
            onClick={() => setActive(i)}
          >
            {it.icon && <span style={{ marginRight: 6 }}>{it.icon}</span>}
            {it.title}
          </button>
        ))}
      </div>
      {current && (
        <div className="feat" style={{ maxWidth: 720, marginInline: 'auto' }}>
          {current.metric && <div className="metric">{current.metric}</div>}
          <h3>{current.title}</h3>
          {current.description && <p>{current.description}</p>}
        </div>
      )}
    </div>
  )
}
