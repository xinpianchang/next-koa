import { format, parse, Url as NodeUrl } from 'url'
import Router from 'next/router'
import { NextPageContext } from 'next'

export type NextUrl = NodeUrl & {
  asPath?: string
}

type Url = string | NextUrl

export default function redirect(ctx: NextPageContext, url: Url): void {
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
  } else {
    if (parsedUrl.host || parsedUrl.protocol) {
      window.location.replace(formattedUrl)
    } else {
      Router.replace(parsed, as)
    }
  }
}
