import { spawn } from 'node:child_process'
import type { Endpoint, PayloadRequest } from 'payload'

function isAdminUser(user: PayloadRequest['user']): boolean {
  if (!user || !('roles' in user)) return false
  const roles = (user as { roles?: unknown }).roles
  return Array.isArray(roles) && roles.includes('admin')
}

function timestamp(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`
}

export const backupEndpoint: Endpoint = {
  path: '/backup',
  method: 'get',
  handler: async (req) => {
    if (!isAdminUser(req.user)) {
      return new Response('Доступ только для администратора', { status: 403 })
    }

    const uri = process.env.DATABASE_URI
    if (!uri) {
      return new Response('DATABASE_URI не задан', { status: 500 })
    }

    let parsed: URL
    try {
      parsed = new URL(uri)
    } catch {
      return new Response('DATABASE_URI повреждён', { status: 500 })
    }

    const args = [
      '-h',
      parsed.hostname,
      '-p',
      parsed.port || '5432',
      '-U',
      decodeURIComponent(parsed.username),
      '-d',
      parsed.pathname.replace(/^\//, ''),
      '--no-owner',
      '--no-acl',
    ]

    const env: NodeJS.ProcessEnv = {
      ...process.env,
      PGPASSWORD: decodeURIComponent(parsed.password),
    }

    let proc: ReturnType<typeof spawn>
    try {
      proc = spawn('pg_dump', args, { env })
    } catch (err) {
      return new Response(
        `Не удалось запустить pg_dump. Убедитесь, что он установлен на сервере. Ошибка: ${String(err)}`,
        { status: 500 },
      )
    }

    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        proc.stdout?.on('data', (chunk: Buffer) => controller.enqueue(new Uint8Array(chunk)))
        proc.stderr?.on('data', (chunk: Buffer) => {
          req.payload.logger.error(`pg_dump: ${chunk.toString()}`)
        })
        proc.on('error', (err) => controller.error(err))
        proc.on('close', (code) => {
          if (code === 0) controller.close()
          else controller.error(new Error(`pg_dump упал с кодом ${code}`))
        })
      },
      cancel() {
        proc.kill()
      },
    })

    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'application/sql; charset=utf-8',
        'Content-Disposition': `attachment; filename="osnova-${timestamp()}.sql"`,
        'Cache-Control': 'no-store',
      },
    })
  },
}
