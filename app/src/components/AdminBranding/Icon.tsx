import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

import styles from './AdminBranding.module.css'

export const Icon = async () => {
  const payload = await getPayload({ config: await config })
  const settings = await payload.findGlobal({ slug: 'settings', depth: 1 })

  const icon = settings.siteIcon
  if (!icon || typeof icon !== 'object') return null

  const url =
    (icon.sizes && icon.sizes.thumbnail && icon.sizes.thumbnail.url) || icon.url
  if (typeof url !== 'string') return null

  return (
    <img
      className={styles.icon}
      src={url}
      alt={icon.alt || settings.siteTitle || ''}
    />
  )
}
