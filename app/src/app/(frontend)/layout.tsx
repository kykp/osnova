import type { Metadata } from 'next'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

import { SiteHeader, type SiteHeaderLogo } from './_components/SiteHeader/SiteHeader'

import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: await config })
  const settings = await payload.findGlobal({ slug: 'settings', depth: 1 })

  const icon = settings.siteIcon
  const iconUrl =
    icon && typeof icon === 'object' && typeof icon.url === 'string' ? icon.url : undefined

  return {
    title: settings.siteTitle || 'Osnova',
    description: settings.siteDescription || undefined,
    icons: iconUrl ? { icon: iconUrl } : undefined,
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config: await config })
  const [settings, menu] = await Promise.all([
    payload.findGlobal({ slug: 'settings', depth: 1 }),
    payload.findGlobal({ slug: 'main-menu' }),
  ])

  const logoMedia = settings.logo
  const logo: SiteHeaderLogo | null =
    logoMedia && typeof logoMedia === 'object' && typeof logoMedia.url === 'string'
      ? {
          url: logoMedia.url,
          alt: logoMedia.alt || settings.siteTitle || '',
          width: logoMedia.width,
          height: logoMedia.height,
        }
      : null

  return (
    <html lang="ru">
      <body>
        <SiteHeader title={settings.siteTitle || ''} logo={logo} menu={menu} />
        {children}
      </body>
    </html>
  )
}
