import type { Block } from 'payload'

import { blockAdmin } from '../_shared/blockAdmin'
import { enabledField } from '../_shared/enabledField'

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: {
    singular: 'Контент — Текст',
    plural: 'Контент — Текст',
  },
  admin: blockAdmin('Контент — Текст'),
  imageURL: '/block-previews/rich-text.svg',
  imageAltText: 'Превью: блок текста с заголовком и абзацами',
  fields: [
    enabledField,
    {
      name: 'content',
      type: 'richText',
      label: 'Содержимое',
      required: true,
    },
  ],
}
