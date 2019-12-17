import { NextPage } from 'next'
import redirect from '../../../redirect'

const Redirect: NextPage = () => <div>redirect</div>

Redirect.getInitialProps = ctx => {
  redirect(ctx, '/')
}

export default Redirect