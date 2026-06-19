import React from 'react'

import type { Media } from '@/payload-types'
import { pickMediaSize } from '@/utils/mediaSize'

type CTAProps = {
  heading: string
  subheading?: string | null
  button?: { label?: string | null; url?: string | null } | null
  background?: Media | number | null
}

export function CTA({ heading, subheading, button, background }: CTAProps) {
  const bg = typeof background === 'object' ? pickMediaSize(background, 'feature') : null

  return (
    <section className="section tight">
      <div className="container">
        <div
          className="cta-band reveal"
          style={
            bg
              ? {
                  backgroundImage: `linear-gradient(120deg, rgba(12,19,32,.78), rgba(26,39,64,.78)), url(${bg.url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : undefined
          }
        >
          <div className="in">
            <span className="eyebrow">Готовы лететь?</span>
            <h2>{heading}</h2>
            {subheading && <p>{subheading}</p>}
            {button?.label && button.url && (
              <div className="cta">
                <a className="btn btn-primary btn-lg" href={button.url}>
                  {button.label}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
