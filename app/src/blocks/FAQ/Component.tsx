import React from 'react'

import styles from './Component.module.css'

type Item = { id?: string | null; question: string; answer: string }

type FAQProps = {
  heading?: string | null
  items?: Item[] | null
}

export function FAQ({ heading, items }: FAQProps) {
  const list = items ?? []
  if (list.length === 0) return null

  return (
    <section className={styles.root}>
      {heading && <h2 className={styles.heading}>{heading}</h2>}
      <div className={styles.list}>
        {list.map((it, i) => (
          <details key={it.id ?? i} className={styles.item}>
            <summary className={styles.question}>{it.question}</summary>
            <div className={styles.answer}>{it.answer}</div>
          </details>
        ))}
      </div>
    </section>
  )
}
