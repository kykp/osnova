import React from 'react'

import type { MainMenu, Page } from '@/payload-types'

import { MobileMenu, type MobileMenuItem } from '../MobileMenu/MobileMenu'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle'

type MenuItem = NonNullable<MainMenu['items']>[number]
type SubItem = NonNullable<MenuItem['children']>[number]

export type SiteHeaderLogo = {
  url: string
  alt: string
  width?: number | null
  height?: number | null
}

function resolveHref(item: MenuItem | SubItem): string | null {
  if (item.target === 'url') return item.url || null
  if (item.target === 'page' && typeof item.page === 'object' && item.page !== null) {
    const slug = (item.page as Page).slug
    return slug ? `/${slug}` : null
  }
  return null
}

export function SiteHeader({
  title,
  logo,
  logoDark,
  menu,
}: {
  title: string
  logo: SiteHeaderLogo | null
  logoDark: SiteHeaderLogo | null
  menu: MainMenu | null
}) {
  const items = menu?.items ?? []

  const mobileItems: MobileMenuItem[] = items.map((item) => ({
    label: item.label,
    href: resolveHref(item),
  }))

  const hasBoth = Boolean(logo && logoDark)
  const renderLogo = (img: SiteHeaderLogo, variant: 'light' | 'dark' | null) => (
    <img
      src={img.url}
      alt={img.alt || title}
      width={img.width ?? undefined}
      height={img.height ?? undefined}
      className={variant ? `brand-logo brand-logo--${variant}` : 'brand-logo'}
    />
  )

  return (
    <header className="nav">
      <div className="container nav-in">
        <a className="brand" href="/" aria-label={title || 'Главная'}>
          {logo || logoDark ? (
            <>
              {logo && renderLogo(logo, hasBoth ? 'light' : null)}
              {logoDark && renderLogo(logoDark, hasBoth ? 'dark' : null)}
            </>
          ) : (
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
          )}
          {!logo && !logoDark && title ? (
            <span>
              <b>{title}</b>
            </span>
          ) : null}
        </a>

        {items.length > 0 ? (
          <nav className="nav-links" aria-label="Главное меню">
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
          </nav>
        ) : null}

        <div className="nav-r">
          <ThemeToggle />
          {mobileItems.length > 0 && <MobileMenu items={mobileItems} />}
        </div>
      </div>
    </header>
  )
}
