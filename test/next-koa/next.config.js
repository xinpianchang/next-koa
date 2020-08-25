const withPlugin = require('../../plugin')

module.exports = withPlugin({
  publicRuntimeConfig: {
    nextKoaConfig: {
      nextFetch: 'param'
    }
  }
})