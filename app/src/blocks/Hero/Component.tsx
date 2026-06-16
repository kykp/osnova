import React from 'react'

import type { Page } from '@/payload-types'

import styles from './Component.module.css'

type HeroProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'hero' }>

export function Hero({ heading, subheading, cta }: HeroProps) {
  return (
    <section className={styles.root}>
      <div className={styles.inner}>
        <h1 className={styles.heading}>{heading}</h1>
        {subheading ? <p className={styles.subheading}>{subheading}</p> : null}
        {cta?.label && cta?.url ? (
          <a className={styles.cta} href={cta.url}>
            {cta.label}
          </a>
        ) : null}
      </div>
    </section>
  )
}
