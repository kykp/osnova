import React from 'react'

import type { MainMenu, Page } from '@/payload-types'

import styles from './SiteHeader.module.css'

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
  menu,
}: {
  title: string
  logo: SiteHeaderLogo | null
  menu: MainMenu | null
}) {
  const items = menu?.items ?? []

  return (
    <header className={styles.root}>
      <div className={styles.inner}>
        <a href="/" className={styles.brand}>
          {logo ? (
            <img
              src={logo.url}
              alt={logo.alt || title}
              width={logo.width ?? undefined}
              height={logo.height ?? undefined}
              className={styles.logo}
            />
          ) : null}
          {title ? <span className={styles.brandTitle}>{title}</span> : null}
        </a>
        {items.length > 0 ? (
          <nav className={styles.nav} aria-label="Главное меню">
            <ul className={styles.list}>
              {items.map((item) => {
                const href = resolveHref(item)
                const children = item.children ?? []
                return (
                  <li key={item.id} className={styles.item}>
                    {href ? (
                      <a className={styles.link} href={href}>
                        {item.label}
                      </a>
                    ) : (
                      <span className={styles.link}>{item.label}</span>
                    )}
                    {children.length > 0 ? (
                      <ul className={styles.submenu}>
                        {children.map((sub) => {
                          const subHref = resolveHref(sub)
                          if (!subHref) return null
                          return (
                            <li key={sub.id}>
                              <a className={styles.subLink} href={subHref}>
                                {sub.label}
                              </a>
                            </li>
                          )
                        })}
                      </ul>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </nav>
        ) : null}
      </div>
    </header>
  )
}
