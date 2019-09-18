# Koa2 & Next.js hydration packages

# Usage
1. Firstly setup a koa server entry
``` javascript
// server/index.js

const NextKoa = require('next-koa')
const Koa = require('koa')
const Router = require('koa2-router')
const path = require('path')

const app = new Koa()
const router = new Router()
const nextApp = NextKoa({
  dev: process.env.NODE_ENV !== 'production',
  dir: path.resolve(__dirname, '..')
})

// console nextConfig
console.log(nextApp.nextConfig)

app.use(nextApp.middleware)
app.use((ctx, next) => {
  ctx.state.homepage = '/'
  return next()
})
app.use(router)

// using renderer of next.js to emit pages/about.tsx
// the state can be captured by next-koa/getstate package
// and is rendered as ctx.state merged by this data
// here data usually is a plain object
router.get('/about', ctx => ctx.render('about', { title: 'about us' }))

// if nextConfig.useFileSystemPublicRoutes is missing or true
// then you can get any page under `pages` by directly fetching
// the pathname without defining the koa routes

app.listen(3000)
```

2. Then write your own next.js pages
```jsx
// pages/about.tsx

import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import getInitialState from 'next-koa/getstate'

export default class AboutPage extends React.Component {
  static async getInitialProps(ctx) {
    // getInitalState fetches data both on client/server
    const state = await getInitialState(ctx)
    // { title: 'about us', homepage: '/' }
    return stata
  }
  render() {
    <>
      <Head>
        <title>{this.props.title}</title>
      </Head>
      <Link href={this.props.homepage}>
        <a>Homepage</a>
      </Link>
    </>
  }
}

```

