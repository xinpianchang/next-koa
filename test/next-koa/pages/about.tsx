import Link from 'next/link'
import { withBigFontLayout, withItalicFontLayout } from '../layout/LayoutModel'

export default withItalicFontLayout(withBigFontLayout(() => <span>
  about us,
  <Link href='/'>
    <a>homepage</a>
  </Link>
  <Link href='/redirect'>
    <a id='redirect'>test redirect</a>
  </Link>
</span>))