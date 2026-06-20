import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { Cards } from './Cards/Component'
import { ContactForm } from './ContactForm/Component'
import { Contacts } from './Contacts/Component'
import { CTA } from './CTA/Component'
import { DocumentsList } from './DocumentsList/Component'
import { FAQ } from './FAQ/Component'
import { Features } from './Features/Component'
import { Hero } from './Hero/Component'
import { ImageBlock } from './Image/Component'
import { NewsList } from './NewsList/Component'
import { Partners } from './Partners/Component'
import { Process } from './Process/Component'
import { RichText } from './RichText/Component'
import { Slider } from './Slider/Component'
import { Stats } from './Stats/Component'
import { Team } from './Team/Component'
import { Testimonials } from './Testimonials/Component'
import { Video } from './Video/Component'

type Blocks = NonNullable<Page['layout']>

export function RenderBlocks({ blocks }: { blocks: Blocks | null | undefined }) {
  if (!blocks?.length) return null

  return (
    <Fragment>
      {blocks.map((block) => {
        if ((block as { enabled?: boolean }).enabled === false) return null
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
          case 'process':
            return <Process key={block.id} {...block} />
          case 'testimonials':
            return <Testimonials key={block.id} {...block} />
          case 'video':
            return <Video key={block.id} {...block} />
          case 'slider':
            return <Slider key={block.id} {...block} />
          case 'partners':
            return <Partners key={block.id} {...block} />
          case 'team':
            return <Team key={block.id} {...block} />
          case 'documentsList':
            return <DocumentsList key={block.id} {...block} />
          case 'newsList':
            return <NewsList key={block.id} {...block} />
          case 'contacts':
            return <Contacts key={block.id} {...block} />
          case 'contactForm':
            return <ContactForm key={block.id} {...block} />
          default:
            return null
        }
      })}
    </Fragment>
  )
}
