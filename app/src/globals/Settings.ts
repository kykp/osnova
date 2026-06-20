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
              type: 'collapsible',
              label: 'Брендирование',
              admin: { initCollapsed: false },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'logo',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Логотип для светлой темы',
                      admin: {
                        width: '50%',
                        description: 'PNG (прозрачный) или SVG, горизонтальный, от 560×160 px.',
                      },
                    },
                    {
                      name: 'siteIcon',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Иконка сайта (favicon)',
                      admin: {
                        width: '50%',
                        description: 'PNG или SVG, квадратная, от 128×128 px.',
                      },
                    },
                  ],
                },
                {
                  name: 'logoDark',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Логотип для тёмной темы',
                  admin: {
                    description:
                      'Необязательно. Загрузи, если основной логотип плохо читается на тёмном фоне. Если пусто — в тёмной теме показывается основной логотип.',
                  },
                },
                {
                  name: 'siteTitle',
                  type: 'text',
                  label: 'Название сайта',
                  admin: {
                    description:
                      'Показывается рядом с логотипом, во вкладке браузера и в поисковой выдаче. Если логотип уже содержит название — можно оставить пустым.',
                  },
                },
                {
                  name: 'siteDescription',
                  type: 'textarea',
                  label: 'Краткое описание сайта',
                  admin: {
                    description:
                      'Для поисковиков и шеринга ссылок в соцсетях. На самом сайте не отображается.',
                  },
                },
              ],
            },
            {
              name: 'homePage',
              type: 'relationship',
              relationTo: 'pages',
              label: 'Главная страница',
              admin: {
                description:
                  'Какую страницу показывать на корне сайта (адрес /). Если не выбрана — отображается экран первой настройки.',
              },
            },
          ],
        },
        {
          label: 'Контакты',
          description:
            'Общие контакты организации. Блоки с контактами и подвал сайта автоматически берут их отсюда. Если поменяешь телефон или e-mail здесь — обновится во всех местах на сайте, где они выводятся. Указывать вручную в блоках на страницах не нужно.',
          fields: [
            {
              name: 'contactEmail',
              type: 'email',
              label: 'E-mail для связи',
              admin: {
                description:
                  'Основной адрес, на который пишут пользователи сайта. Подтягивается в блоки контактов и в подвал.',
              },
            },
            {
              name: 'contactPhone',
              type: 'text',
              label: 'Телефон',
              admin: {
                description:
                  'Основной номер для связи. Подтягивается в блоки контактов и в подвал.',
              },
            },
          ],
        },
      ],
    },
  ],
}
