import type { Block } from 'payload'

export const NewsListBlock: Block = {
  slug: 'newsList',
  labels: {
    singular: 'Доверие — Анонсы новостей',
    plural: 'Доверие — Анонсы новостей',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Заголовок секции',
      defaultValue: 'Новости',
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Сколько новостей показать',
      defaultValue: 3,
      min: 1,
      max: 12,
    },
    {
      name: 'allLinkLabel',
      type: 'text',
      label: 'Текст кнопки «Все новости»',
      defaultValue: 'Все новости →',
    },
    {
      name: 'allLinkUrl',
      type: 'text',
      label: 'Адрес страницы со всеми новостями',
      defaultValue: '/news',
      admin: { description: 'Если оставить пустым — кнопка не показывается.' },
    },
  ],
}
