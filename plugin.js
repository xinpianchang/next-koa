const withTM = require('next-transpile-modules')

const { webpack, webpackDevMiddleware } = withTM({ transpileModules: ['next-koa'] })
module.exports = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (!options.isServer) {
        config = webpack(config, options)
      }
      if (nextConfig.webpack) {
        return nextConfig.webpack(config, options)
      }
      return config
    },
    webpackDevMiddleware
  })
}