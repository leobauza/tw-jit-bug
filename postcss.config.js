const cssnano = require('cssnano')

module.exports = () => {
  let plugins = [
    require('postcss-easy-import'),
    require('tailwindcss'),
    require('autoprefixer'),
    require('postcss-nesting'),
    require('postcss-color-hex-alpha'),
  ]

  if (process.env.NODE_ENV === 'production') {
    plugins = plugins.concat([
      cssnano({
        preset: 'default',
      }),
    ])
  }

  return {
    plugins,
  }
}
