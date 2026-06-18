import type { Metadata } from 'next'
import { draftMode, headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import type { Media, Page } from '@/payload-types'
import config from '@/payload.config'
import { pickMediaSize } from '@/utils/mediaSize'

import styles from './page.module.css'

async function loadHomePage(): Promise<Page | null> {
  const payload = await getPayload({ config: await config })
  const settings = await payload.findGlobal({ slug: 'settings' })
  const homeRef = settings.homePage
  if (!homeRef) return null

  const id = typeof homeRef === 'object' ? homeRef.id : homeRef
  if (!id) return null

  const [headers, draft] = await Promise.all([getHeaders(), draftMode()])
  try {
    const doc = await payload.findByID({
      collection: 'pages',
      id,
      draft: draft.isEnabled,
      overrideAccess: false,
      req: { headers } as never,
    })
    return doc
  } catch {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const home = await loadHomePage()
  if (!home) return {}

  const ogMedia =
    typeof home.meta?.image === 'object' && home.meta.image !== null
      ? (home.meta.image as Media)
      : null
  const ogImage = pickMediaSize(ogMedia, 'og')

  const title = home.meta?.title || home.title
  const description = home.meta?.description || undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage.url, width: ogImage.width, height: ogImage.height }] : undefined,
    },
  }
}

export default async function HomePage() {
  const home = await loadHomePage()
  const draft = await draftMode()

  if (home) {
    return (
      <>
        {draft.isEnabled ? (
          <div
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 100,
              padding: '8px 16px',
              background: '#fef3c7',
              color: '#78350f',
              fontSize: 14,
              textAlign: 'center',
            }}
          >
            Режим предпросмотра черновика.{' '}
            <a href="/exit-preview?path=/">Выйти из предпросмотра</a>
          </div>
        ) : null}
        <RenderBlocks blocks={home.layout} />
      </>
    )
  }

  return <FirstRunScreen />
}

async function FirstRunScreen() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: await config })
  const [{ user }, settings] = await Promise.all([
    payload.auth({ headers }),
    payload.findGlobal({ slug: 'settings' }),
  ])

  const title = settings.siteTitle || 'Osnova'

  return (
    <main className={styles.root}>
      <section className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.lead}>
          {user && 'email' in user
            ? `Здравствуйте, ${user.email}. Выберите главную страницу в Настройках → Основное.`
            : 'Платформа установлена. Войдите в админку и выберите главную страницу в настройках сайта.'}
        </p>
        <div className={styles.actions}>
          <a className={styles.primary} href="/admin">
            Войти в админку
          </a>
        </div>
      </section>
    </main>
  )
}
