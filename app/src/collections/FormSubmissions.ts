import type { CollectionConfig } from 'payload'

import { isAdmin, isAuthenticated } from '../access'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  labels: {
    singular: 'Заявка',
    plural: 'Заявки',
  },
  defaultSort: '-createdAt',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'email', 'source', 'createdAt'],
  },
  access: {
    read: isAuthenticated,
    create: () => true,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Имя',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Телефон',
    },
    {
      name: 'email',
      type: 'email',
      label: 'E-mail',
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Сообщение',
    },
    {
      name: 'source',
      type: 'text',
      label: 'Источник',
      admin: {
        readOnly: true,
        description: 'Откуда пришла заявка (адрес страницы или идентификатор блока).',
      },
    },
  ],
}
