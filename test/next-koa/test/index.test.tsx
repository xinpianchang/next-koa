import path from 'path'
import { launchKoaApp, findPort, renderViaHTTP, killApp, fetchViaHTTP, renderJSONViaHTTP } from '../../next-koa-test-utils'

const serverEntry = path.resolve(__dirname, '..', 'server')
const NEXT_DATA_PATTERN = /<script id="__NEXT_DATA__" [^>]*>(.*?)<\/script>/

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 2

describe('start next-koa server', () => {

  let appPort: number
  let server: any
  let homepageHTML: string
  let nextConfig: any
  let nextFetch: string
  

  beforeAll(async () => {
    appPort = await findPort()
    server = await launchKoaApp(serverEntry, appPort)
    homepageHTML = await renderViaHTTP(appPort, '/')
  })

  afterAll(() => killApp(server))

  test('SSR render with the expected DOM', async () => {
    expect(homepageHTML).toContain('<title>hello world</title>')
    expect(homepageHTML).toContain('<a href="/"')
    expect(homepageHTML).toMatch(NEXT_DATA_PATTERN)
    nextConfig = JSON.parse(homepageHTML.match(NEXT_DATA_PATTERN)[1].trim())
    const { runtimeConfig: { nextKoaConfig: { nextFetch: _nextFetch = 'header' } = {} } = {} } = nextConfig
    nextFetch = _nextFetch
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

  test.skip('wait a minute for browser test', done => setTimeout(done, 60000))
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