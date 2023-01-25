const { createProxyMiddleware } = require('http-proxy-middleware')
module.exports = function (app) {
  app.use(
    '/weather',
    createProxyMiddleware({
      target: 'https://api.map.baidu.com',
      changeOrigin: true
    })
  )
}
