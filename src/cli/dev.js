import { createServer } from 'vite'

import resolveConfig from '../src/vite.config'

export const startDev = async (options) => {
  const server = await createServer({
    ...resolveConfig(),
    server: { port: options.port },
  })

  await server.listen()
  server.printUrls()
}

