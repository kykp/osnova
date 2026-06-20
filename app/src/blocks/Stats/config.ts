import type { Block } from 'payload'

import { enabledField } from '../_shared/enabledField'

export const StatsBlock: Block = {
  slug: 'stats',
  labels: {
    singular: 'Доверие — Статистика',
    plural: 'Доверие — Статистика',
  },
  imageURL: '/block-previews/stats.svg',
  imageAltText: 'Превью: ряд крупных цифр с подписями',
  fields: [
    enabledField,
    {
      name: 'heading',
      type: 'text',
      label: 'Заголовок секции',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Подзаголовок',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Цифры',
      labels: { singular: 'Цифра', plural: 'Цифры' },
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'value',
          type: 'text',
          label: 'Значение',
          required: true,
          admin: { description: 'Например: 5000+, 25, 99.9%, ₽1.2 млрд.' },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Подпись',
          required: true,
          admin: { description: 'Что обозначает цифра. Например: «учеников», «лет на рынке».' },
        },
      ],
    },
  ],
}
