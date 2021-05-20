const path = require('path')
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const common = require('./config/webpack/webpack.common.js')
const runOpen = require('webpack-dev-server/lib/utils/runOpen')

/**
 * merge the common config with the dev specific config
 * see: `./config/webpack/webpack.common.js`
 */
module.exports = merge(common, {
  target: 'web',
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    contentBase: './public',
    hot: true,
    watchContentBase: true,
    historyApiFallback: true,
    host: '0.0.0.0',
    onListening: (server) => {
      const port = server.listeningApp.address().port
      console.log(`Opening on: http://localhost:${port}`)
      runOpen(`http://localhost:${port}`, { open: true })
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader, // https://github.com/webpack-contrib/mini-css-extract-plugin
            options: {},
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
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new HtmlWebpackHarddiskPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.twig',
      alwaysWriteToDisk: true,
    }),
  ],
  output: {
    publicPath: '',
    filename: 'assets/js/[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  optimization: {
    runtimeChunk: 'single',
  },
})
