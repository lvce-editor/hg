import { fileURLToPath } from 'node:url'
import { execa } from 'execa'

const getActualOptions = (options) => {
  if (options?.cwd?.startsWith('file://')) {
    return {
      ...options,
      cwd: fileURLToPath(options.cwd),
    }
  }
  return options
}

export const exec = async (command, args, options) => {
  const { stdout, stderr, exitCode } = await execa(
    command,
    args,
    getActualOptions(options),
  )
  return {
    stdout,
    stderr,
    exitCode,
  }
}
