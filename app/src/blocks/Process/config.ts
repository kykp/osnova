import type { Block } from 'payload'

export const ProcessBlock: Block = {
  slug: 'process',
  labels: {
    singular: 'О проекте — Этапы',
    plural: 'О проекте — Этапы',
  },
  imageURL: '/block-previews/process.svg',
  imageAltText: 'Превью: нумерованные шаги, соединённые линией',
  fields: [
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
      name: 'variant',
      type: 'select',
      label: 'Тип вёрстки',
      required: true,
      defaultValue: 'horizontal',
      options: [
        { label: 'Горизонтальный', value: 'horizontal' },
        { label: 'Вертикальный таймлайн', value: 'vertical' },
      ],
    },
    {
      name: 'steps',
      type: 'array',
      label: 'Шаги',
      labels: { singular: 'Шаг', plural: 'Шаги' },
      minRows: 2,
      maxRows: 8,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Название шага',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Описание',
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Иконка',
          admin: { description: 'Эмодзи или символ. Если не задана — показывается номер шага.' },
        },
      ],
    },
  ],
}
