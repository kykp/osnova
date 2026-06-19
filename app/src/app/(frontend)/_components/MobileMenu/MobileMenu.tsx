'use client'

import React, { useEffect, useState } from 'react'

export type MobileMenuItem = { label: string; href: string | null }

export function MobileMenu({ items }: { items: MobileMenuItem[] }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (items.length === 0) return null

  return (
    <>
      <button
        type="button"
        className="burger"
        aria-label="Открыть меню"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span className="ic">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Меню сайта"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 70,
            background: 'var(--bg)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '20px',
            }}
          >
            <button
              type="button"
              className="burger"
              aria-label="Закрыть меню"
              onClick={() => setOpen(false)}
            >
              <span className="ic">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </span>
            </button>
          </div>
          <nav
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--s4)',
            }}
            aria-label="Главное меню"
          >
            {items.map((item, i) =>
              item.href ? (
                <a
                  key={i}
                  href={item.href}
                  style={{
                    fontSize: 28,
                    fontFamily: 'var(--font-display)',
                    color: 'var(--ink)',
                    fontWeight: 600,
                  }}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <span
                  key={i}
                  style={{
                    fontSize: 28,
                    fontFamily: 'var(--font-display)',
                    color: 'var(--muted)',
                    fontWeight: 600,
                  }}
                >
                  {item.label}
                </span>
              ),
            )}
          </nav>
        </div>
      )}
    </>
  )
}
