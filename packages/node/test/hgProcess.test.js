import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import {
  NodeForkedProcessRpcParent,
  WebSocketRpcParent,
} from '@lvce-editor/rpc'
import { buildNodeProcess } from '../../../scripts/build-node-process.js'

test('starts the packaged Hg process and invokes a representative command', async () => {
  const temporaryDirectory = await mkdtemp(
    join(tmpdir(), 'builtin-hg-node-process-'),
  )
  const server = createServer()
  let controlRpc
  let rpc
  try {
    const outFile = join(temporaryDirectory, 'hgProcess.js')
    await buildNodeProcess(outFile)
    controlRpc = await NodeForkedProcessRpcParent.create({
      commandMap: {},
      path: outFile,
    })
    const { promise: attached, reject, resolve } = Promise.withResolvers()
    server.on('upgrade', (request, socket) => {
      socket.pause()
      const serializableRequest = {
        headers: request.headers,
        method: request.method,
        url: request.url,
      }
      controlRpc
        .invokeAndTransfer(
          'NodeRpcProcess.handleWebSocket',
          socket,
          serializableRequest,
        )
        .then(resolve, reject)
    })
    await new Promise((resolve, reject) => {
      server.once('error', reject)
      server.listen(0, '127.0.0.1', resolve)
    })
    const address = server.address()
    assert.ok(address && typeof address === 'object')
    const webSocket = new WebSocket(`ws://127.0.0.1:${address.port}`)
    rpc = await WebSocketRpcParent.create({ commandMap: {}, webSocket })
    await attached

    const result = await rpc.invoke(
      'Exec.exec',
      process.execPath,
      ['-e', 'process.stdout.write("hg-process-ok")'],
      {},
    )

    assert.equal(result.stdout, 'hg-process-ok')
    assert.equal(result.exitCode, 0)
  } finally {
    await rpc?.dispose()
    await controlRpc?.dispose()
    server.closeAllConnections()
    await new Promise((resolve) => server.close(resolve))
    await rm(temporaryDirectory, { force: true, recursive: true })
  }
})
