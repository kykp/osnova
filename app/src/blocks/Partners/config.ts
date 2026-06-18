import type { Block } from 'payload'

export const PartnersBlock: Block = {
  slug: 'partners',
  labels: {
    singular: 'Доверие — Логотипы партнёров',
    plural: 'Доверие — Логотипы партнёров',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Заголовок секции',
      defaultValue: 'Нам доверяют',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Логотипы',
      labels: { singular: 'Логотип', plural: 'Логотипы' },
      minRows: 1,
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Логотип',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          label: 'Название организации',
          admin: { description: 'Используется как alt-текст для доступности.' },
        },
        {
          name: 'url',
          type: 'text',
          label: 'Ссылка',
          admin: { description: 'Если задана, логотип станет ссылкой.' },
        },
      ],
    },
  ],
}
