import React from 'react'

import type { MainMenu, Page, Setting } from '@/payload-types'

type MenuItem = NonNullable<MainMenu['items']>[number]

function resolveHref(item: MenuItem): string | null {
  if (item.target === 'url') return item.url || null
  if (item.target === 'page' && typeof item.page === 'object' && item.page !== null) {
    const slug = (item.page as Page).slug
    return slug ? `/${slug}` : null
  }
  return null
}

export function SiteFooter({
  settings,
  menu,
}: {
  settings: Setting
  menu: MainMenu | null
}) {
  const items = menu?.items ?? []
  const year = new Date().getFullYear()
  const phone = settings.contactPhone || null
  const email = settings.contactEmail || null
  const title = settings.siteTitle || 'Osnova'

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <a className="brand" href="/" aria-label={title}>
              <span className="logo" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
                </svg>
              </span>
              <span>
                <b>{title}</b>
              </span>
            </a>
            {settings.siteDescription && (
              <p className="footer-about">{settings.siteDescription}</p>
            )}
          </div>

          {items.length > 0 && (
            <div className="footer-col">
              <h5>Меню сайта</h5>
              {items.map((item) => {
                const href = resolveHref(item)
                return href ? (
                  <a key={item.id} href={href}>
                    {item.label}
                  </a>
                ) : (
                  <span key={item.id}>{item.label}</span>
                )
              })}
            </div>
          )}

          {(phone || email) && (
            <div className="footer-col">
              <h5>Контакты</h5>
              {phone && <a href={`tel:${phone.replace(/\s+/g, '')}`}>{phone}</a>}
              {email && <a href={`mailto:${email}`}>{email}</a>}
            </div>
          )}
        </div>

        <div className="footer-bottom">
          <span>
            © {year} {title}
          </span>
          <span className="sp">
            Собрано на{' '}
            <b style={{ color: 'var(--accent-ink)' }}>Osnova</b>
          </span>
        </div>
      </div>
    </footer>
  )
}
