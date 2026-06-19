'use client'

import React, { useEffect, useState } from 'react'

const STORAGE_KEY = 'osnova-theme'

const SunIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="19"
    height="19"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" />
  </svg>
)
const MoonIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="19"
    height="19"
  >
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
)

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null)

  useEffect(() => {
    const stored =
      (localStorage.getItem(STORAGE_KEY) as 'light' | 'dark' | null) ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    setTheme(stored)
    document.documentElement.setAttribute('data-theme', stored)
  }, [])

  if (!theme) {
    return (
      <button
        type="button"
        className="theme-toggle"
        aria-label="Сменить тему"
        suppressHydrationWarning
      >
        <span className="ic" />
      </button>
    )
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'}
      onClick={() => {
        const next = theme === 'light' ? 'dark' : 'light'
        setTheme(next)
        document.documentElement.setAttribute('data-theme', next)
        localStorage.setItem(STORAGE_KEY, next)
      }}
    >
      <span className="ic" aria-hidden="true">
        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
      </span>
    </button>
  )
}
