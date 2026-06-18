import type { Block } from 'payload'

export const FeaturesBlock: Block = {
  slug: 'features',
  labels: {
    singular: 'Выгоды — Преимущества',
    plural: 'Выгоды — Преимущества',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Заголовок секции',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Подзаголовок секции',
    },
    {
      name: 'variant',
      type: 'select',
      label: 'Тип вёрстки',
      required: true,
      defaultValue: 'icons-grid',
      options: [
        { label: 'Сетка с иконками', value: 'icons-grid' },
        { label: 'Карточки с метрикой', value: 'cards-metric' },
        { label: 'Табы', value: 'tabs' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: 'Пункты',
      labels: { singular: 'Пункт', plural: 'Пункты' },
      minRows: 1,
      fields: [
        {
          name: 'icon',
          type: 'text',
          label: 'Иконка',
          admin: {
            description:
              'Эмодзи или символ, например 🚀, 💎, ✓. Используется в вариантах «Сетка с иконками» и «Табы».',
          },
        },
        {
          name: 'metric',
          type: 'text',
          label: 'Метрика',
          admin: {
            description: 'Только для варианта «Карточки с метрикой». Например: 30%, 5×, 99.9%, 1000+.',
          },
        },
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
      ],
    },
  ],
}
