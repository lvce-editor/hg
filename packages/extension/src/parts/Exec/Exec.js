import { createNodeRpc } from '@lvce-editor/api'

const state = {
  rpcPromise: undefined,
}

const getRpc = () => {
  if (!state.rpcPromise) {
    state.rpcPromise = createNodeRpc({
      id: 'builtin.hg.node',
    })
  }
  return state.rpcPromise
}

export const exec = async (command, args, options) => {
  const rpc = await getRpc()
  return rpc.invoke('Exec.exec', command, args, options)
}

export const isExecError = (error) => {
  return error && 'stderr' in error
}
