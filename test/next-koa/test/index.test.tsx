import path from 'path'
import { launchKoaApp, findPort, renderViaHTTP, killApp, fetchViaHTTP, renderJSONViaHTTP } from '../../next-koa-test-utils'
import nextConfig from '../next.config'

const { publicRuntimeConfig: { nextKoaConfig: { nextFetch = 'header' } = {} } = {} } = nextConfig
const serverEntry = path.resolve(__dirname, '..', 'server')

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 2

describe('start next-koa server', () => {

  let appPort: number
  let server: any

  beforeAll(async () => {
    appPort = await findPort()
    server = await launchKoaApp(serverEntry, appPort)
  })

  afterAll(() => killApp(server))

  test('SSR render with the expected DOM', async () => {
    const result = await renderViaHTTP(appPort, '/')
    expect(result).toContain('<title>hello world</title>')
    expect(result).toContain('<a href="/"')
  })

  test('CSR render with a next-fetch request', async () => {
    expect(nextFetch).toMatch(/(header|param)/)

    let response
    
    if (nextFetch === 'header') {
      response = await fetchViaHTTP(appPort, '/', {}, {
        headers: {
          'X-Requested-With': 'Next-Fetch'
        }
      })
    } else if (nextFetch === 'param') {
      response = await fetchViaHTTP(appPort, '/?next_fetch=json')
    }
    const json = await response.json()
    expect(json.title).toBe('hello world')
    expect(json.homepage).toBe('/')
  })

  test('API test for method /api/hello', async () => {
    const json = await renderJSONViaHTTP(appPort, '/api/hello')
    expect(json).toEqual({ hello: 'world' })
  })

  test('about page withLayout test', async () => {
    const result = await renderViaHTTP(appPort, '/about')
    expect(result).toContain('<div style="font-size:20px">')
  })
})

// describe('Index', () => {
//   let appPort: number
//   let server: any
//   let koa: Koa
//   let app: NextApp

//   beforeAll(async () => {
//     // koa = new Koa()
//     // server = http.createServer(koa.callback())

//     appPort = await findPort()
//     server = await launchApp(exampleDir, appPort)

//     await Promise.all([renderViaHTTP(appPort, '/')])

//     // app = App({ dev: true, dir: exampleDir })
//     // koa.use(app.middleware)
//     // await new Promise(done => server.listen(done))
//     // await app.prepare()
//   })

//   afterAll(() => killApp(server))

//   test('should render without throwing an error', async () => {
//     // await new Promise(resolve => setTimeout(resolve, 3000))
//     // const wrap = shallow(<Page />)
//     // expect(wrap.find('div').text()).toBe('Hello Next.js')
//   })
// })