import Link from 'next/link'
import Head from 'next/head'
import { NextPage } from 'next'
import getInitState from '../../../getstate'

const About: NextPage = () => <span>
  <Head>
    <title>about</title>
  </Head>
  about us,
  <Link href='/'>
    <a>home</a>
  </Link>
  <Link href='/redirect'>
    <a id='redirect'>test redirect</a>
  </Link>
  <a id='redirect2' href='/redirect'>apple</a>
</span>

About.getInitialProps = (ctx) => {
  console.log(66666, ctx.query)
  return {}
}

export default About