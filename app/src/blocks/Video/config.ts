import type { Block } from 'payload'

import { blockAdmin } from '../_shared/blockAdmin'
import { enabledField } from '../_shared/enabledField'

export const VideoBlock: Block = {
  slug: 'video',
  labels: {
    singular: 'Контент — Видео',
    plural: 'Контент — Видео',
  },
  admin: blockAdmin('Контент — Видео'),
  imageURL: '/block-previews/video.svg',
  imageAltText: 'Превью: плеер с кнопкой воспроизведения',
  fields: [
    enabledField,
    {
      name: 'heading',
      type: 'text',
      label: 'Заголовок секции',
    },
    {
      name: 'provider',
      type: 'select',
      label: 'Источник',
      required: true,
      defaultValue: 'youtube',
      options: [
        { label: 'YouTube', value: 'youtube' },
        { label: 'Rutube', value: 'rutube' },
        { label: 'VK Видео', value: 'vk' },
        { label: 'Kinescope', value: 'kinescope' },
      ],
    },
    {
      name: 'url',
      type: 'text',
      label: 'Ссылка на видео',
      required: true,
      admin: {
        description:
          'Полный адрес видео из браузерной строки. Например: https://www.youtube.com/watch?v=…, https://rutube.ru/video/…, https://vkvideo.ru/video-…, https://kinescope.io/…',
      },
    },
    {
      name: 'ratio',
      type: 'select',
      label: 'Соотношение сторон',
      defaultValue: '16:9',
      options: [
        { label: '16:9 (горизонтальное)', value: '16:9' },
        { label: '4:3', value: '4:3' },
        { label: '1:1 (квадрат)', value: '1:1' },
        { label: '9:16 (вертикальное)', value: '9:16' },
      ],
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Подпись под видео',
    },
  ],
}
