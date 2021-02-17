import lsPlugin from "./ls-plugin.mjs"
import { createProxyMiddleware } from "http-proxy-middleware"
import htmlMinifier from "rollup-plugin-html-minifier"

/** @type (config: import('wmr').Options) => void */
export default async function (config) {
  const proxy = createProxyMiddleware({
    changeOrigin: true,
    ws: true,
    logLevel: "debug",
    target: "http://localhost:8080",
    pathRewrite: {
      "^/api": "",
    },
  })

  config.middleware.push((req, res, next) => {
    if (req.path.match(/^\/api(\/|$)/)) proxy(req, res, next)
    else next()
  })

  config.plugins.push(htmlMinifier())
  config.plugins.push(lsPlugin(config))
}
