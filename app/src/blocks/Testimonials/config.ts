import type { Block } from 'payload'

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  labels: {
    singular: 'Доверие — Отзывы',
    plural: 'Доверие — Отзывы',
  },
  imageURL: '/block-previews/testimonials.svg',
  imageAltText: 'Превью: две карточки отзывов с цитатами и фото авторов',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Заголовок секции',
    },
    {
      name: 'variant',
      type: 'select',
      label: 'Тип вёрстки',
      required: true,
      defaultValue: 'cards',
      options: [
        { label: 'Сетка карточек', value: 'cards' },
        { label: 'Слайдер', value: 'slider' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      label: 'Отзывы',
      labels: { singular: 'Отзыв', plural: 'Отзывы' },
      minRows: 1,
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          label: 'Текст отзыва',
          required: true,
        },
        {
          name: 'author',
          type: 'text',
          label: 'Имя автора',
          required: true,
        },
        {
          name: 'role',
          type: 'text',
          label: 'Должность / отношение к компании',
          admin: { description: 'Например: «Директор», «Выпускница 2024», «Клиент с 2019 года».' },
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          label: 'Фото автора',
        },
      ],
    },
  ],
}
