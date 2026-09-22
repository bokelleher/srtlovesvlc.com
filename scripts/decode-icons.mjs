import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'public')
mkdirSync(out, { recursive: true })

for (const name of ['app-icon.png', 'favicon-32.png', 'apple-touch-icon.png']) {
  const b64path = join(root, 'scripts', name + '.b64')
  if (!existsSync(b64path)) throw new Error('missing ' + b64path)
  const b64 = readFileSync(b64path, 'utf8').trim()
  const buf = Buffer.from(b64, 'base64')
  writeFileSync(join(out, name), buf)
  console.log('wrote', name, buf.length)
}
