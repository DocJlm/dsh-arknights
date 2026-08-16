import { rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const lib = resolve(root, 'lib')
if (!lib.startsWith(`${root}\\`) && !lib.startsWith(`${root}/`)) {
  throw new Error(`Refusing to clean outside package root: ${lib}`)
}
await rm(lib, { recursive: true, force: true })
