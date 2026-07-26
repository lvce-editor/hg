import * as SourceControlProvider from '../src/parts/SourceControlProvider/SourceControlProvider.js'

test('getBadgeCount', async () => {
  expect(await SourceControlProvider.getBadgeCount()).toBe(0)
})

test('isActive skips unsupported schemes', async () => {
  expect(await SourceControlProvider.isActive('memfs', '/workspace')).toBe(
    false,
  )
})

test('isActive skips an empty root', async () => {
  expect(await SourceControlProvider.isActive('file', '')).toBe(false)
})
