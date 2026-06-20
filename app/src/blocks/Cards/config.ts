import type { Block } from 'payload'

import { blockAdmin } from '../_shared/blockAdmin'
import { enabledField } from '../_shared/enabledField'

export const CardsBlock: Block = {
  slug: 'cards',
  labels: {
    singular: 'Выгоды — Плитки',
    plural: 'Выгоды — Плитки',
  },
  admin: blockAdmin('Выгоды — Плитки'),
  imageURL: '/block-previews/cards.svg',
  imageAltText: 'Превью: три карточки с картинкой и описанием',
  fields: [
    enabledField,
    {
      name: 'heading',
      type: 'text',
      label: 'Заголовок секции',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Плитки',
      labels: {
        singular: 'Плитка',
        plural: 'Плитки',
      },
      minRows: 1,
      fields: [
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
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Картинка',
        },
        {
          name: 'url',
          type: 'text',
          label: 'Ссылка',
          admin: {
            description: 'Если задана, вся плитка станет ссылкой.',
          },
        },
      ],
    },
  ],
}
