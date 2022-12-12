import * as Exec from '../Exec/Exec.js'

export const id = 'hg'

export const label = 'Hg'

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
  const cwd = vscode.getWorkspaceFolder()
  const { stdout } = await Exec.exec('hg', ['status'], { cwd })
  const lines = stdout.split('\n')
  console.log({ stdout })
  return parseStatusLines(lines)
}

export const fetch = () => {}

export const statusBarCommands = []
