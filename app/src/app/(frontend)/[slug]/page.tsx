import type { Metadata } from 'next'
import { draftMode, headers as getHeaders } from 'next/headers.js'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import type { Media } from '@/payload-types'
import config from '@/payload.config'
import { pickMediaSize } from '@/utils/mediaSize'

import { Breadcrumbs } from '../_components/Breadcrumbs/Breadcrumbs'

type Params = Promise<{ slug: string }>

async function findPage(slug: string) {
  const [headers, draft] = await Promise.all([getHeaders(), draftMode()])
  const payload = await getPayload({ config: await config })
  const result = await payload.find({
    collection: 'pages',
    limit: 1,
    where: { slug: { equals: slug } },
    draft: draft.isEnabled,
    overrideAccess: false,
    req: { headers } as never,
  })
  return result.docs[0] ?? null
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const page = await findPage(decodeURIComponent(slug))
  if (!page) return {}

  const title = page.meta?.title || page.title
  const description = page.meta?.description || undefined
  const ogMedia =
    typeof page.meta?.image === 'object' && page.meta.image !== null
      ? (page.meta.image as Media)
      : null
  const ogImage = pickMediaSize(ogMedia, 'og')

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

export default async function PageRoute({ params }: { params: Params }) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const page = await findPage(decodedSlug)
  if (!page) notFound()

  const [draft, payload] = await Promise.all([draftMode(), getPayload({ config: await config })])
  const settings = await payload.findGlobal({ slug: 'settings' })
  const homeId =
    typeof settings.homePage === 'object' && settings.homePage !== null
      ? settings.homePage.id
      : settings.homePage
  const isHome = homeId === page.id

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
          <a href={`/exit-preview?path=/${decodedSlug}`}>Выйти из предпросмотра</a>
        </div>
      ) : null}
      {!isHome ? (
        <Breadcrumbs
          items={[
            { label: 'Главная', href: '/' },
            { label: page.title },
          ]}
        />
      ) : null}
      <RenderBlocks blocks={page.layout} />
    </>
  )
}
