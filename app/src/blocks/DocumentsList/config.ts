import type { Block } from 'payload'

export const DocumentsListBlock: Block = {
  slug: 'documentsList',
  labels: {
    singular: 'Доверие — Список документов',
    plural: 'Доверие — Список документов',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Заголовок секции',
      defaultValue: 'Документы',
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Сколько документов показать',
      defaultValue: 0,
      admin: {
        description:
          'Сортировка по дате документа (свежие сверху). 0 — показать все.',
      },
    },
  ],
}
