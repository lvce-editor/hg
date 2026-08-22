import { build } from 'esbuild'
import { fileURLToPath } from 'node:url'

export const buildNodeProcess = async (outFile) => {
  await build({
    banner: {
      js: "import { createRequire as __createRequire } from 'node:module'; const require = __createRequire(import.meta.url);",
    },
    bundle: true,
    entryPoints: [
      fileURLToPath(
        new URL('../packages/node/src/hgProcess.js', import.meta.url),
      ),
    ],
    external: ['electron', 'node:*'],
    format: 'esm',
    outfile: outFile,
    platform: 'node',
    sourcemap: true,
    target: 'node22',
  })
}
