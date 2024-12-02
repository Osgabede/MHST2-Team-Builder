// TOFIX: IT DOESN'T WORK

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: `${process.env.REACT_APP_API_BASE_URL}`,
      changeOrigin: true,
      onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request to: ${proxyReq.path}`);  // Log the request path
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);  // Log any errors
        res.status(500).send('Proxy error');
      },
    })
  );
};
