import type { GlobalConfig } from 'payload'

import { isAdmin } from '../access'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Настройки сайта',
  access: {
    read: () => true,
    update: isAdmin,
  },
  admin: {
    group: 'Сайт',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Основное',
          fields: [
            {
              name: 'siteTitle',
              type: 'text',
              label: 'Название сайта',
              required: true,
              defaultValue: 'Osnova',
            },
            {
              name: 'siteDescription',
              type: 'textarea',
              label: 'Краткое описание',
              admin: {
                description: 'Используется в meta description и в шапке сайта.',
              },
            },
          ],
        },
        {
          label: 'Контакты',
          fields: [
            {
              name: 'contactEmail',
              type: 'email',
              label: 'E-mail для связи',
            },
            {
              name: 'contactPhone',
              type: 'text',
              label: 'Телефон',
            },
          ],
        },
      ],
    },
  ],
}
