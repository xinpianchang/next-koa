import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import getInitState from '../../../getstate'

export default class extends React.Component<any, any> {
  static getInitialProps = getInitState
  public render() {
    return <>
      <Head>
        <title>{this.props.title}</title>
      </Head>
      <div>         
        Hello Next.js,
        <Link href={this.props.homepage}>
          <a>homepage</a>
        </Link>
      </div>
    </>
  }
}