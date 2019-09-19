import Koa from 'koa'
import NextKoa from '../../../'
import http from 'http'
import path from 'path'
import Router from 'koa2-router'

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

router.get('/', ctx => ctx.render('/', { title: 'hello world' }))
app.use(router)

const server = http.createServer(app.callback())
const port = process.env.PORT || 3000
server.listen(process.env.PORT || 3000, () => {
  console.info('server is ready on port', port)
})