import React from 'react'

import type { Media } from '@/payload-types'
import { pickMediaSize } from '@/utils/mediaSize'

import styles from './Component.module.css'

type CTAProps = {
  heading: string
  subheading?: string | null
  button?: { label?: string | null; url?: string | null } | null
  background?: Media | number | null
}

export function CTA({ heading, subheading, button, background }: CTAProps) {
  const bg = typeof background === 'object' ? pickMediaSize(background, 'feature') : null
  const hasBg = Boolean(bg)

  return (
    <section className={hasBg ? styles.withBg : styles.plain}>
      {hasBg && (
        <div className={styles.bgWrap} aria-hidden="true">
          <img className={styles.bg} src={bg!.url} alt="" />
          <div className={styles.bgOverlay} />
        </div>
      )}
      <div className={styles.inner}>
        <h2 className={styles.heading}>{heading}</h2>
        {subheading && <p className={styles.subheading}>{subheading}</p>}
        {button?.label && button.url && (
          <a className={styles.button} href={button.url}>
            {button.label}
          </a>
        )}
      </div>
    </section>
  )
}
