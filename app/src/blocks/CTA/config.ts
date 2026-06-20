import type { Block } from 'payload'

import { enabledField } from '../_shared/enabledField'

export const CTABlock: Block = {
  slug: 'cta',
  labels: {
    singular: 'Целевое действие — CTA',
    plural: 'Целевое действие — CTA',
  },
  imageURL: '/block-previews/cta.svg',
  imageAltText: 'Превью: цветная плашка с заголовком и кнопкой',
  fields: [
    enabledField,
    {
      name: 'heading',
      type: 'text',
      label: 'Заголовок',
      required: true,
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Подзаголовок',
    },
    {
      name: 'button',
      type: 'group',
      label: 'Кнопка',
      fields: [
        { name: 'label', type: 'text', label: 'Текст' },
        {
          name: 'url',
          type: 'text',
          label: 'Ссылка',
          admin: { description: 'Внутренний путь (/о-нас) или внешний (https://...).' },
        },
      ],
    },
    {
      name: 'background',
      type: 'upload',
      relationTo: 'media',
      label: 'Фоновая картинка',
      admin: {
        description:
          'Необязательная фоновая картинка. Текст будет показан поверх неё с тёмной накладкой для читаемости.',
      },
    },
  ],
}
