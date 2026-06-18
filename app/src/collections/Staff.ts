import type { CollectionConfig, FieldHook } from 'payload'

import { isAdmin, isAuthenticated } from '../access'

const buildFullName: FieldHook = ({ siblingData }) => {
  const parts = [siblingData?.lastName, siblingData?.firstName, siblingData?.middleName]
    .filter((p): p is string => typeof p === 'string' && p.trim().length > 0)
    .map((p) => p.trim())
  return parts.join(' ')
}

export const Staff: CollectionConfig = {
  slug: 'staff',
  labels: {
    singular: 'Сотрудник',
    plural: 'Сотрудники',
  },
  defaultSort: 'sortOrder',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'position', 'sortOrder'],
  },
  access: {
    read: () => true,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAdmin,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'lastName',
          type: 'text',
          label: 'Фамилия',
          required: true,
        },
        {
          name: 'firstName',
          type: 'text',
          label: 'Имя',
          required: true,
        },
        {
          name: 'middleName',
          type: 'text',
          label: 'Отчество',
        },
      ],
    },
    {
      name: 'fullName',
      type: 'text',
      admin: { hidden: true },
      hooks: {
        beforeChange: [buildFullName],
      },
    },
    {
      name: 'position',
      type: 'text',
      label: 'Должность',
      required: true,
      admin: {
        description: 'Должность сотрудника. Отображается рядом с фамилией.',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Фото',
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'О сотруднике',
      admin: {
        description: 'Краткая справка: образование, опыт, награды.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Email',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Телефон',
        },
      ],
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Порядок',
      defaultValue: 100,
      admin: {
        position: 'sidebar',
        description: 'Меньше число — выше в списке. По умолчанию 100.',
      },
    },
  ],
}
