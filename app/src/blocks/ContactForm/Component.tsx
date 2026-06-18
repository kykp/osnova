'use client'

import React, { useState } from 'react'

import styles from './Component.module.css'

type ContactFormProps = {
  heading?: string | null
  description?: string | null
  showMessageField?: boolean | null
  submitLabel?: string | null
  successMessage?: string | null
  consentText?: string | null
  consentPolicyUrl?: string | null
}

type Status = 'idle' | 'sending' | 'success' | 'error'

export function ContactForm({
  heading,
  description,
  showMessageField,
  submitLabel,
  successMessage,
  consentText,
  consentPolicyUrl,
}: ContactFormProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [consent, setConsent] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!consent) {
      setError('Нужно согласие на обработку персональных данных.')
      return
    }
    setStatus('sending')
    setError(null)
    const formData = new FormData(e.currentTarget)
    const payload = {
      name: String(formData.get('name') || ''),
      phone: String(formData.get('phone') || ''),
      email: String(formData.get('email') || ''),
      message: String(formData.get('message') || ''),
      source: typeof window !== 'undefined' ? window.location.pathname : '',
    }
    try {
      const res = await fetch('/api/form-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json?.error || 'Не удалось отправить заявку.')
      }
      setStatus('success')
      e.currentTarget.reset()
      setConsent(false)
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Не удалось отправить заявку.')
    }
  }

  if (status === 'success') {
    return (
      <section className={styles.root}>
        <div className={styles.successBox}>
          <div className={styles.successIcon}>✓</div>
          <p className={styles.successText}>{successMessage}</p>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.root}>
      <header className={styles.header}>
        {heading && <h2 className={styles.heading}>{heading}</h2>}
        {description && <p className={styles.description}>{description}</p>}
      </header>
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <label className={styles.field}>
          <span className={styles.label}>Имя *</span>
          <input
            className={styles.input}
            name="name"
            type="text"
            required
            autoComplete="name"
            disabled={status === 'sending'}
          />
        </label>

        <div className={styles.row}>
          <label className={styles.field}>
            <span className={styles.label}>Телефон</span>
            <input
              className={styles.input}
              name="phone"
              type="tel"
              autoComplete="tel"
              disabled={status === 'sending'}
              placeholder="+7 (___) ___-__-__"
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>E-mail</span>
            <input
              className={styles.input}
              name="email"
              type="email"
              autoComplete="email"
              disabled={status === 'sending'}
            />
          </label>
        </div>

        {showMessageField !== false && (
          <label className={styles.field}>
            <span className={styles.label}>Сообщение</span>
            <textarea
              className={styles.textarea}
              name="message"
              rows={4}
              disabled={status === 'sending'}
            />
          </label>
        )}

        <label className={styles.consent}>
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            disabled={status === 'sending'}
          />
          <span>
            {consentText}
            {consentPolicyUrl && (
              <>
                {' '}
                <a href={consentPolicyUrl} target="_blank" rel="noopener noreferrer">
                  (политика)
                </a>
              </>
            )}
          </span>
        </label>

        {error && <div className={styles.error}>{error}</div>}

        <button type="submit" className={styles.button} disabled={status === 'sending'}>
          {status === 'sending' ? 'Отправка…' : submitLabel || 'Отправить'}
        </button>
      </form>
    </section>
  )
}
