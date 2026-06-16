import type { Block } from 'payload'

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: {
    singular: 'Текст',
    plural: 'Текстовые блоки',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      label: 'Содержимое',
      required: true,
    },
  ],
}
