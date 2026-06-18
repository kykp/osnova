import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

import styles from './Component.module.css'

type ContactsProps = {
  heading?: string | null
  address?: string | null
  mapProvider?: 'yandex' | 'google' | 'none' | null
  mapZoom?: number | null
  showSettingsContacts?: boolean | null
  overrideEmail?: string | null
  overridePhone?: string | null
  workingHours?: string | null
}

function mapEmbedUrl(
  provider: 'yandex' | 'google',
  address: string,
  zoom: number,
): string {
  const q = encodeURIComponent(address)
  if (provider === 'yandex') {
    return `https://yandex.ru/map-widget/v1/?text=${q}&z=${zoom}`
  }
  return `https://www.google.com/maps?q=${q}&z=${zoom}&output=embed`
}

export async function Contacts({
  heading,
  address,
  mapProvider,
  mapZoom,
  showSettingsContacts,
  overrideEmail,
  overridePhone,
  workingHours,
}: ContactsProps) {
  let email = overrideEmail || null
  let phone = overridePhone || null

  if (showSettingsContacts !== false) {
    const payload = await getPayload({ config: await config })
    const settings = await payload.findGlobal({ slug: 'settings' })
    email = settings.contactEmail || null
    phone = settings.contactPhone || null
  }

  const showMap = mapProvider && mapProvider !== 'none' && address
  const mapUrl = showMap
    ? mapEmbedUrl(mapProvider as 'yandex' | 'google', address!, mapZoom || 15)
    : null

  return (
    <section className={styles.root}>
      {heading && <h2 className={styles.heading}>{heading}</h2>}
      <div className={styles.grid}>
        <div className={styles.info}>
          {address && (
            <div className={styles.row}>
              <span className={styles.rowLabel}>Адрес</span>
              <span className={styles.rowValue}>{address}</span>
            </div>
          )}
          {phone && (
            <div className={styles.row}>
              <span className={styles.rowLabel}>Телефон</span>
              <a href={`tel:${phone.replace(/\s+/g, '')}`} className={styles.rowValueLink}>
                {phone}
              </a>
            </div>
          )}
          {email && (
            <div className={styles.row}>
              <span className={styles.rowLabel}>E-mail</span>
              <a href={`mailto:${email}`} className={styles.rowValueLink}>
                {email}
              </a>
            </div>
          )}
          {workingHours && (
            <div className={styles.row}>
              <span className={styles.rowLabel}>Часы работы</span>
              <span className={styles.rowValue}>{workingHours}</span>
            </div>
          )}
        </div>
        {mapUrl && (
          <div className={styles.mapWrap}>
            <iframe
              className={styles.map}
              src={mapUrl}
              title={`Карта: ${address}`}
              loading="lazy"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </section>
  )
}
