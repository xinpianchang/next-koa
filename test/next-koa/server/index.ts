import Koa from 'koa'
import KoaNext from '../../../'
import http from 'http'
import path from 'path'

const dir = path.resolve(__dirname, '..')

const app = new Koa()
const next = KoaNext({
  dev: process.env.NODE_ENV !== 'production',
  dir,
})

app.use(next.middleware)

app.use((ctx, next) => {
  ctx.state.homepage = '/'
  if (ctx.path === '/') {
    return ctx.render('/', { title: 'hello world' })
  }
  return next()
})

const server = http.createServer(app.callback())
const port = process.env.PORT || 3000
server.listen(process.env.PORT || 3000, () => {
  console.info('server is ready on port', port)
})