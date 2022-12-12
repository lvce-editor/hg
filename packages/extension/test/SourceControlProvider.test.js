import * as SourceControlProvider from '../src/parts/SourceControlProvider/SourceControlProvider.js'

test('getBadgeCount', async () => {
  expect(await SourceControlProvider.getBadgeCount()).toBe(0)
})
