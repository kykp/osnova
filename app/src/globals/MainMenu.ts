import type { Field, GlobalConfig } from 'payload'

import { isAdmin } from '../access'

const linkFields: Field[] = [
  {
    name: 'label',
    type: 'text',
    label: 'Текст пункта',
    required: true,
  },
  {
    name: 'target',
    type: 'select',
    label: 'Куда ведёт',
    required: true,
    defaultValue: 'page',
    options: [
      { label: 'Страница сайта', value: 'page' },
      { label: 'Внешний адрес', value: 'url' },
    ],
  },
  {
    name: 'page',
    type: 'relationship',
    relationTo: 'pages',
    label: 'Страница',
    admin: {
      condition: (_data, siblingData) => siblingData?.target === 'page',
    },
  },
  {
    name: 'url',
    type: 'text',
    label: 'Адрес',
    admin: {
      condition: (_data, siblingData) => siblingData?.target === 'url',
      description: 'Полный адрес: https://...',
    },
  },
]

export const MainMenu: GlobalConfig = {
  slug: 'main-menu',
  label: 'Меню сайта',
  access: {
    read: () => true,
    update: isAdmin,
  },
  admin: {
    group: 'Сайт',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Пункты меню',
      labels: { singular: 'Пункт', plural: 'Пункты' },
      fields: [
        ...linkFields,
        {
          name: 'children',
          type: 'array',
          label: 'Подменю',
          labels: { singular: 'Подпункт', plural: 'Подпункты' },
          fields: linkFields,
        },
      ],
    },
  ],
}
