import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'public')
mkdirSync(out, { recursive: true })

const combined = join(root, 'scripts/icons.b64.json')
if (existsSync(combined)) {
  const icons = JSON.parse(readFileSync(combined, 'utf8'))
  for (const [name, b64] of Object.entries(icons)) {
    writeFileSync(join(out, name), Buffer.from(b64, 'base64'))
    console.log('wrote', name, Buffer.from(b64, 'base64').length)
  }
} else {
  for (const name of ['app-icon.png', 'favicon-32.png', 'apple-touch-icon.png']) {
    const b64 = readFileSync(join(root, 'scripts', name + '.b64'), 'utf8').trim()
    writeFileSync(join(out, name), Buffer.from(b64, 'base64'))
    console.log('wrote', name, Buffer.from(b64, 'base64').length)
  }
}
