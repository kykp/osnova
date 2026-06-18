import type { Block } from 'payload'

export const ImageBlock: Block = {
  slug: 'image',
  labels: {
    singular: 'Контент — Картинка',
    plural: 'Контент — Картинки',
  },
  imageURL: '/block-previews/image.svg',
  imageAltText: 'Превью: картинка с подписью под ней',
  fields: [
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
