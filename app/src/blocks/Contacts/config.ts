import type { Block } from 'payload'

export const ContactsBlock: Block = {
  slug: 'contacts',
  labels: {
    singular: 'Целевое действие — Контакты',
    plural: 'Целевое действие — Контакты',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Заголовок секции',
      defaultValue: 'Контакты',
    },
    {
      name: 'address',
      type: 'text',
      label: 'Адрес',
      admin: { description: 'Например: «Москва, Тверская 1». Используется как метка на карте.' },
    },
    {
      name: 'mapProvider',
      type: 'select',
      label: 'Карта',
      defaultValue: 'yandex',
      options: [
        { label: 'Яндекс.Карты', value: 'yandex' },
        { label: 'Google Maps', value: 'google' },
        { label: 'Не показывать карту', value: 'none' },
      ],
    },
    {
      name: 'mapZoom',
      type: 'number',
      label: 'Масштаб карты',
      defaultValue: 15,
      min: 1,
      max: 20,
      admin: { description: 'От 1 (мир) до 20 (детально дом).' },
    },
    {
      name: 'showSettingsContacts',
      type: 'checkbox',
      label: 'Брать e-mail и телефон из «Настроек сайта»',
      defaultValue: true,
      admin: {
        description:
          'Если включено — показываются контакты из глобала «Настройки сайта → Контакты». Если выключено — можно указать другие тут же ниже.',
      },
    },
    {
      name: 'overrideEmail',
      type: 'email',
      label: 'E-mail (если отличается от настроек)',
      admin: { condition: (_, sibling) => sibling?.showSettingsContacts === false },
    },
    {
      name: 'overridePhone',
      type: 'text',
      label: 'Телефон (если отличается от настроек)',
      admin: { condition: (_, sibling) => sibling?.showSettingsContacts === false },
    },
    {
      name: 'workingHours',
      type: 'textarea',
      label: 'Часы работы',
      admin: { description: 'Например: «Пн–Пт: 9:00–18:00, Сб–Вс: выходной».' },
    },
  ],
}
