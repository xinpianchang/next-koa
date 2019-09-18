import Router from 'next/router'
import { NextPageContext } from 'next'
import { NextUrl } from './redirect'

export interface FetchOptions extends RequestInit {
  ssr?: boolean;
  onError?: <T>(body: any, response: Response) => T | Promise<T>
}

export default async function getInitialState<T = any>({ asPath, res }: NextPageContext, opt: FetchOptions = { ssr: true }): Promise<T> {
  const { ssr = true, onError, ...options } = opt
  let localState = {}
  if (res && ssr) {
    if (!res.context.headerSent && res.writable) {
      res.context.vary('X-Requested-With')
    }
    Object.assign(localState, res.context.state)
  } else if (!res && asPath) {
    const response = await fetch(asPath, {
      credentials: 'include',
      ...options,
      redirect: 'follow',
      headers: {
        Accept: 'application/json, */*;q=0.8',
        ...options.headers,
        'X-Requested-With': 'Next-Fetch',
      },
    })

    const url = response.headers.get('Content-Location')
    const json = parseJson(await response.text())

    if (url) {
      // redirect back
      if (json === 'back') {
        Router.back()
      } else {
        const { asPath: as = url, ...parsedUrl } = json as NextUrl
        if (parsedUrl.host || parsedUrl.protocol) {
          window.location.replace(as)
        } else {
          Router.replace(parsedUrl, as)
        }
      }

      const error: any = new Error('Abort due to redirection')
      error.name = 'AbortError'
      error.cancelled = true
      throw error
    }

    const { status } = response;
    if (status >= 400) {
      if (onError) {
        localState = onError(json, response)
      } else {
        const { message = response.statusText, ...data } = json
        const error: any = new Error(message)
        error.statusCode = error.status = status
        error.name = 'AbortError'
        error.cancelled = true
        Object.assign(error, data)
        throw error
      }
    } else {
      localState = json
    }
  }

  return localState as T
}

function parseJson(text: string) {
  try {
    return JSON.parse(text)
  } catch(_e) {
    return text
  }
}
