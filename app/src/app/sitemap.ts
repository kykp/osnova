import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'

import config from '@/payload.config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')
  const payload = await getPayload({ config: await config })

  const [settings, pages] = await Promise.all([
    payload.findGlobal({ slug: 'settings' }),
    payload.find({
      collection: 'pages',
      where: { _status: { equals: 'published' } },
      limit: 1000,
      depth: 0,
      pagination: false,
    }),
  ])

  const homeId =
    typeof settings.homePage === 'object' && settings.homePage !== null
      ? settings.homePage.id
      : settings.homePage

  const items: MetadataRoute.Sitemap = []

  const homeDoc = homeId ? pages.docs.find((d) => d.id === homeId) : null
  if (homeDoc) {
    items.push({
      url: `${baseUrl}/`,
      lastModified: new Date(homeDoc.updatedAt),
      changeFrequency: 'weekly',
    })
  }

  for (const page of pages.docs) {
    if (homeId && page.id === homeId) continue
    if (!page.slug) continue
    items.push({
      url: `${baseUrl}/${page.slug}`,
      lastModified: new Date(page.updatedAt),
      changeFrequency: 'weekly',
    })
  }

  return items
}
