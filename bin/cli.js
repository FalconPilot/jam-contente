#!/usr/bin/env node
import { cac } from 'cac'
import { startDev } from '../src/cli'
import { buildBundle } from '../src/cli/build'

const cli = cac('jam-contente')

cli
  .command('dev', 'Start dev server')
  .option('--port <port>', 'Port', { default: 3637 })
  .action(options => startDev(options))

cli
  .command('build', 'Emit a production build')
  .action(() => buildBundle())

cli.help()
cli.parse()
