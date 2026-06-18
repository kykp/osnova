import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { isAdmin, isAdminField } from '../access'

const ensureFirstUserIsAdmin: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation !== 'create') return data
  if (Array.isArray(data.roles) && data.roles.length > 0) return data

  const { totalDocs } = await req.payload.count({ collection: 'users' })
  if (totalDocs > 0) return data

  return { ...data, roles: ['admin'] }
}

const serverURL = () => process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

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
  auth: {
    forgotPassword: {
      generateEmailSubject: () => 'Восстановление пароля — Osnova',
      generateEmailHTML: (args) => {
        const token = args && 'token' in args ? args.token : ''
        const resetUrl = `${serverURL()}/admin/reset?token=${token}`
        return `
          <p>Здравствуйте,</p>
          <p>Кто-то запросил восстановление пароля для вашей учётной записи в Osnova.</p>
          <p>Чтобы задать новый пароль, перейдите по ссылке:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>Ссылка действует ограниченное время. Если вы не запрашивали восстановление — просто проигнорируйте это письмо.</p>
        `
      },
    },
  },
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
  hooks: {
    beforeChange: [ensureFirstUserIsAdmin],
  },
  versions: false,
}
