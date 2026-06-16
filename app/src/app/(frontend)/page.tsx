import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import styles from './page.module.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: await config })
  const [{ user }, settings] = await Promise.all([
    payload.auth({ headers }),
    payload.findGlobal({ slug: 'settings' }),
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
        <div className={styles.actions}>
          <a className={styles.primary} href="/admin">
            Войти в админку
          </a>
        </div>
      </section>
    </main>
  )
}
