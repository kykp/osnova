import { getPayload } from 'payload'
import React from 'react'

import type { Media, Staff } from '@/payload-types'
import config from '@/payload.config'
import { pickMediaSize } from '@/utils/mediaSize'

import styles from './Component.module.css'

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
    <section className={styles.root}>
      {(heading || subheading) && (
        <header className={styles.header}>
          {heading && <h2 className={styles.heading}>{heading}</h2>}
          {subheading && <p className={styles.subheading}>{subheading}</p>}
        </header>
      )}
      <ul className={styles.grid}>
        {people.map((p) => {
          const photo =
            p.photo && typeof p.photo === 'object'
              ? pickMediaSize(p.photo as Media, 'card')
              : null
          const name = [p.lastName, p.firstName, p.middleName].filter(Boolean).join(' ')
          return (
            <li key={p.id} className={styles.card}>
              {photo && <img src={photo.url} alt={name} className={styles.photo} />}
              <div className={styles.body}>
                <div className={styles.name}>{name}</div>
                <div className={styles.position}>{p.position}</div>
                {p.bio && <p className={styles.bio}>{p.bio}</p>}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
