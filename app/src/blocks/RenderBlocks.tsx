import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { Cards } from './Cards/Component'
import { Hero } from './Hero/Component'
import { ImageBlock } from './Image/Component'
import { RichText } from './RichText/Component'

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
          default:
            return null
        }
      })}
    </Fragment>
  )
}
