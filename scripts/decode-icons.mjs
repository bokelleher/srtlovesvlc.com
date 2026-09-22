import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const icons = JSON.parse(readFileSync(join(root, 'scripts/icons.b64.json'), 'utf8'))
const out = join(root, 'public')
mkdirSync(out, { recursive: true })
for (const [name, b64] of Object.entries(icons)) {
  writeFileSync(join(out, name), Buffer.from(b64, 'base64'))
  console.log('wrote', name, Buffer.from(b64, 'base64').length)
}
