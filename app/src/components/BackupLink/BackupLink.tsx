import React from 'react'

import styles from './BackupLink.module.css'

export const BackupLink = () => (
  <div className={styles.wrap}>
    <a className={styles.link} href="/api/backup" download>
      Скачать резервную копию
    </a>
    <p className={styles.hint}>
      Доступно только администратору. Требует <code>pg_dump</code> на сервере.
    </p>
  </div>
)
