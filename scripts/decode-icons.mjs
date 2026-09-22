import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'public')
const scripts = join(root, 'scripts')
mkdirSync(out, { recursive: true })

function readB64(name) {
  const combined = join(scripts, 'icons.b64.json')
  if (existsSync(combined)) {
    const icons = JSON.parse(readFileSync(combined, 'utf8'))
    if (icons[name]) return icons[name].trim()
  }
  const single = join(scripts, name + '.b64')
  if (existsSync(single)) return readFileSync(single, 'utf8').trim()
  // concatenated parts: name.b64.p00, p01, ...
  const prefix = name + '.b64.p'
  const parts = readdirSync(scripts)
    .filter((f) => f.startsWith(prefix))
    .sort()
  if (!parts.length) throw new Error('missing b64 for ' + name)
  return parts.map((f) => readFileSync(join(scripts, f), 'utf8').trim()).join('')
}

for (const name of ['app-icon.png', 'favicon-32.png', 'apple-touch-icon.png']) {
  const b64 = readB64(name)
  const buf = Buffer.from(b64, 'base64')
  writeFileSync(join(out, name), buf)
  console.log('wrote', name, buf.length)
}
