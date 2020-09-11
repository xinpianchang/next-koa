import Koa from 'koa'
import NextKoa from '../../../src/server/index'
import http from 'http'
import path from 'path'
import Router from 'koa2-router'
import { IncomingMessage, ServerResponse } from 'http'

const dir = path.resolve(__dirname, '..')

const app = new Koa()
const next = NextKoa({
  dev: process.env.NODE_ENV !== 'production',
  dir,
})

app.use(next.middleware)

const router = new Router()
app.use((ctx, next) => {
  ctx.state.homepage = '/'
  return next()
})

router.get('/ssr_redirect_about', ctx => ctx.renderRedirect('/about'))
router.get('/aboutpage', ctx => ctx.render('/about', {},  null, ctx.params))

router.get('/:id/test', ctx => {
  return ctx.render('/[id]/test' , { title: 'test' }, null, ctx.params)
})
router.get('/', ctx => ctx.render('/', { title: 'hello world' }, ctx.query, ctx.params))
app.use(router)

const server = http.createServer(app.callback())
const port = process.env.PORT || 3000
server.listen(process.env.PORT || 3000, () => {
  console.info('server is ready on port', port)
})


const callback = app.callback()

export default async (req: IncomingMessage, res: ServerResponse) => {
  callback(req, res)
}