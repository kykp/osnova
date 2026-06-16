import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import styles from './page.module.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: await config })
  const [{ user }, settings, pages] = await Promise.all([
    payload.auth({ headers }),
    payload.findGlobal({ slug: 'settings' }),
    payload.find({
      collection: 'pages',
      limit: 20,
      sort: '-updatedAt',
      overrideAccess: false,
      req: { headers } as never,
    }),
  ])

  const title = settings.siteTitle || 'Osnova'
  const description = settings.siteDescription

  return (
    <main className={styles.root}>
      <section className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        {description ? (
          <p className={styles.lead}>{description}</p>
        ) : (
          <p className={styles.lead}>
            {user && 'email' in user
              ? `Здравствуйте, ${user.email}. Заполните настройки сайта в админке.`
              : 'Платформа установлена. Заполните настройки сайта в админке.'}
          </p>
        )}

        {pages.docs.length > 0 ? (
          <nav className={styles.pages} aria-label="Страницы сайта">
            <h2 className={styles.pagesTitle}>Страницы</h2>
            <ul className={styles.pagesList}>
              {pages.docs.map((page) => (
                <li key={page.id}>
                  <a href={`/${page.slug}`}>{page.title}</a>
                  {page.status === 'draft' ? (
                    <span className={styles.draft}>черновик</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <div className={styles.actions}>
          <a className={styles.primary} href="/admin">
            Войти в админку
          </a>
        </div>
      </section>
    </main>
  )
}
