import React from 'react'
import App from 'next/app'

export interface LayoutProps {
  children: React.ReactNode
}

const layoutMap = new Map<
  React.ComponentType<any>,
  React.ComponentType<LayoutProps>
>()

/**
 * ### Make a layout HOC for next page
 * this tool can setup multiple layouts shared\
 * between pages, the layout won't be unmount\
 * when pages are switched between each other
 * 
 * you can do this as following steps\
 * first create your page with HOC
 * ```
 * // pages/Login.tsx
 * import Layout from './layout/LoginLayout'
 * 
 * const LoginPage: React.FC = ...
 * export default withLayout(Layout)(LoginPage)
 * ```
 * and then extends your next App from `next-koa/App`
 * ```
 * // pages/_app.tsx
 * import App from 'next-koa/App'
 * export default class MyApp extends App {
 *   ...
 * }
 * ```
 * if the layout Component is too big, and you want to import\
 * it on demond, you can create a LayoutModel.ts like below
 * ```
 * // layout/LayoutModel.ts
 * // provider all dynamic layout HOC reference
 * import dynamic from 'next/dynamic'
 * import { withLayout } from 'next-koa/App'
 * export const withLoginLayout = withLayout(dynamic(() => import('./layout/LoginLayout')))
 * ```
 * then you can import that HOC
 * ```
 * // pages/_Login.tsx
 * import { withLoginLayout } from '../layout/LayoutModel'
 * ...
 * export default withLoginLayout(LoginPage)
 * ```
 * @param layout the Layout component
 */
export function withLayout(layout: React.ComponentType<LayoutProps>) {
  // tslint:disable-next-line: only-arrow-functions
  return function <C>(page: React.ComponentType<C>) {
    layoutMap.set(page, layout)
    return page
  }
}

export interface PageLayoutProps<T = any> {
  component: React.ComponentType<T>
  pageProps: T
}

const Layout: React.FC<PageLayoutProps> = ({ component: Component, pageProps }) => {
  const ComponentLayout = layoutMap.get(Component)
  const children = <Component {...pageProps} />
  if (ComponentLayout) {
    return <ComponentLayout>
      {children}
    </ComponentLayout>
  }
  return children
}

export default class NextKoaApp<P = {}, CP = {}, S = {}> extends App<P, CP, S> {
  render() {
    return <Layout
      component={this.props.Component}
      pageProps={this.props.pageProps}
    />
  }
}