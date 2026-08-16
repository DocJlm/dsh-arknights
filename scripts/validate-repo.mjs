import { access, readFile, readdir, stat } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const skinsRoot = resolve(root, 'skins')
const entries = (await readdir(skinsRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .sort((a, b) => a.name.localeCompare(b.name))

if (entries.length === 0) throw new Error('At least one skin is required')

const ids = new Set()
const packages = new Set()
const wirings = new Set()

for (const entry of entries) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.name)) {
    throw new Error(`Invalid skin directory name: ${entry.name}`)
  }

  const skinRoot = resolve(skinsRoot, entry.name)
  const required = [
    'README.md',
    'LICENSE',
    'ASSETS-LICENSE.md',
    'NOTICE',
    'package.json',
    'skin.json',
    'cordis.patch.yml',
    'lib/index.js',
    'lib/client.js',
    'preview/cover.webp',
  ]

  for (const relative of required) {
    const absolute = resolve(skinRoot, relative)
    await access(absolute)
    const info = await stat(absolute)
    if (!info.isFile() || info.size === 0) throw new Error(`${entry.name}: missing or empty ${relative}`)
  }

  const pkg = JSON.parse(await readFile(resolve(skinRoot, 'package.json'), 'utf8'))
  const skin = JSON.parse(await readFile(resolve(skinRoot, 'skin.json'), 'utf8'))
  if (pkg.private !== true) throw new Error(`${entry.name}: package must remain private`)
  if (pkg.license !== 'MIT') throw new Error(`${entry.name}: source license must be MIT`)
  if (skin.author === undefined || skin.author === '') throw new Error(`${entry.name}: skin author is required`)

  for (const [set, value, label] of [
    [ids, skin.id, 'skin id'],
    [packages, pkg.name, 'package name'],
    [wirings, skin.wiring?.id, 'wiring id'],
  ]) {
    if (typeof value !== 'string' || value === '') throw new Error(`${entry.name}: ${label} is required`)
    if (set.has(value)) throw new Error(`${entry.name}: duplicate ${label} ${value}`)
    set.add(value)
  }

  const client = await readFile(resolve(skinRoot, 'lib/client.js'), 'utf8')
  if (/url\(\s*["']?https?:\/\//i.test(client)) {
    throw new Error(`${entry.name}: client bundle contains a remote CSS image URL`)
  }

  const packageFiles = [
    'lib/index.js',
    'lib/client.js',
    'cordis.patch.yml',
    'skin.json',
    'preview/cover.webp',
  ]
  let bytes = 0
  for (const relative of packageFiles) bytes += (await stat(resolve(skinRoot, relative))).size
  if (bytes > 20 * 1024 * 1024) throw new Error(`${entry.name}: runtime package exceeds 20 MiB`)
}

console.log(`validate-repo: ${entries.length} skin(s), unique metadata, complete previews and licenses`)
