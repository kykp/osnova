import React from 'react'

import styles from './Component.module.css'

type Step = {
  id?: string | null
  title: string
  description?: string | null
  icon?: string | null
}

type ProcessProps = {
  heading?: string | null
  subheading?: string | null
  variant: 'horizontal' | 'vertical'
  steps?: Step[] | null
}

export function Process({ heading, subheading, variant, steps }: ProcessProps) {
  const list = steps ?? []
  if (list.length === 0) return null

  return (
    <section className={styles.root}>
      {(heading || subheading) && (
        <header className={styles.header}>
          {heading && <h2 className={styles.heading}>{heading}</h2>}
          {subheading && <p className={styles.subheading}>{subheading}</p>}
        </header>
      )}
      <ol className={variant === 'vertical' ? styles.vertical : styles.horizontal}>
        {list.map((s, i) => (
          <li key={s.id ?? i} className={styles.step}>
            <div className={styles.badge}>{s.icon || i + 1}</div>
            <div className={styles.stepBody}>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              {s.description && <p className={styles.stepDesc}>{s.description}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
