import React from 'react'

import styles from './AdminBranding.module.css'

export const Logo = () => (
  <div className={styles.osnovaLogo}>
    <svg
      className={styles.osnovaMark}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="28" height="28" rx="6" fill="currentColor" />
      <text
        x="16"
        y="22"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
        fontWeight="700"
        fontSize="18"
        fill="white"
      >
        O
      </text>
    </svg>
    <span className={styles.osnovaWord}>Osnova</span>
  </div>
)
