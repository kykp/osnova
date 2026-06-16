import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import styles from './page.module.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: await config })
  const { user } = await payload.auth({ headers })

  return (
    <main className={styles.root}>
      <section className={styles.content}>
        <h1 className={styles.title}>Osnova</h1>
        <p className={styles.lead}>
          {user && 'email' in user
            ? `Здравствуйте, ${user.email}. Сайт работает.`
            : 'Платформа установлена. Сайт ещё пустой — наполните его в админке.'}
        </p>
        <div className={styles.actions}>
          <a className={styles.primary} href="/admin">
            Войти в админку
          </a>
        </div>
      </section>
    </main>
  )
}
