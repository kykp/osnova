import type { Metadata } from 'next'
import { headers as getHeaders } from 'next/headers.js'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import config from '@/payload.config'

type Params = Promise<{ slug: string }>

async function findPage(slug: string) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: await config })
  const result = await payload.find({
    collection: 'pages',
    limit: 1,
    where: { slug: { equals: slug } },
    overrideAccess: false,
    req: { headers } as never,
  })
  return result.docs[0] ?? null
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const page = await findPage(decodeURIComponent(slug))
  if (!page) return {}
  return { title: page.title }
}

export default async function PageRoute({ params }: { params: Params }) {
  const { slug } = await params
  const page = await findPage(decodeURIComponent(slug))
  if (!page) notFound()

  return <RenderBlocks blocks={page.layout} />
}
