'use client'

import { useAllFormFields, useField } from '@payloadcms/ui'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import styles from './BlockVisibilityMenu.module.css'

type ActivePopup = {
  rowIndex: number
  buttonGroupEl: HTMLElement
}

const DISABLED_CLASS = 'osnova-block-disabled'

export function BlockVisibilityMenu() {
  const [active, setActive] = useState<ActivePopup | null>(null)
  const [fields] = useAllFormFields()
  const lastClickedRowRef = useRef<number | null>(null)

  useEffect(() => {
    const disabledIndexes = new Set<string>()
    Object.entries(fields ?? {}).forEach(([path, state]) => {
      const m = path.match(/^layout\.(\d+)\.enabled$/)
      if (!m) return
      const value = (state as { value?: unknown })?.value
      if (value === false) disabledIndexes.add(m[1])
    })

    const apply = () => {
      document.querySelectorAll('[id^="layout-row-"]').forEach((el) => {
        const match = (el as HTMLElement).id.match(/^layout-row-(\d+)$/)
        if (!match) return
        if (disabledIndexes.has(match[1])) el.classList.add(DISABLED_CLASS)
        else el.classList.remove(DISABLED_CLASS)
      })
    }

    apply()

    const observer = new MutationObserver(apply)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [fields])

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      const trigger = target.closest('.array-actions__button')
      if (!trigger) return
      const row = trigger.closest('[id^="layout-row-"]') as HTMLElement | null
      if (!row) return
      const match = row.id.match(/layout-row-(\d+)/)
      if (match) lastClickedRowRef.current = Number(match[1])
    }

    const detectFromNode = (node: HTMLElement) => {
      if (!node.classList?.contains('popup__content')) return
      const buttonGroup = node.querySelector('.popup-button-list') as HTMLElement | null
      if (!buttonGroup) return
      if (!buttonGroup.querySelector('.array-actions__action')) return
      if (lastClickedRowRef.current === null) return
      setActive({ rowIndex: lastClickedRowRef.current, buttonGroupEl: buttonGroup })
    }

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (n instanceof HTMLElement) detectFromNode(n)
        })
        if (m.type === 'attributes' && m.attributeName === 'class') {
          const t = m.target as HTMLElement
          if (t.classList?.contains('popup__content')) {
            detectFromNode(t)
          } else if (t.classList?.contains('popup__hidden-content')) {
            setActive((curr) => (curr && t.contains(curr.buttonGroupEl) ? null : curr))
          }
        }
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
    })
    document.addEventListener('mousedown', onMouseDown, true)

    return () => {
      observer.disconnect()
      document.removeEventListener('mousedown', onMouseDown, true)
    }
  }, [])

  if (!active) return null
  return (
    <VisibilityItem
      key={`${active.rowIndex}-${active.buttonGroupEl.id || ''}`}
      rowIndex={active.rowIndex}
      buttonGroupEl={active.buttonGroupEl}
    />
  )
}

function VisibilityItem({
  rowIndex,
  buttonGroupEl,
}: {
  rowIndex: number
  buttonGroupEl: HTMLElement
}) {
  const { value, setValue } = useField<boolean>({ path: `layout.${rowIndex}.enabled` })
  const isVisible = value !== false

  return createPortal(
    <button
      type="button"
      className={`popup-button-list__button array-actions__action ${styles.menuButton}`}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        setValue(!isVisible)
      }}
    >
      <span className={styles.menuIcon} aria-hidden="true">
        {isVisible ? <EyeOffIcon /> : <EyeIcon />}
      </span>
      {isVisible ? 'Скрыть на сайте' : 'Показать на сайте'}
    </button>,
    buttonGroupEl,
  )
}

function EyeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  )
}
