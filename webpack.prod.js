/**
 * This file contains the production webpack configuration. Use
 * the "build" script in package.json to use this configuration
 * (ie. run "yarn build" in a terminal window)
 *
 * The build script:
 *
 * "build": "NODE_ENV=production webpack --config webpack.prod.js"
 *
 * Broken down:
 *
 * - `NODE_ENV=production` => used by plugins to enable production mode
 * - `webpack` => run webpack
 * - `--config webpack.prod.js` => Tells webpack to use this config file
 */
const path = require('path')
const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const common = require('./config/webpack/webpack.common.js')
const commonPlugins = require('./config/webpack/webpack-common-plugins')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const { routeManifest } = require('./config/webpack/pages')

/**
 * All HtmlWebpackPlugin pages will include these properties
 */
const commonHtmlWebpackPluginProperties = {
  meta: {
    viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
  },
  minify: {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
  },
}

/**
 * Create html pages
 * see: `./config/webpack/pages.js`
 */
const HtmlWebpackPluginPages = routeManifest.map((page) => {
  return new HtmlWebpackPlugin({
    ...page,
    ...commonHtmlWebpackPluginProperties,
  })
})

/**
 * merge the common config with the prod specific config
 * see: `./config/webpack/webpack.common.js`
 */
module.exports = merge(common, {
  /**
   * https://webpack.js.org/concepts/targets/
   * also see: https://github.com/webpack/webpack-dev-server/issues/2758#issuecomment-710086019
   */
  target: 'browserslist',
  /**
   * Tells webpack which optimizations to use. Also sets
   * `process.env.NODE_ENV` via the DefinePlugin plugin
   *
   * Important: `process.env.NODE_ENV` is **NOT** set inside
   * this config file. For that you must set it yourself
   * in the command line:
   *
   * eg.
   *
   * ```
   * NODE_ENV=production yarn build
   * ```
   *
   * Also Important: setting `NODE_ENV` that way **DOES NOT**
   * change the mode in the config
   *
   * See: https://webpack.js.org/configuration/mode/
   */
  mode: 'production',
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
         *   3. MiniCssExtractPlugin.loader: extracts the css
         *      into its own file in the output directory
         *      (see: MiniCssExtractPlugin in plugins below)
         *
         * Key difference between dev and prod:
         *
         * - postcss-loader allows for passing of context to
         *   `postcss.config.js`, so we are passing `cssnano = true`.
         *   within `postcss.config.js` that is used to add cssnano
         *   to the list of transformations
         * - MiniCssExtractPlugin.loader instead of style-loader
         */
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader, // https://github.com/webpack-contrib/mini-css-extract-plugin
          },
          {
            loader: 'css-loader', // https://github.com/webpack-contrib/css-loader#importloaders
            options: { importLoaders: 1 },
          },
          {
            loader: 'postcss-loader', // https://github.com/postcss/postcss-loader
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
     * - allows the creation of HTML files from twig templates
     * - automatically injects bundles (ie. adds a script tag)
     *
     * The difference between dev and prod is the minify option
     *
     * see: HtmlWebpackPluginPages above
     * see: `webpack.dev.js` for more details
     * see: https://github.com/jantimon/html-webpack-plugin
     */
    ...HtmlWebpackPluginPages,
    /**
     * - Adds options to the MiniCssExtractPlugin.loader
     * used above
     * - Sets the name of the file in the output directory
     *
     * [contenthash] makes sure to change the filename if anything
     * has changed. As the name suggests it hashes the content and
     * outputs the resulting hash
     *
     * see: https://github.com/webpack-contrib/mini-css-extract-plugin
     */
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contenthash].css',
    }),
    /**
     * Creates a `manifest.json` file.
     *
     * see: https://github.com/danethurber/webpack-manifest-plugin
     */
    new WebpackManifestPlugin(),
    /**
     * Favicon generator
     *
     * see: https://github.com/jantimon/favicons-webpack-plugin
     */
    new FaviconsWebpackPlugin('./src/images/FedPack.jpg'),

    /**
     * add common plugins
     *
     * see: `./config/webpack/webpack-common-plugins.js`
     */
  ].concat(commonPlugins),
  /**
   * where should webpack output files + filename of output file
   *
   * [contenthash] makes sure to change the filename if anything
   * has changed. As the name suggests it hashes the content and
   * outputs the resulting hash
   */
  output: {
    publicPath: '',
    filename: 'assets/js/[name].[contenthash].js',
    path: path.resolve(__dirname, 'public'),
  },
  /**
   * Various optimizations for production
   *
   * see: https://webpack.js.org/configuration/optimization/
   */
  optimization: {
    // see: https://webpack.js.org/guides/caching/#module-identifiers
    moduleIds: 'deterministic',
    // extract webpacks runtime
    runtimeChunk: 'single',
    // extract all node_modules code
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
})
