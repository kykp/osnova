import type { Endpoint } from 'payload'

const allowedFields = new Set(['name', 'phone', 'email', 'message', 'source'])

export const formSubmissionEndpoint: Endpoint = {
  path: '/form-submission',
  method: 'post',
  handler: async (req) => {
    let body: Record<string, unknown> = {}
    try {
      body = await req.json!()
    } catch {
      return Response.json({ error: 'Некорректный запрос' }, { status: 400 })
    }

    const data: Record<string, string> = {}
    for (const [key, value] of Object.entries(body)) {
      if (allowedFields.has(key) && typeof value === 'string' && value.trim()) {
        data[key] = value.trim().slice(0, 2000)
      }
    }

    if (!data.name) {
      return Response.json({ error: 'Укажите имя.' }, { status: 400 })
    }
    if (!data.phone && !data.email) {
      return Response.json(
        { error: 'Укажите телефон или e-mail для связи.' },
        { status: 400 },
      )
    }

    const created = await req.payload.create({
      collection: 'form-submissions',
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        message: data.message,
        source: data.source,
      },
      overrideAccess: true,
    })

    try {
      const settings = await req.payload.findGlobal({ slug: 'settings' })
      const notifyEmail = settings.contactEmail
      if (notifyEmail && req.payload.email) {
        const lines = [
          `Имя: ${data.name}`,
          data.phone ? `Телефон: ${data.phone}` : null,
          data.email ? `E-mail: ${data.email}` : null,
          data.message ? `Сообщение: ${data.message}` : null,
          data.source ? `Источник: ${data.source}` : null,
        ].filter(Boolean)
        await req.payload.sendEmail({
          to: notifyEmail,
          subject: 'Новая заявка с сайта',
          text: lines.join('\n'),
        })
      }
    } catch (e) {
      req.payload.logger.error({ msg: 'Не удалось отправить уведомление о заявке', err: e })
    }

    return Response.json({ ok: true, id: created.id })
  },
}
