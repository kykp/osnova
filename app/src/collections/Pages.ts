import type { CollectionConfig } from 'payload'

import { isAdmin, isAuthenticated } from '../access'
import { CardsBlock } from '../blocks/Cards/config'
import { CTABlock } from '../blocks/CTA/config'
import { FAQBlock } from '../blocks/FAQ/config'
import { FeaturesBlock } from '../blocks/Features/config'
import { HeroBlock } from '../blocks/Hero/config'
import { ImageBlock } from '../blocks/Image/config'
import { RichTextBlock } from '../blocks/RichText/config'
import { StatsBlock } from '../blocks/Stats/config'
import { slugify } from '../utils/slugify'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Страница',
    plural: 'Страницы',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    preview: (doc) => {
      if (typeof doc?.slug !== 'string' || !doc.slug) return null
      return `/preview?slug=${encodeURIComponent(doc.slug)}`
    },
  },
  versions: {
    drafts: {
      autosave: { interval: 2000 },
    },
    maxPerDoc: 20,
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { _status: { equals: 'published' } }
    },
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAdmin,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Содержимое',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Заголовок',
              required: true,
            },
            {
              name: 'layout',
              type: 'blocks',
              label: 'Блоки',
              labels: { singular: 'Блок', plural: 'Блоки' },
              blocks: [
                HeroBlock,
                FeaturesBlock,
                CardsBlock,
                StatsBlock,
                FAQBlock,
                CTABlock,
                RichTextBlock,
                ImageBlock,
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'meta',
              type: 'group',
              label: false,
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Заголовок для поисковиков (title)',
                  admin: {
                    description: 'Если пусто — используется обычный заголовок страницы.',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Краткое описание (meta description)',
                  admin: {
                    description: 'Показывается в выдаче Яндекса и Google.',
                  },
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Картинка для соцсетей (og:image)',
                  admin: {
                    description: 'Используется при шеринге ссылки в Telegram, ВК и т.п.',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Адрес (slug)',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Заполнится автоматически из заголовка. Можно править вручную.',
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ data, value }) => {
            if (value) return slugify(String(value))
            if (data?.title) return slugify(String(data.title))
            return value
          },
        ],
      },
    },
  ],
}
