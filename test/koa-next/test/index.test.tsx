import React from 'react'
// import Koa from 'koa'
// import { shallow } from 'enzyme'
// import http from 'http'
// import Page from '../pages/index'
// import App, { NextApp } from '../../../lib/index'
import path from 'path'
import { launchKoaApp, findPort, renderViaHTTP, killApp } from '../../koa-next-test-utils'

const serverEntry = path.resolve(__dirname, '..', 'server')

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 2

describe('Koa-Next', () => {

  let appPort: number
  let server: any

  beforeAll(async () => {
    // koa = new Koa()
    // server = http.createServer(koa.callback())

    appPort = await findPort()
    server = await launchKoaApp(serverEntry, appPort)

    await Promise.all([renderViaHTTP(appPort, '/')])

    // app = App({ dev: true, dir: exampleDir })
    // koa.use(app.middleware)
    // await new Promise(done => server.listen(done))
    // await app.prepare()
  })

  afterAll(() => killApp(server))

  test('should render without throwing an error', async () => {
    expect(5).toBe(5)
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