import path from 'path'
import { launchKoaApp, findPort, renderViaHTTP, killApp } from '../../koa-next-test-utils'

const serverEntry = path.resolve(__dirname, '..', 'server')

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 2

describe('start Koa-Next server', () => {

  let appPort: number
  let server: any

  beforeAll(async () => {
    appPort = await findPort()
    server = await launchKoaApp(serverEntry, appPort)
  })

  afterAll(() => killApp(server))

  test('should render without throwing an error', async () => {
    const renderResult = await renderViaHTTP(appPort, '/')
    // console.log(renderResult)
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