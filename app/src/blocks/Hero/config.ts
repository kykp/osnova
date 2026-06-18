import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Первый экран — Hero',
    plural: 'Первый экран — Hero',
  },
  imageURL: '/block-previews/hero.svg',
  imageAltText: 'Превью: заголовок, подзаголовок и кнопка по центру',
  fields: [
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
      name: 'cta',
      type: 'group',
      label: 'Кнопка',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Текст',
        },
        {
          name: 'url',
          type: 'text',
          label: 'Ссылка',
          admin: {
            description: 'Внутренняя ссылка, например /о-нас, или внешняя https://...',
          },
        },
      ],
    },
  ],
}
