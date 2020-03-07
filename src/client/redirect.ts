import { format, parse, Url as NodeUrl } from 'url'
import Router from 'next/router'
import { NextPageContext } from 'next'

export type NextUrl = NodeUrl & {
  asPath?: string
}

type Url = string | NextUrl

export default function redirect(ctx: NextPageContext, url: Url): never {
  let parsedUrl: Url
  if (typeof url === 'string') {
    parsedUrl = parse(url)
  } else {
    parsedUrl = url
  }

  // get the url component
  const { asPath: as, ...parsed } = parsedUrl
  const formattedUrl = as || format(parsed)

  if (typeof window === 'undefined') {
    if (ctx.res) {
      ctx.res.context.redirect(formattedUrl)
      ctx.res.context.respond = true
      // mark a finished response
      ctx.res.finished = true
    }
    /**
     * quickly interrupt the current getInitialProps
     * blank error will make SSR aborted without error
     * *** hack nextjs ***
     */
    Object.defineProperty(ctx.res, 'statusCode', {
      set(_statusCode: number) { /** do nothing */ },
      get() { return 302 },
    })
  } else {
    if (parsedUrl.host || parsedUrl.protocol) {
      window.location.href = formattedUrl
    } else {
      Router.push(parsed, as)
    }
  }
  // quickly intterrupt the current getInitialProps
  // a cancelled error will make CSR aborted without error
  const err: any = new Error('AbortError')
  err.name = 'AbortError'
  err.cancelled = true
  throw err
}
