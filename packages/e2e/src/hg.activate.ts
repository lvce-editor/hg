import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'hg.activate'

export const test: Test = async ({ FileSystem, SideBar, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  await SideBar.open('Source Control')
}
