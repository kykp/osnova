import type { Block } from 'payload'

import { enabledField } from '../_shared/enabledField'

export const TeamBlock: Block = {
  slug: 'team',
  labels: {
    singular: 'Доверие — Команда',
    plural: 'Доверие — Команда',
  },
  imageURL: '/block-previews/team.svg',
  imageAltText: 'Превью: три карточки сотрудников с фото и должностями',
  fields: [
    enabledField,
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
