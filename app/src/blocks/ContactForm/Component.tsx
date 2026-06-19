'use client'

import React, { useState } from 'react'

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

const ArrowIcon = () => (
  <span className="ic">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  </span>
)

const CheckIcon = () => (
  <span className="ic">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  </span>
)

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

  return (
    <section className="section alt" id="form">
      <div className="container">
        <div className="form-wrap reveal">
          <div className="form-aside">
            <span className="eyebrow">Заявка</span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 'clamp(28px,3.6vw,42px)',
                color: 'var(--ink)',
                lineHeight: 1.08,
                margin: '16px 0 14px',
              }}
            >
              {heading}
            </h2>
            {description && (
              <p
                style={{
                  color: 'var(--muted)',
                  fontSize: '16px',
                  lineHeight: 1.6,
                  marginBottom: '24px',
                }}
              >
                {description}
              </p>
            )}
          </div>

          {status === 'success' ? (
            <div className="form-card" style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                  color: '#fff',
                  fontSize: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '8px auto 18px',
                }}
              >
                <CheckIcon />
              </div>
              <p style={{ fontSize: 17, color: 'var(--ink)' }}>{successMessage}</p>
            </div>
          ) : (
            <form className="form-card" onSubmit={onSubmit} noValidate>
              <div className="frow two">
                <div className="field">
                  <label>
                    Имя <span className="req">*</span>
                  </label>
                  <input
                    className="ctrl"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    disabled={status === 'sending'}
                    placeholder="Как к вам обращаться"
                  />
                </div>
                <div className="field">
                  <label>
                    Телефон <span className="req">*</span>
                  </label>
                  <input
                    className="ctrl"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    disabled={status === 'sending'}
                    placeholder="+7 ___ ___-__-__"
                  />
                </div>
              </div>
              <div className="frow" style={{ marginTop: 18 }}>
                <div className="field">
                  <label>E-mail</label>
                  <input
                    className="ctrl"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    disabled={status === 'sending'}
                    placeholder="you@company.ru"
                  />
                </div>
              </div>
              {showMessageField !== false && (
                <div className="frow" style={{ marginTop: 18 }}>
                  <div className="field">
                    <label>Сообщение</label>
                    <textarea
                      className="ctrl"
                      name="message"
                      rows={4}
                      disabled={status === 'sending'}
                      placeholder="Расскажите о задаче"
                    />
                  </div>
                </div>
              )}
              <label className="consent">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  disabled={status === 'sending'}
                />
                <span className="box">
                  <CheckIcon />
                </span>
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
              {error && (
                <div
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(224,83,58,.06)',
                    border: '1px solid rgba(224,83,58,.3)',
                    borderRadius: 'var(--r-sm)',
                    color: '#E0533A',
                    fontSize: 14,
                    marginTop: 16,
                  }}
                >
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Отправка…' : submitLabel || 'Отправить'}
                {status !== 'sending' && <ArrowIcon />}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
