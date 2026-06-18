import type { Block } from 'payload'

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: {
    singular: 'Контент — Текст',
    plural: 'Контент — Текст',
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
