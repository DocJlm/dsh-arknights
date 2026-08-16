import { access, readFile, stat } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const required = [
  'lib/index.js',
  'lib/client.js',
  'cordis.patch.yml',
  'skin.json',
  'package.json',
  'README.md',
  'LICENSE',
  'ASSETS-LICENSE.md',
  'NOTICE',
  'preview/cover.webp',
  'assets/arknights-garden-day-v3.webp',
  'assets/arknights-garden-night-v3.webp',
  'assets/arknights-character-left-v3.webp',
  'assets/arknights-character-right-v3.webp',
]

let bytes = 0
for (const relative of required) {
  const absolute = resolve(root, relative)
  await access(absolute)
  const info = await stat(absolute)
  if (!info.isFile() || info.size === 0) throw new Error(`Missing or empty artifact: ${relative}`)
  bytes += info.size
}

const client = await readFile(resolve(root, 'lib/client.js'), 'utf8')
for (const marker of ['ui-skin-arknights', 'data-dsh-arknights', '欢迎回家，博士！', 'data:image/webp;base64,']) {
  if (!client.includes(marker)) throw new Error(`Client bundle is missing marker: ${marker}`)
}
if (/url\(\s*["']?https?:\/\//i.test(client)) throw new Error('Client bundle contains a remote CSS image URL')

const limit = 20 * 1024 * 1024
if (bytes > limit) throw new Error(`Runtime package exceeds 20 MiB: ${bytes} bytes`)
console.log(`verify-package: ${required.length} artifacts, ${bytes} bytes (< 20 MiB), no remote image URLs`)
