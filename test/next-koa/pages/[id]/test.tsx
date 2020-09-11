import Link from 'next/link'
import Head from 'next/head'
import { NextPage } from 'next'
import getInitState from '../../../../getstate'

const Test: NextPage = () => <span>
  <Head>
    <title>test</title>
  </Head>
  test us,
  <Link href='/'>
    <a>homepage</a>
  </Link>
  <Link href='/redirect'>
    <a id='redirect'>test redirect</a>
  </Link>
  <a id='redirect2' href='/redirect'>apple</a>
</span>

Test.getInitialProps = (ctx) => {
  console.log(66666, ctx.query)
  return {}
}

export default Test