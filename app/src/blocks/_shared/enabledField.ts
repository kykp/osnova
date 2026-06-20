import type { Field } from 'payload'

export const enabledField: Field = {
  name: 'enabled',
  type: 'checkbox',
  defaultValue: true,
  admin: { hidden: true },
}
