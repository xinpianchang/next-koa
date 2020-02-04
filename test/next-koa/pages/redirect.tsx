import { NextPage } from 'next'
import redirect from '../../../redirect'

const Redirect: NextPage<{}, void> = () => <div>redirect</div>

Redirect.getInitialProps = async ctx => {
  redirect(ctx, '/')
}

export default Redirect