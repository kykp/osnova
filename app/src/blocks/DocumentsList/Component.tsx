import { getPayload } from 'payload'
import React from 'react'

import type { Document } from '@/payload-types'
import config from '@/payload.config'

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
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function extFromFilename(filename: string | null | undefined): string {
  if (!filename) return 'PDF'
  const m = filename.match(/\.([a-z0-9]+)$/i)
  return m ? m[1].toUpperCase() : 'PDF'
}

const DownloadIcon = () => (
  <span className="ic">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4v12M7 11l5 5 5-5" />
      <path d="M5 20h14" />
    </svg>
  </span>
)

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
    <section className="section alt" id="docs">
      <div className="container">
        {heading && (
          <div className="section-head center reveal">
            <span className="eyebrow center">Документы</span>
            <h2>{heading}</h2>
          </div>
        )}
        <div className="docs reveal" style={{ maxWidth: 820, marginInline: 'auto' }}>
          {docs.map((d) => {
            const sizeStr = formatBytes(d.filesize)
            const dateStr = formatDate(d.publishedAt)
            const meta = [sizeStr, dateStr && `обновлён ${dateStr}`].filter(Boolean).join(' · ')
            return (
              <a key={d.id} className="doc" href={d.url || '#'} download={d.filename || true}>
                <span className="fmt">{extFromFilename(d.filename)}</span>
                <span className="info">
                  <h3>{d.title}</h3>
                  {d.description && <span className="meta">{d.description}</span>}
                  {meta && <span className="meta">{meta}</span>}
                </span>
                <span className="dl">
                  <DownloadIcon />
                </span>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
