import type { Block } from 'payload'

export const FAQBlock: Block = {
  slug: 'faq',
  labels: {
    singular: 'Доверие — Частые вопросы',
    plural: 'Доверие — Частые вопросы',
  },
  imageURL: '/block-previews/faq.svg',
  imageAltText: 'Превью: раскрывающиеся блоки с вопросами и ответами',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Заголовок секции',
      defaultValue: 'Частые вопросы',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Вопросы и ответы',
      labels: { singular: 'Пара', plural: 'Пары' },
      minRows: 1,
      fields: [
        {
          name: 'question',
          type: 'text',
          label: 'Вопрос',
          required: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          label: 'Ответ',
          required: true,
        },
      ],
    },
  ],
}
