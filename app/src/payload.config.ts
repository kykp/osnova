import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en } from '@payloadcms/translations/languages/en'
import { ru } from '@payloadcms/translations/languages/ru'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { News } from './collections/News'
import { Documents } from './collections/Documents'
import { Staff } from './collections/Staff'
import { FormSubmissions } from './collections/FormSubmissions'
import { backupEndpoint } from './endpoints/backup'
import { formSubmissionEndpoint } from './endpoints/formSubmission'
import { MainMenu } from './globals/MainMenu'
import { Settings } from './globals/Settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const smtpHost = process.env.SMTP_HOST
const email = smtpHost
  ? nodemailerAdapter({
      defaultFromAddress: process.env.SMTP_FROM_ADDRESS || 'noreply@example.com',
      defaultFromName: process.env.SMTP_FROM_NAME || 'Osnova',
      transportOptions: {
        host: smtpHost,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: process.env.SMTP_USER
          ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD,
            }
          : undefined,
      },
    })
  : undefined

export default buildConfig({
  admin: {
    user: Users.slug,
    dateFormat: 'dd.MM.yyyy HH:mm',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      afterNavLinks: ['@/components/BackupLink/BackupLink#BackupLink'],
      graphics: {
        Logo: '@/components/AdminBranding/Logo#Logo',
        Icon: '@/components/AdminBranding/Icon#Icon',
      },
    },
  },
  collections: [Users, Media, Pages, News, Documents, Staff, FormSubmissions],
  globals: [Settings, MainMenu],
  endpoints: [backupEndpoint, formSubmissionEndpoint],
  editor: lexicalEditor(),
  email,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  i18n: {
    supportedLanguages: { ru, en },
    fallbackLanguage: 'ru',
  },
  localization: {
    locales: ['ru'],
    defaultLocale: 'ru',
    fallback: true,
  },
})
