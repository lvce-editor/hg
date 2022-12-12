/**
 *
 * @param {string} command
 * @param {string[]} args
 * @param {import('execa').Options} options
 * @returns
 */
export const exec = async (command, args, options) => {
  const start = performance.now()
  const { stdout, stderr } = await vscode.exec(command, args, {
    ...options,
  })
  const end = performance.now()
  return {
    stdout,
    stderr,
  }
}

export const isExecError = (error) => {
  return error && 'stderr' in error
}
