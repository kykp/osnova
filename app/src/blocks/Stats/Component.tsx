import React from 'react'

import styles from './Component.module.css'

type Item = { id?: string | null; value: string; label: string }

type StatsProps = {
  heading?: string | null
  subheading?: string | null
  items?: Item[] | null
}

export function Stats({ heading, subheading, items }: StatsProps) {
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
      <ul className={styles.grid} data-count={list.length}>
        {list.map((it, i) => (
          <li key={it.id ?? i} className={styles.item}>
            <div className={styles.value}>{it.value}</div>
            <div className={styles.label}>{it.label}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}
