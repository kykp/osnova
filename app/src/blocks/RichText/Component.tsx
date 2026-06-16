import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import type { Page } from '@/payload-types'

import styles from './Component.module.css'

type RichTextProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'richText' }>

export function RichText({ content }: RichTextProps) {
  return (
    <section className={styles.root}>
      <div className={styles.inner}>
        <PayloadRichText data={content} />
      </div>
    </section>
  )
}
