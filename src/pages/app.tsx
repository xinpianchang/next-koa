import React from 'react'
import App from 'next/app'
import Layout from '../client/layout'

export default class NextKoaApp<P = {}, CP = {}, S = {}> extends App<P, CP, S> {
  render() {
    return <Layout component={this.props.Component} pageProps={this.props.pageProps} />
  }
}
