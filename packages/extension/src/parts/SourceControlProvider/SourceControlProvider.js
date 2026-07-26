import { getPreference, getWorkspaceFolder } from '@lvce-editor/api'
import * as Exec from '../Exec/Exec.js'

export const id = 'hg'

export const label = 'Hg'

const supportedSchemes = ['', 'file']

const getHgPath = async () => {
  const configuredPath = await getPreference('hg.path')
  return typeof configuredPath === 'string' && configuredPath
    ? configuredPath
    : 'hg'
}

export const isActive = async (scheme, root) => {
  if (!root || !supportedSchemes.includes(scheme)) {
    return false
  }
  try {
    const hgPath = await getHgPath()
    await Exec.exec(hgPath, ['id'], { cwd: root })
    return true
  } catch {
    return false
  }
}
export const acceptInput = () => {}

export const getBadgeCount = async (cwd) => {
  return 0
}

const parseStatusLine = (line) => {
  const status = line[0]
  switch (status) {
    case '?':
      return {
        file: line.slice(2),
        status: 'modified',
      }
    default:
      return {
        file: '',
        status: '',
      }
  }
}

const parseStatusLines = (lines) => {
  return lines.map(parseStatusLine)
}

export const getChangedFiles = async () => {
  const cwd = await getWorkspaceFolder()
  const hgPath = await getHgPath()
  const { stdout } = await Exec.exec(hgPath, ['status'], { cwd })
  const lines = stdout.split('\n')
  return parseStatusLines(lines).filter((item) => item.file)
}

export const fetch = () => {}

export const statusBarCommands = []
