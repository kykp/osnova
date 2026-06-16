import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Шапка (Hero)',
    plural: 'Шапки',
  },
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
