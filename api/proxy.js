const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = (req, res) => {

    if (req.url.startsWith('/test_cors')) {
        createProxyMiddleware({
            target: 'https://sui.io/',
            changeOrigin: true,
            pathRewrite: {
                '^/test_cors': '/'
            }
        })(req, res);
    }

    if (req.url.startsWith('/cors')) {
        createProxyMiddleware({
            target: 'https://sui.io/',
            changeOrigin: true,
            pathRewrite: {
                '^/cors': '/'
            }
        })(req, res);
    }

}