import type { Block } from 'payload'

import { blockAdmin } from '../_shared/blockAdmin'
import { enabledField } from '../_shared/enabledField'

export const ImageBlock: Block = {
  slug: 'image',
  labels: {
    singular: 'Контент — Картинка',
    plural: 'Контент — Картинки',
  },
  admin: blockAdmin('Контент — Картинка'),
  imageURL: '/block-previews/image.svg',
  imageAltText: 'Превью: картинка с подписью под ней',
  fields: [
    enabledField,
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Файл',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Подпись под картинкой',
    },
    {
      name: 'url',
      type: 'text',
      label: 'Ссылка',
      admin: {
        description: 'Если задана, картинка станет кликабельной.',
      },
    },
  ],
}
