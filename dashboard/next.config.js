/* eslint-disable @typescript-eslint/no-var-requires */
// next.config.js
const withPreact = require("next-plugin-preact")
const withPlugins = require("next-compose-plugins")

/** @type {import("next").NextConfig} */
const config = {
  swcMinify: true
}

module.exports = withPlugins([withPreact], config)
