/**
 * This file contains the baseline webpack configuration for
 * webpack.dev.js and webpack.prod.js. It is merged with
 * additional configurations using the webpack-merge package
 * https://github.com/survivejs/webpack-merge
 *
 * eg.
 *
 * const common = require('./webpack/webpack.common.js')
 *
 * module.exports = merge(common, {
 *   // another webpack configuration object here
 * }
 */
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')
const PACKAGE = require('../../package.json')
const version = PACKAGE.version

module.exports = {
  /**
   * entry point
   * see: https://webpack.js.org/concepts/entry-points/
   */
  entry: {
    app: './src/js/index.js',
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
         * - Test for extensions webp, png, jpg, and gif
         * - Process using asset/resource
         *
         * When images are referenced in css or in templates
         * (eg. url('./images/my-image.png') or <img src="./images/my-image.png" />)
         *
         * this is the loader that:
         *
         * - finds the file
         * - moves it to the output location
         * - replaces the reference to the image with the final
         *   path to the image in the output directory.
         *
         * see: https://webpack.js.org/guides/asset-management/#loading-images
         */
        test: /\.(webp|png|jpg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[hash][ext][query]',
        },
      },
      {
        /**
         * - Test for extensions woff, woff2, eot, ttf, and otf
         * - Process using asset/resource
         *
         * when fonts are referenced in css via @font-face
         * this is the loader that:
         *
         * - finds the file
         * - moves it to the output location
         * - replaces the reference to the font with the final
         *   path to the font in the output directory.
         *
         * see: https://webpack.js.org/guides/asset-management/#loading-fonts
         */
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[hash][ext][query]',
        },
      },
      {
        /**
         * - Test for extension twig
         * - Process using:
         *   1. twig-html-loaded: compiles twig templates into html strings
         *   2. html-loader: resolves images
         *
         * This rule works in conjunction with the HTMLWebpackPlugin
         * which simplifies the creation of HTML files with webpack
         */
        test: /\.twig$/,
        use: [
          {
            loader: 'html-loader', // https://github.com/webpack-contrib/html-loader
            options: {
              sources: {
                list: [
                  {
                    tag: 'img',
                    attribute: 'src',
                    type: 'src',
                    // eslint-disable-next-line no-unused-vars
                    filter: (tag, attribute, attributes, resourcePath) => {
                      let attrs = {}
                      attributes.forEach((attr) => {
                        attrs[attr.name] = attr.value
                      })

                      /**
                       * Filter out any images with the attribute `inline`
                       * this is done so that FPHTMLWebpackInlineSvgsPlugin
                       * can transform these `img` tags into inline SVGs
                       */
                      if (attrs.inline === '') {
                        return false
                      }

                      return true
                    },
                  },
                  {
                    tag: 'img',
                    attribute: 'srcset',
                    type: 'srcset',
                  },
                ],
              },
              minimize: false, // don't minimize (a different plugin handles minimization)
            },
          },
          {
            loader: 'twig-html-loader', // https://github.com/radiocity/twig-html-loader
            options: {
              /**
               * @TODO find a better way to do this:
               * - 19 June 2020: I don't know this seems fine to me if
               *   it's fine next "todo check" then we can erase this todo
               * - 29 March 2021: The problem is that it'd be great to configure
               *   pages from `pages.js` but some bug doesn't allow it. Not worth
               *   fixing right now but keep an eye out still.
               */
              data: (context) => {
                return {
                  version,
                  title:
                    context.resourcePath.indexOf('sample.twig') >= 0
                      ? 'Sample'
                      : 'Homepage',
                }
              },
            },
          },
        ],
      },
      {
        /**
         * - Test for extension mjs, js, ts, and tsx
         * - Process using babel-loader
         *
         * Babel loader will user the .babelrc file to compile
         * modern javascript to javascript browsers can understand
         */
        test: /\.m?(js|ts|tsx)$/,
        exclude: /node_modules/, // don't process nodule_modules
        use: [
          {
            loader: 'babel-loader', // https://github.com/babel/babel-loader
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
     * - deletes everything from the output directory to keep
     *   the build folder from getting bloated
     */
    new CleanWebpackPlugin(), // https://github.com/johnagan/clean-webpack-plugin
    /**
     * - because we async include modules, webpack tries to includes test files
     *   that can be unpredictable and these aren't needed by our bundles anyway
     * - alternatively for more complex cases use:
     *   https://webpack.js.org/plugins/context-replacement-plugin/
     */
    new webpack.IgnorePlugin({ resourceRegExp: /__tests__/ }), // https://webpack.js.org/plugins/ignore-plugin/
  ],
  resolve: {
    /**
     * see: https://webpack.js.org/configuration/resolve/#resolveextensions
     */
    extensions: ['.ts', '.tsx', '.wasm', '.mjs', '.js', '.json'],
  },
}
