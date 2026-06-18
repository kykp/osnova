import type { Block } from 'payload'

export const CardsBlock: Block = {
  slug: 'cards',
  labels: {
    singular: 'Выгоды — Плитки',
    plural: 'Выгоды — Плитки',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Заголовок секции',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Плитки',
      labels: {
        singular: 'Плитка',
        plural: 'Плитки',
      },
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Заголовок',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Описание',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Картинка',
        },
        {
          name: 'url',
          type: 'text',
          label: 'Ссылка',
          admin: {
            description: 'Если задана, вся плитка станет ссылкой.',
          },
        },
      ],
    },
  ],
}
