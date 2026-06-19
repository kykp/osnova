import { RichText as PayloadRichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import type { Page } from '@/payload-types'

type RichTextProps = Extract<NonNullable<Page['layout']>[number], { blockType: 'richText' }>

export function RichText({ content }: RichTextProps) {
  return (
    <section className="section" id="about">
      <div className="container">
        <article className="rich reveal">
          <PayloadRichText data={content} />
        </article>
      </div>
    </section>
  )
}
