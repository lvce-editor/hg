import { mkdir, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const browserOutDir = new URL('../packages/extension/dist/', import.meta.url)
const nodeOutDir = new URL('../packages/node/dist/', import.meta.url)

await Promise.all([
  rm(browserOutDir, { force: true, recursive: true }),
  rm(nodeOutDir, { force: true, recursive: true }),
])
await Promise.all([
  mkdir(browserOutDir, { recursive: true }),
  mkdir(nodeOutDir, { recursive: true }),
])
await Promise.all([
  build({
    bundle: true,
    entryPoints: [
      fileURLToPath(
        new URL('../packages/extension/src/hgMain.js', import.meta.url),
      ),
    ],
    format: 'esm',
    outfile: fileURLToPath(new URL('hgMain.js', browserOutDir)),
    platform: 'browser',
    sourcemap: true,
    external: ['electron', 'node:*'],
  }),
  build({
    bundle: true,
    entryPoints: [
      fileURLToPath(
        new URL('../packages/node/src/hgClient.js', import.meta.url),
      ),
    ],
    format: 'esm',
    outfile: fileURLToPath(new URL('hgClient.js', nodeOutDir)),
    platform: 'node',
    sourcemap: true,
  }),
])
