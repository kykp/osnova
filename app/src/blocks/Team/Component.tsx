import { getPayload } from 'payload'
import React from 'react'

import type { Media, Staff } from '@/payload-types'
import config from '@/payload.config'
import { pickMediaSize } from '@/utils/mediaSize'

type TeamProps = {
  heading?: string | null
  subheading?: string | null
  limit?: number | null
}

export async function Team({ heading, subheading, limit }: TeamProps) {
  const payload = await getPayload({ config: await config })
  const result = await payload.find({
    collection: 'staff',
    sort: 'sortOrder',
    limit: limit && limit > 0 ? limit : 100,
    depth: 1,
  })

  const people = result.docs as Staff[]
  if (people.length === 0) return null

  return (
    <section className="section" id="team">
      <div className="container">
        {(heading || subheading) && (
          <div className="section-head center reveal">
            <span className="eyebrow center">Команда</span>
            {heading && <h2>{heading}</h2>}
            {subheading && <p className="sub">{subheading}</p>}
          </div>
        )}
        <div className="team reveal">
          {people.map((p) => {
            const photo =
              p.photo && typeof p.photo === 'object'
                ? pickMediaSize(p.photo as Media, 'card')
                : null
            const name = [p.lastName, p.firstName].filter(Boolean).join(' ')
            return (
              <div key={p.id} className="member">
                <div
                  className="photo"
                  style={
                    photo
                      ? {
                          backgroundImage: `url(${photo.url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }
                      : { background: 'var(--accent-soft)' }
                  }
                  aria-label={name}
                />
                <h3>{name}</h3>
                <div className="role">{p.position}</div>
                {p.bio && <p>{p.bio}</p>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
