import Link from 'next/link'
import Head from 'next/head'
import { withBigFontLayout, withItalicFontLayout } from '../../layout/LayoutModel'

export default withItalicFontLayout(withBigFontLayout(() => <span>
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
</span>))