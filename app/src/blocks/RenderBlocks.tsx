import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { Cards } from './Cards/Component'
import { CTA } from './CTA/Component'
import { FAQ } from './FAQ/Component'
import { Features } from './Features/Component'
import { Hero } from './Hero/Component'
import { ImageBlock } from './Image/Component'
import { RichText } from './RichText/Component'
import { Stats } from './Stats/Component'

type Blocks = NonNullable<Page['layout']>

export function RenderBlocks({ blocks }: { blocks: Blocks | null | undefined }) {
  if (!blocks?.length) return null

  return (
    <Fragment>
      {blocks.map((block) => {
        switch (block.blockType) {
          case 'hero':
            return <Hero key={block.id} {...block} />
          case 'richText':
            return <RichText key={block.id} {...block} />
          case 'image':
            return <ImageBlock key={block.id} {...block} />
          case 'cards':
            return <Cards key={block.id} {...block} />
          case 'features':
            return <Features key={block.id} {...block} />
          case 'cta':
            return <CTA key={block.id} {...block} />
          case 'faq':
            return <FAQ key={block.id} {...block} />
          case 'stats':
            return <Stats key={block.id} {...block} />
          default:
            return null
        }
      })}
    </Fragment>
  )
}
