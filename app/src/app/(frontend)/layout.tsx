import type { Metadata } from 'next'
import { Cormorant, Inter } from 'next/font/google'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

import { BackToTop } from './_components/BackToTop/BackToTop'
import { RevealOnScroll } from './_components/RevealOnScroll/RevealOnScroll'
import { SiteFooter } from './_components/SiteFooter/SiteFooter'
import { SiteHeader, type SiteHeaderLogo } from './_components/SiteHeader/SiteHeader'

import './globals.css'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const cormorant = Cormorant({
  subsets: ['latin', 'cyrillic'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

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

  const toLogo = (media: unknown): SiteHeaderLogo | null =>
    media && typeof media === 'object' && 'url' in media && typeof media.url === 'string'
      ? {
          url: media.url,
          alt: ('alt' in media && typeof media.alt === 'string' && media.alt) ||
            settings.siteTitle || '',
          width: 'width' in media && typeof media.width === 'number' ? media.width : null,
          height: 'height' in media && typeof media.height === 'number' ? media.height : null,
        }
      : null

  const logo = toLogo(settings.logo)
  const logoDark = toLogo(settings.logoDark)

  return (
    <html lang="ru" className={`${inter.variable} ${cormorant.variable}`}>
      <body>
        <SiteHeader
          title={settings.siteTitle || ''}
          logo={logo}
          logoDark={logoDark}
          menu={menu}
        />
        <main id="top">{children}</main>
        <SiteFooter settings={settings} menu={menu} />
        <RevealOnScroll />
        <BackToTop />
      </body>
    </html>
  )
}
