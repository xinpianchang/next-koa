import fetch, { RequestInit } from 'node-fetch'
import qs from 'querystring'
import http from 'http'
import express from 'express'
import path from 'path'
import getPort from 'get-port'
import spawn from 'cross-spawn'
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs'
import treeKill from 'tree-kill'

// `next` here is the symlink in `test/node_modules/next` which points to the root directory.
// This is done so that requiring from `next` works.
// The reason we don't import the relative path `../../dist/<etc>` is that it would lead to inconsistent module singletons
import { ChildProcess, SpawnOptions } from 'child_process'
import Server from 'next-server/dist/server/next-server'

export function initNextServerScript (
  scriptPath: string,
  successRegexp: RegExp,
  env: any,
  failRegexp: RegExp,
): Promise<ChildProcess> {
  return new Promise((resolve, reject) => {
    const instance = spawn('node', [scriptPath], { env })

    function handleStdout(data: object) {
      const message = data.toString()
      if (successRegexp.test(message)) {
        resolve(instance)
      }
      process.stdout.write(message)
    }

    function handleStderr (data) {
      const message = data.toString()
      if (failRegexp && failRegexp.test(message)) {
        instance.kill()
        return reject(new Error('received failRegexp'))
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
  })
}

export function renderViaAPI(app: Server, pathname: string, query?: any) {
  const url = `${pathname}${query ? `?${qs.stringify(query)}` : ''}`
  return app.renderToHTML({ url } as http.IncomingMessage, {} as http.ServerResponse, pathname, query)
}

export function renderViaHTTP(appPort: number, pathname: string, query?: any) {
  return fetchViaHTTP(appPort, pathname, query).then(res => res.text())
}

export function fetchViaHTTP(appPort: number, pathname: string, query?: any, opts?: RequestInit) {
  const url = `http://localhost:${appPort}${pathname}${
    query ? `?${qs.stringify(query)}` : ''
  }`
  return fetch(url, opts)
}

export function findPort() {
  return getPort()
}

export interface NextCommandOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  spawnOptions?: SpawnOptions;
  instance?: (instance: ChildProcess) => void;
  stderr?: boolean;
  stdout?: boolean;
}

export function runNextCommand(argv: Array<string | number>, options: NextCommandOptions = {}) {
  const nextDir = path.dirname(require.resolve('next/package'))
  const nextBin = path.join(nextDir, 'dist/bin/next')
  const cwd = options.cwd || nextDir
  // Let Next.js decide the environment
  const env: NodeJS.ProcessEnv = { ...process.env, ...options.env, NODE_ENV: undefined }

  return new Promise<{
    stdout: string;
    stderr: string;
  }>((resolve, reject) => {
    console.info(`Running command "next ${argv.join(' ')}"`)
    const instance = spawn('node', [nextBin, ...argv.map(String)], {
      ...options.spawnOptions,
      cwd,
      env,
      stdio: ['ignore', 'pipe', 'pipe']
    })

    if (typeof options.instance === 'function') {
      options.instance(instance)
    }

    let stderrOutput = ''
    if (options.stderr) {
      instance.stderr.on('data', chunk => {
        stderrOutput += chunk
      })
    }

    let stdoutOutput = ''
    if (options.stdout) {
      instance.stdout.on('data', chunk => {
        stdoutOutput += chunk
      })
    }

    instance.on('close', () => {
      resolve({
        stdout: stdoutOutput,
        stderr: stderrOutput
      })
    })

    instance.on('error', err => {
      const error = err as any
      error.stdout = stdoutOutput
      error.stderr = stderrOutput
      reject(error)
    })
  })
}

export interface NextCommandDevOptions {
  env?: Partial<NodeJS.ProcessEnv>;
  onStdout?: (message: string) => void;
  onStderr?: (message: string) => void;
}

export type RunDev<S extends boolean> = S extends true ? Promise<string> : Promise<ChildProcess>

export function runNextCommandDev<S extends boolean = false>(argv: Array<string | number>, stdOut?: S, opts: NextCommandDevOptions = {}): RunDev<S> {
  const cwd = path.dirname(require.resolve('next/package'))
  const env = {
    ...process.env,
    NODE_ENV: undefined,
    __NEXT_TEST_MODE: 'true',
    ...opts.env
  }

  return new Promise<any>((resolve, reject) => {
    const instance = spawn('node', ['dist/bin/next', ...argv.map(String)], { cwd, env })

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

// Launch the app in dev mode.
export function launchApp(dir: string, port: number, opts: NextCommandDevOptions = {}) {
  return runNextCommandDev([dir, '-p', port], false, opts)
}

export function nextBuild(dir: string, args: Array<string | number> = [], opts: NextCommandOptions = {}) {
  return runNextCommand(['build', dir, ...args], opts)
}

export function nextExport(dir: string, { outdir }: { outdir: string, [key: string]: any; }) {
  return runNextCommand(['export', dir, '--outdir', outdir])
}

export function nextStart(dir: string, port: number, opts: NextCommandDevOptions = {}) {
  return runNextCommandDev(['start', '-p', port, dir], false, opts)
}

export function buildTS(args: Array<string | number> = [], cwd?: string, env: NodeJS.ProcessEnv = {} as NodeJS.ProcessEnv) {
  cwd = cwd || path.dirname(require.resolve('next/package'))
  env = { ...process.env, NODE_ENV: undefined, ...env }

  return new Promise<void>((resolve, reject) => {
    const instance = spawn(
      'node',
      [require.resolve('typescript/lib/tsc'), ...args.map(String)],
      { cwd, env }
    )
    let output = ''

    const handleData = (chunk: object) => {
      output += chunk.toString()
    }

    instance.stdout.on('data', handleData)
    instance.stderr.on('data', handleData)

    instance.on('exit', code => {
      if (code) {
        return reject(new Error('exited with code: ' + code + '\n' + output))
      }
      resolve()
    })
  })
}

// Kill a launched app
export async function killApp(instance: ChildProcess) {
  await new Promise((resolve, reject) => {
    treeKill(instance.pid, err => {
      if (err) {
        if (
          process.platform === 'win32' &&
          typeof err.message === 'string' &&
          (err.message.includes(`no running instance of the task`) ||
            err.message.includes(`not found`))
        ) {
          // Windows throws an error if the process is already dead
          //
          // Command failed: taskkill /pid 6924 /T /F
          // ERROR: The process with PID 6924 (child process of PID 6736) could not be terminated.
          // Reason: There is no running instance of the task.
          return resolve()
        }
        return reject(err)
      }

      resolve()
    })
  })
}

export interface ServerApp extends http.Server {
  __app: Server;
}

export async function startApp(app: Server) {
  await app.prepare()
  const handler = app.getRequestHandler()
  const server = http.createServer(handler) as ServerApp
  server.__app = app

  await promiseCall(server, 'listen')
  return server
}

export async function stopApp(server: ServerApp) {
  if (server.__app) {
    await (server.__app as any).close()
  }
  await promiseCall(server, 'close')
}

function promiseCall<T = void>(obj: any, method: string, ...args: any[]) {
  return new Promise<T>((resolve, reject) => {
    const newArgs = [
      ...args,
      (err: any, res: T) => {
        if (err) {
          return reject(err)
        }
        resolve(res)
      }
    ]

    obj[method](...newArgs)
  })
}

export function waitFor(millis: number) {
  return new Promise<void>(resolve => setTimeout(resolve, millis))
}

export async function startStaticServer(dir: string) {
  const app = express()
  const server = http.createServer(app)
  app.use(express.static(dir))

  await promiseCall(server, 'listen')
  return server
}

export async function check(contentFn: () => string | Promise<string>, regex: RegExp) {
  let found = false
  const timeout = setTimeout(async () => {
    if (found) {
      return
    }
    let content: string
    try {
      content = await contentFn()
    } catch (err) {
      // tslint:disable-next-line: no-console
      console.error('Error while getting content', { regex })
    }
    // tslint:disable-next-line: no-console
    console.error('TIMED OUT CHECK: ', { regex, content })
    throw new Error('TIMED OUT: ' + regex + '\n\n' + content)
  }, 1000 * 30)
  while (!found) {
    try {
      const newContent = await contentFn()
      if (regex.test(newContent)) {
        found = true
        clearTimeout(timeout)
        break
      }
      await waitFor(1000)
    } catch (ex) {}
  }
}

export interface File {
  path: string;
  originalContent: string | null;
}

export class File {
  constructor(path: string) {
    this.path = path
    this.originalContent = existsSync(this.path)
      ? readFileSync(this.path, 'utf8')
      : null
  }

  public write(content: string) {
    if (!this.originalContent) {
      this.originalContent = content
    }
    writeFileSync(this.path, content, 'utf8')
  }

  public replace(pattern: string | RegExp, newValue: string) {
    const newContent = this.originalContent.replace(pattern, newValue)
    this.write(newContent)
  }

  public delete() {
    unlinkSync(this.path)
  }

  public restore() {
    this.write(this.originalContent)
  }
}

// react-error-overlay uses an iframe so we have to read the contents from the frame
export async function getReactErrorOverlayContent(browser: any) {
  let found = false
  setTimeout(() => {
    if (found) {
      return
    }
    // tslint:disable-next-line: no-console
    console.error('TIMED OUT CHECK FOR IFRAME')
    throw new Error('TIMED OUT CHECK FOR IFRAME')
  }, 1000 * 30)
  while (!found) {
    try {
      await browser.waitForElementByCss('iframe', 10000)

      const hasIframe = await browser.hasElementByCssSelector('iframe')
      if (!hasIframe) {
        throw new Error('Waiting for iframe')
      }

      found = true
      return browser.eval(
        `document.querySelector('iframe').contentWindow.document.body.innerHTML`
      )
    } catch (ex) {
      await waitFor(1000)
    }
  }
  return browser.eval(
    `document.querySelector('iframe').contentWindow.document.body.innerHTML`
  )
}

export function getBrowserBodyText(browser: any) {
  return browser.eval('document.getElementsByTagName("body")[0].innerText')
}
