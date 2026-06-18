import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const slug = url.searchParams.get('slug')
  if (!slug) return new Response('Не указан slug', { status: 400 })

  const payload = await getPayload({ config: await config })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) return new Response('Требуется вход в админку', { status: 401 })

  const found = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
    draft: true,
    overrideAccess: false,
    user,
  })
  if (!found.docs[0]) return new Response('Страница не найдена', { status: 404 })

  const draft = await draftMode()
  draft.enable()
  redirect(`/${slug}`)
}
