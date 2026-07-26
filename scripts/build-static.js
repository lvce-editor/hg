import { exportStatic } from '@lvce-editor/shared-process'
import { fileURLToPath } from 'node:url'

await import('./build-extension.js')

await exportStatic({
  extensionPath: 'packages/extension',
  root: fileURLToPath(new URL('../', import.meta.url)),
  testPath: 'packages/e2e',
})
