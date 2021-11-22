/* eslint-disable @typescript-eslint/no-var-requires */
// next.config.js
const withPreact = require("next-plugin-preact")
const withPWA = require("next-pwa")
const withPlugins = require("next-compose-plugins")

const nextPWAConfig = {
  pwa: {
    dest: "public",
    disable: process.env.NODE_ENV === "development",
    // disable: process.env.NODE_ENV === 'development',
    // register: true,
    // scope: '/app',
    // sw: 'service-worker.js',
    // ...
  },
}

/** @type {import("next").NextConfig} */
const config = {
  swcMinify: true,
}

module.exports = withPlugins([[withPWA, nextPWAConfig], withPreact], config)
