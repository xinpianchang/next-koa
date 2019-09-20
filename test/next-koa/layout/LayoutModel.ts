import { withLayout } from "../../../app"
import dynamic from 'next/dynamic'

export const withBigFontLayout = withLayout(dynamic(() => import('./Layout')))