import { withLayout } from "../../../layout"
import dynamic from 'next/dynamic'

export const withBigFontLayout = withLayout(dynamic(() => import('./Layout')))
export const withItalicFontLayout = withLayout(dynamic(() => import('./ItalicLayout')))