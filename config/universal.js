const isDev = process.env.NODE_ENV !== 'production'
const isTest = process.env.NODE_ENV === 'test'
const isProd = !isDev
const isClient = typeof window !== 'undefined'
const isServer = !isClient

module.exports = {
  isClient,
  isServer,
  isTest,
  isDev,
  isProd,
  public: isClient ? ((window._ssr || {}).config || {}) : {}
}
