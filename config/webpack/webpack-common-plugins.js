/**
 * This file requires all plugins that will be used by both
 * webpack.dev.js and webpack.prod.js and exports an array
 * of common plugins.
 *
 * Those files should require this file and concat it's
 * plugins with these.
 *
 * eg.
 *
 * const commonPlugins = require('./webpack/webpack-common-plugins')
 *
 * module.exports = merge(common, {
 *   // other options
 *   plugins: [
 *      // config-specific plugins
 *   ].concat(commonPlugins)
 * }
 *
 * > This exists because order of this plugin matters and I can't
 *   figure out how the webpack merge package can help here...
 */
const FPHTMLWebpackInlineSvgsPlugin = require('./plugins/FPHTMLWebpackInlineSvgsPlugin')

module.exports = [new FPHTMLWebpackInlineSvgsPlugin()]
