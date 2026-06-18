import type { Block } from 'payload'

export const ContactFormBlock: Block = {
  slug: 'contactForm',
  labels: {
    singular: 'Целевое действие — Форма заявки',
    plural: 'Целевое действие — Форма заявки',
  },
  imageURL: '/block-previews/contact-form.svg',
  imageAltText: 'Превью: форма с полями ввода и кнопкой «Отправить»',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Заголовок секции',
      defaultValue: 'Оставьте заявку',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Описание под заголовком',
      defaultValue: 'Мы свяжемся с вами в ближайшее время.',
    },
    {
      name: 'showMessageField',
      type: 'checkbox',
      label: 'Показывать поле «Сообщение»',
      defaultValue: true,
    },
    {
      name: 'submitLabel',
      type: 'text',
      label: 'Текст кнопки отправки',
      defaultValue: 'Отправить',
    },
    {
      name: 'successMessage',
      type: 'textarea',
      label: 'Сообщение об успешной отправке',
      defaultValue: 'Спасибо! Мы свяжемся с вами в ближайшее время.',
    },
    {
      name: 'consentText',
      type: 'text',
      label: 'Текст согласия (152-ФЗ)',
      defaultValue: 'Я согласен на обработку персональных данных',
      admin: { description: 'Чекбокс согласия обязателен для отправки формы.' },
    },
    {
      name: 'consentPolicyUrl',
      type: 'text',
      label: 'Адрес политики обработки персональных данных',
      admin: { description: 'Если задан — в тексте согласия будет ссылка. Например: /politika.' },
    },
  ],
}
