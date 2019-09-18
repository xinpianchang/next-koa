import spawn from 'cross-spawn'
import { NextCommandDevOptions, RunDev } from './next-test-utils'

export * from './next-test-utils'

export interface NodeCommandOptions extends NextCommandDevOptions {
  cwd?: string;
}

export function launchKoaApp(entry: string, port: number) {
  return runNodeCommand(["-r", "ts-node/register", entry], false, {
    env: {
      PORT: String(port),
      TS_NODE_FILES: 'true'
    }
  })
}

export function runNodeCommand<S extends boolean = false>(argv: Array<string | number>, stdOut?: S, opts: NodeCommandOptions = {}): RunDev<S> {
  const cwd = opts.cwd || process.cwd()
  const env = {
    ...process.env,
    NODE_ENV: undefined,
    __NEXT_TEST_MODE: 'true',
    ...opts.env
  }

  return new Promise<any>((resolve, reject) => {
    console.info(`Running command "node ${argv.join(' ')}"`)
    const instance = spawn('node', [...argv.map(String)], { cwd, env })

    function handleStdout(data: object) {
      const message = data.toString()
      if (/ready on/i.test(message)) {
        resolve(stdOut ? message : instance)
      }
      if (typeof opts.onStdout === 'function') {
        opts.onStdout(message)
      }
      process.stdout.write(message)
    }

    function handleStderr(data: object) {
      const message = data.toString()
      if (typeof opts.onStderr === 'function') {
        opts.onStderr(message)
      }
      process.stderr.write(message)
    }

    instance.stdout.on('data', handleStdout)
    instance.stderr.on('data', handleStderr)

    instance.on('close', () => {
      instance.stdout.removeListener('data', handleStdout)
      instance.stderr.removeListener('data', handleStderr)
    })

    instance.on('error', err => {
      reject(err)
    })
  }) as RunDev<S>
}