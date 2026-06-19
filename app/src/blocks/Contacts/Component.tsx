import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'

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

const PinIcon = () => (
  <span className="ic">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  </span>
)
const ClockIcon = () => (
  <span className="ic">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  </span>
)
const PhoneIcon = () => (
  <span className="ic">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M4 5l4-1 2 5-3 2a14 14 0 0 0 6 6l2-3 5 2-1 4a2 2 0 0 1-2 2A18 18 0 0 1 2 7a2 2 0 0 1 2-2z" />
    </svg>
  </span>
)
const MailIcon = () => (
  <span className="ic">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  </span>
)

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
    <section className="section" id="contacts">
      <div className="container">
        {heading && (
          <div className="section-head reveal">
            <span className="eyebrow">Контакты</span>
            <h2>{heading}</h2>
          </div>
        )}
        <div className="contact reveal">
          <div className="contact-info">
            {address && (
              <div className="ci">
                <span className="ic-wrap">
                  <PinIcon />
                </span>
                <span>
                  <div className="k">Адрес</div>
                  <div className="v">{address}</div>
                </span>
              </div>
            )}
            {workingHours && (
              <div className="ci">
                <span className="ic-wrap">
                  <ClockIcon />
                </span>
                <span>
                  <div className="k">Режим работы</div>
                  <div className="v" style={{ whiteSpace: 'pre-wrap' }}>
                    {workingHours}
                  </div>
                </span>
              </div>
            )}
            {phone && (
              <div className="ci">
                <span className="ic-wrap">
                  <PhoneIcon />
                </span>
                <span>
                  <div className="k">Телефон</div>
                  <div className="v lg">
                    <a href={`tel:${phone.replace(/\s+/g, '')}`}>{phone}</a>
                  </div>
                </span>
              </div>
            )}
            {email && (
              <div className="ci">
                <span className="ic-wrap">
                  <MailIcon />
                </span>
                <span>
                  <div className="k">E-mail</div>
                  <div className="v">
                    <a href={`mailto:${email}`}>{email}</a>
                  </div>
                </span>
              </div>
            )}
          </div>
          {mapUrl && (
            <div className="map">
              <div className="provider">
                <span className="ic" style={{ width: 14, height: 14, color: 'var(--accent-ink)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                </span>
                {mapProvider === 'yandex' ? 'Яндекс Карты' : 'Google Maps'}
              </div>
              <iframe
                src={mapUrl}
                title={`Карта: ${address}`}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                loading="lazy"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
