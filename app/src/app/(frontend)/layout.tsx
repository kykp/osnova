import type { Metadata } from 'next'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: await config })
  const settings = await payload.findGlobal({ slug: 'settings' })

  return {
    title: settings.siteTitle || 'Osnova',
    description: settings.siteDescription || undefined,
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
