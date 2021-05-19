/**
 * This file contains the development webpack configuration. Use
 * the "start" script in package.json to use this configuration
 * (ie. run "yarn start" in a terminal window)
 *
 * The start script:
 *
 * "start": "NODE_ENV=development webpack serve --config webpack.dev.js"
 *
 * Broken down:
 *
 * - `NODE_ENV=development` => used by plugins to enable dev mode
 * - `webpack serve` => starts webpack dev server
 * - `--config webpack.dev.js` => Tells webpack to use this config file
 */
const path = require('path')
const { merge } = require('webpack-merge')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const common = require('./config/webpack/webpack.common.js')
const commonPlugins = require('./config/webpack/webpack-common-plugins')
const runOpen = require('webpack-dev-server/lib/utils/runOpen')

const { routeManifest, rewrites } = require('./config/webpack/pages')

/**
 * All HtmlWebpackPlugin pages will include these properties
 */
const commonHtmlWebpackPluginProperties = {
  /**
   * Add meta tags here
   */
  meta: {
    viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
  },
  /**
   * Set basic favicon (must be a png)
   *
   * Prod omits this and uses FaviconsWebpackPlugin
   * for more complete list of favicons
   */
  favicon: './src/images/FedPack.png',
}

/**
 * Create html pages
 */
const HtmlWebpackPluginPages = routeManifest.map((page, index) => {
  return new HtmlWebpackPlugin({
    ...page,
    ...commonHtmlWebpackPluginProperties,
    /**
     * The combination of this and devServer.watchContentBase
     * enables browser reloading when changes are detected
     *
     * From docs: Even if you generate multiple files make sure that you add
     * the HtmlWebpackHarddiskPlugin only once:
     */
    alwaysWriteToDisk: index === 0,
  })
})

/**
 * merge the common config with the dev specific config
 * see: `./config/webpack/webpack.common.js`
 */
module.exports = merge(common, {
  /**
   * https://webpack.js.org/concepts/targets/
   * also see: https://github.com/webpack/webpack-dev-server/issues/2758#issuecomment-710086019
   * note on IE11: https://webpack.js.org/migrate/5/#need-to-support-an-older-browser-like-ie-11
   * 🤷🏽‍♂️ this makes HMR work again...
   */
  target: 'web',

  /**
   * Tells webpack which optimizations to use. Also sets
   * `process.env.NODE_ENV` via the DefinePlugin plugin
   *
   * **Important:** `process.env.NODE_ENV` is **NOT** set inside
   * this config file. For that you must set it yourself
   * in the command line:
   *
   * eg.
   *
   * ```
   * NODE_ENV=development yarn start
   * ```
   *
   * **Also Important:** setting `NODE_ENV` that way **DOES NOT**
   * change the mode in the config
   *
   * See: https://webpack.js.org/configuration/mode/
   */
  mode: 'development',
  /**
   * Controls how sourcemaps are generated
   * see: https://webpack.js.org/configuration/devtool/
   */
  devtool: 'eval-cheap-module-source-map',
  /**
   * Starts a node server on localhost:8080
   *
   * - contentBase: specify directory to serve from
   * - hot: whether or not to enable Hot Module Reloading (HMR)
   * - watchContentBase: starts a watch task for file changes
   *   in the contentBase directory. Enabled here in conjunction
   *   with the HTMLWebpackPlugin setting that always writes
   *   templates to disk (explained more below)
   * - historyApiFallback: sets rewrites to enable multiple pages
   *   see: `./config/webpack/pages.js`
   * - host: set server to be accessible externally
   * - onListening: uses `runOpen` to open the browser to `localhost:port`
   *   this is purely for aesthetics because I don't like opening to
   *   `0.0.0.0:8080` and prefer `localhost`
   *
   * see: https://webpack.js.org/configuration/dev-server/
   */
  devServer: {
    contentBase: './public',
    hot: true,
    watchContentBase: true,
    historyApiFallback: {
      rewrites,
    },
    host: '0.0.0.0',
    /**
     * Change according to your purposes and local settings
     * see: https://webpack.js.org/configuration/dev-server/#devserverallowedhosts
     */
    // allowedHosts: ['.mycomputer.local'],
    onListening: (server) => {
      const port = server.listeningApp.address().port
      console.log(`Opening on: http://localhost:${port}`)
      runOpen(`http://localhost:${port}`, { open: true })
    },
  },
  /**
   * see: https://webpack.js.org/concepts/modules
   */
  module: {
    /**
     * rules tell webpack how to process different file types
     * it comes across when creating bundles
     *
     * **Important:** loaders resolve from **last to first**
     */
    rules: [
      {
        /**
         * - Test for extension css
         * - Process using:
         *   1. postcss-loader: uses `postcss.config.js` to
         *      compile postcss code
         *   2. css-loader: resolves imported css files
         *      ie. import '../css/styles.css' in a js file
         *   3. style-loader: injects a <style> tag to the DOM
         *
         */
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            // use style-loader on dev for HMR
            loader: 'style-loader', // https://github.com/webpack-contrib/style-loader
          },
          {
            loader: 'css-loader', // https://github.com/webpack-contrib/css-loader#importloaders
            options: {
              importLoaders: 1, // # of loaders before css-loader (ie. postcss-loader)
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader', // https://github.com/postcss/postcss-loader
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  /**
   * Plugins perform the functions that loaders can't
   *
   * see: https://webpack.js.org/concepts/plugins/
   */
  plugins: [
    /**
     * This plugin:
     *
     * - allows the creation of HTML files from twig templates
     * - automatically injects bundles (ie. adds a script tag)
     *
     * see: `HtmlWebpackPluginPages` above
     * see: https://github.com/jantimon/html-webpack-plugin
     */
    ...HtmlWebpackPluginPages,
    /**
     * - Reloads page when changes in html files are detected
     *
     * see: https://github.com/jantimon/html-webpack-harddisk-plugin
     */
    new HtmlWebpackHarddiskPlugin(),
    /**
     * Magically makes HMR work 👍 (trust it)
     *
     * see: https://webpack.js.org/plugins/hot-module-replacement-plugin/
     */
    new webpack.HotModuleReplacementPlugin(),
    /**
     * add common plugins
     *
     * see: ./config/webpack/webpack-common-plugins.js
     */
  ].concat(commonPlugins),
  /**
   * where should webpack output files + filename of output file
   */
  output: {
    // `publicPath` is important for the manifest to work correctly
    publicPath: '',
    filename: 'assets/js/[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
})
