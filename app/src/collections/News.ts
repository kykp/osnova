import type { CollectionConfig } from 'payload'

import { isAdmin, isAuthenticated } from '../access'
import { slugify } from '../utils/slugify'

export const News: CollectionConfig = {
  slug: 'news',
  labels: {
    singular: 'Новость',
    plural: 'Новости',
  },
  defaultSort: '-publishedAt',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', '_status', 'updatedAt'],
    preview: (doc) => {
      if (typeof doc?.slug !== 'string' || !doc.slug) return null
      return `/preview?slug=${encodeURIComponent(doc.slug)}&collection=news`
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
              name: 'excerpt',
              type: 'textarea',
              label: 'Краткое описание',
              admin: {
                description: 'Показывается в списке новостей и при шеринге в соцсетях.',
              },
            },
            {
              name: 'cover',
              type: 'upload',
              relationTo: 'media',
              label: 'Обложка',
            },
            {
              name: 'content',
              type: 'richText',
              label: 'Текст новости',
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
                    description: 'Если пусто — используется обычный заголовок новости.',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Краткое описание (meta description)',
                  admin: {
                    description: 'Если пусто — используется «Краткое описание» из вкладки «Содержимое».',
                  },
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Картинка для соцсетей (og:image)',
                  admin: {
                    description: 'Если пусто — используется обложка новости.',
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
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Дата публикации',
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        description: 'Используется для сортировки в списке новостей.',
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'dd.MM.yyyy HH:mm',
        },
      },
    },
  ],
}
