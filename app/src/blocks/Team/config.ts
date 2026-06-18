import type { Block } from 'payload'

export const TeamBlock: Block = {
  slug: 'team',
  labels: {
    singular: 'Доверие — Команда',
    plural: 'Доверие — Команда',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Заголовок секции',
      defaultValue: 'Наша команда',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Подзаголовок',
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Сколько сотрудников показать',
      defaultValue: 0,
      admin: {
        description:
          'Сортировка по полю «Порядок» в коллекции «Сотрудники». 0 — показать всех.',
      },
    },
  ],
}
