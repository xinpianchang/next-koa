import { withLayout } from "../../../App"
import dynamic from 'next/dynamic'

export const withBigFontLayout = withLayout(dynamic(() => import('./Layout')))