import type { Block } from 'payload'

export const blockAdmin = (rowLabel: string): Block['admin'] => ({
  components: {
    Label: {
      path: '@/blocks/_shared/BlockRowLabel#BlockRowLabel',
      clientProps: { rowLabel },
    },
  },
})
