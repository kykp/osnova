import { getPayload } from 'payload'
import React from 'react'

import type { Document } from '@/payload-types'
import config from '@/payload.config'

import styles from './Component.module.css'

type DocumentsListProps = {
  heading?: string | null
  limit?: number | null
}

function formatBytes(bytes: number | null | undefined): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} Б`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} КБ`
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function extFromFilename(filename: string | null | undefined): string {
  if (!filename) return ''
  const m = filename.match(/\.([a-z0-9]+)$/i)
  return m ? m[1].toUpperCase() : ''
}

export async function DocumentsList({ heading, limit }: DocumentsListProps) {
  const payload = await getPayload({ config: await config })
  const result = await payload.find({
    collection: 'documents',
    sort: '-publishedAt',
    limit: limit && limit > 0 ? limit : 100,
  })

  const docs = result.docs as Document[]
  if (docs.length === 0) return null

  return (
    <section className={styles.root}>
      {heading && <h2 className={styles.heading}>{heading}</h2>}
      <ul className={styles.list}>
        {docs.map((d) => (
          <li key={d.id} className={styles.item}>
            <a className={styles.link} href={d.url || '#'} download={d.filename || true}>
              <div className={styles.icon}>{extFromFilename(d.filename) || '📄'}</div>
              <div className={styles.body}>
                <div className={styles.title}>{d.title}</div>
                {d.description && <div className={styles.desc}>{d.description}</div>}
                <div className={styles.meta}>
                  {d.publishedAt && <span>{formatDate(d.publishedAt)}</span>}
                  {d.filesize ? <span>{formatBytes(d.filesize)}</span> : null}
                </div>
              </div>
              <div className={styles.action}>Скачать</div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
