import nextConfig from 'next/config'
import { PublicConfig } from '../server'

export default function() {
  const { publicRuntimeConfig: { nextKoaConfig = {} } = {} } = nextConfig() as {
    publicRuntimeConfig?: PublicConfig
  }
  return nextKoaConfig
}
