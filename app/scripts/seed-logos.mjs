/* eslint-disable no-console */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import sharp from 'sharp'

const filename = fileURLToPath(import.meta.url)
const projectRoot = path.resolve(path.dirname(filename), '..')
process.chdir(projectRoot)
const configMod = await import(path.join(projectRoot, 'src/payload.config.ts'))
const config = await configMod.default

const payload = await getPayload({ config })

async function brandLogoPng(color) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 160">
    <g transform="translate(28, 36)" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M88 64v-8L52 36V19a6 6 0 0 0-12 0v17L4 56v8l36-10v22l-9 6v6l15-4 15 4v-6l-9-6V54z" />
    </g>
    <text x="130" y="108"
          font-family="-apple-system,BlinkMacSystemFont,'Inter',Arial,sans-serif"
          font-size="64" font-weight="800" fill="${color}" letter-spacing="-1.4">Основа</text>
  </svg>`
  return sharp(Buffer.from(svg)).png().toBuffer()
}

async function uploadLogo(name, buffer, alt) {
  return payload.create({
    collection: 'media',
    data: { alt },
    file: { data: buffer, mimetype: 'image/png', name, size: buffer.length },
    overrideAccess: true,
  })
}

const lightBuf = await brandLogoPng('#0a0a0b')
const darkBuf = await brandLogoPng('#ffffff')

const light = await uploadLogo('demo-logo-light.png', lightBuf, 'Логотип «Основа» (для светлой темы)')
const dark = await uploadLogo('demo-logo-dark.png', darkBuf, 'Логотип «Основа» (для тёмной темы)')

await payload.updateGlobal({
  slug: 'settings',
  data: { logo: light.id, logoDark: dark.id },
  overrideAccess: true,
})

console.log(`✓ logo (light) → media #${light.id}`)
console.log(`✓ logoDark    → media #${dark.id}`)
console.log('✓ settings обновлены')

process.exit(0)
