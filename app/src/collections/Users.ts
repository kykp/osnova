import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminField } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Пользователь',
    plural: 'Пользователи',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'roles'],
  },
  auth: true,
  access: {
    create: isAdmin,
    delete: isAdmin,
    update: ({ req: { user }, id }) =>
      Boolean(
        user &&
          (('roles' in user && Array.isArray(user.roles) && user.roles.includes('admin')) ||
            user.id === id),
      ),
    read: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Имя',
    },
    {
      name: 'roles',
      type: 'select',
      label: 'Роли',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      access: {
        update: isAdminField,
      },
      options: [
        { label: 'Администратор', value: 'admin' },
        { label: 'Редактор', value: 'editor' },
      ],
    },
  ],
  versions: false,
}
