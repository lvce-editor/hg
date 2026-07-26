import { readFileSync } from 'node:fs'

const manifestUrl = new URL('../extension.json', import.meta.url)
const manifest = JSON.parse(readFileSync(manifestUrl, 'utf8'))

test('uses the isolated extension api', () => {
  expect(manifest.browser).toBe('dist/hgMain.js')
  expect(manifest.isolated).toBe(true)
})

test('declares the hg node rpc', () => {
  expect(manifest.rpc).toContainEqual({
    id: 'builtin.hg.node',
    name: 'Hg',
    type: 'node',
    url: '../node/dist/hgClient.js',
  })
})
