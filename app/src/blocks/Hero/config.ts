import type { Block } from 'payload'

import { blockAdmin } from '../_shared/blockAdmin'
import { enabledField } from '../_shared/enabledField'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Первый экран — Hero',
    plural: 'Первый экран — Hero',
  },
  admin: blockAdmin('Первый экран — Hero'),
  imageURL: '/block-previews/hero.svg',
  imageAltText: 'Превью: заголовок, подзаголовок и кнопка по центру',
  fields: [
    enabledField,
    {
      name: 'variant',
      type: 'select',
      label: 'Тип вёрстки',
      required: true,
      defaultValue: 'centered',
      options: [
        { label: 'Текст по центру', value: 'centered' },
        { label: 'Сплит — текст слева, картинка справа', value: 'split' },
        { label: 'Картинка-фон, текст поверх', value: 'overlay' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Заголовок',
      required: true,
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Подзаголовок',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Изображение',
      admin: {
        description: 'Используется в вариантах «Сплит» и «Картинка-фон».',
        condition: (_, siblingData) =>
          siblingData?.variant === 'split' || siblingData?.variant === 'overlay',
      },
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Кнопка',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Текст',
        },
        {
          name: 'url',
          type: 'text',
          label: 'Ссылка',
          admin: {
            description: 'Внутренняя ссылка, например /о-нас, или внешняя https://...',
          },
        },
      ],
    },
  ],
}
