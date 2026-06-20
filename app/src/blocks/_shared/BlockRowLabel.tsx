'use client'

import { Pill, SectionTitle, useField, useRowLabel } from '@payloadcms/ui'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import styles from './BlockRowLabel.module.css'

type Props = {
  rowLabel: string
  readOnly?: boolean
}

export function BlockRowLabel({ rowLabel, readOnly }: Props) {
  const { path, rowNumber } = useRowLabel<{ enabled?: boolean }>()
  const rootRef = useRef<HTMLSpanElement>(null)
  const [actionsEl, setActionsEl] = useState<HTMLElement | null>(null)

  const { value, setValue } = useField<boolean>({ path: `${path}.enabled` })
  const isVisible = value !== false

  useEffect(() => {
    if (!rootRef.current) return
    const toggleWrap = rootRef.current.closest('.collapsible__toggle-wrap')
    const actions = toggleWrap?.querySelector('.collapsible__actions')
    setActionsEl(actions as HTMLElement | null)
  }, [])

  const number = String((rowNumber ?? 0) + 1).padStart(2, '0')

  return (
    <span ref={rootRef} className={styles.label}>
      <span className="blocks-field__block-number">{number}</span>
      <Pill className="blocks-field__block-pill" pillStyle="white" size="small">
        {rowLabel}
      </Pill>
      <SectionTitle path={`${path}.blockName`} readOnly={!!readOnly} />
      {actionsEl &&
        createPortal(
          <button
            type="button"
            className={`${styles.eye} ${isVisible ? '' : styles.eyeOff}`}
            aria-label={isVisible ? 'Скрыть блок на сайте' : 'Показать блок на сайте'}
            title={isVisible ? 'Виден на сайте — кликните, чтобы скрыть' : 'Скрыт на сайте — кликните, чтобы показать'}
            disabled={readOnly}
            onClick={(e) => {
              e.stopPropagation()
              if (!readOnly) setValue(!isVisible)
            }}
          >
            <EyeIcon hidden={!isVisible} />
          </button>,
          actionsEl,
        )}
    </span>
  )
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  if (hidden) {
    return (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" y1="2" x2="22" y2="22" />
      </svg>
    )
  }
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
