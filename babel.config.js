const config = require('config')

module.exports = {
  presets: [
    [
      '@babel/preset-env', {
        useBuiltIns: 'usage',
        modules: config.isTest ? 'commonjs' : false
      }
    ],
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    [
      '@babel/plugin-transform-runtime', {
        useESModules: !config.isTest
      }
    ],
    [
      'emotion', {
        sourceMap: config.isDev,
        autoLabel: config.isDev,
        hoist: config.isProd
      }
    ]
  ]
}
