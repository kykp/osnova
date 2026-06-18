'use client'

import React, { useState } from 'react'

import styles from './Component.module.css'

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
    <section className={styles.root}>
      {(heading || subheading) && (
        <header className={styles.header}>
          {heading && <h2 className={styles.heading}>{heading}</h2>}
          {subheading && <p className={styles.subheading}>{subheading}</p>}
        </header>
      )}

      {variant === 'icons-grid' && (
        <ul className={styles.iconsGrid}>
          {list.map((it, i) => (
            <li key={it.id ?? i} className={styles.iconCard}>
              {it.icon && <div className={styles.icon}>{it.icon}</div>}
              <h3 className={styles.itemTitle}>{it.title}</h3>
              {it.description && <p className={styles.itemDesc}>{it.description}</p>}
            </li>
          ))}
        </ul>
      )}

      {variant === 'cards-metric' && (
        <ul className={styles.metricGrid}>
          {list.map((it, i) => (
            <li key={it.id ?? i} className={styles.metricCard}>
              {it.metric && <div className={styles.metric}>{it.metric}</div>}
              <h3 className={styles.itemTitle}>{it.title}</h3>
              {it.description && <p className={styles.itemDesc}>{it.description}</p>}
            </li>
          ))}
        </ul>
      )}

      {variant === 'tabs' && <FeaturesTabs items={list} />}
    </section>
  )
}

function FeaturesTabs({ items }: { items: Item[] }) {
  const [active, setActive] = useState(0)
  const current = items[active]
  return (
    <div className={styles.tabs}>
      <div className={styles.tabsList} role="tablist">
        {items.map((it, i) => (
          <button
            key={it.id ?? i}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={i === active ? styles.tabActive : styles.tab}
            onClick={() => setActive(i)}
          >
            {it.icon && <span className={styles.tabIcon}>{it.icon}</span>}
            <span>{it.title}</span>
          </button>
        ))}
      </div>
      {current && (
        <div className={styles.tabPanel} role="tabpanel">
          <h3 className={styles.itemTitle}>{current.title}</h3>
          {current.description && <p className={styles.itemDesc}>{current.description}</p>}
        </div>
      )}
    </div>
  )
}
