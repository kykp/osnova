import type { Block } from 'payload'

export const SliderBlock: Block = {
  slug: 'slider',
  labels: {
    singular: 'Контент — Слайдер',
    plural: 'Контент — Слайдер',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Заголовок секции',
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      label: 'Автопрокрутка',
      defaultValue: false,
      admin: {
        description:
          'Если включено — слайды меняются автоматически каждые 5 секунд. Останавливается при наведении мыши.',
      },
    },
    {
      name: 'slides',
      type: 'array',
      label: 'Слайды',
      labels: { singular: 'Слайд', plural: 'Слайды' },
      minRows: 2,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Картинка',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Подпись',
        },
        {
          name: 'url',
          type: 'text',
          label: 'Ссылка',
          admin: { description: 'Если задана, весь слайд станет ссылкой.' },
        },
      ],
    },
  ],
}
