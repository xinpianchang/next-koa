import Link from 'next/link'
import { withBigFontLayout } from '../layout/LayoutModel'

export default withBigFontLayout(() => <span>
  about us,
  <Link href='/'>
    <a>homepage</a>
  </Link>
</span>)