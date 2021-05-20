const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: {
    app: './src/js/index.js',
    second: './src/js/second.js',
  },
  module: {
    rules: [
      {
        test: /\.twig$/,
        use: [
          {
            loader: 'html-loader', // https://github.com/webpack-contrib/html-loader
          },
          {
            loader: 'twig-html-loader', // https://github.com/radiocity/twig-html-loader
          },
        ],
      },
      {
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
  plugins: [
    new CleanWebpackPlugin(), // https://github.com/johnagan/clean-webpack-plugin
  ],
  resolve: {
    /**
     * see: https://webpack.js.org/configuration/resolve/#resolveextensions
     */
    extensions: ['.ts', '.tsx', '.wasm', '.mjs', '.js', '.json'],
  },
}
