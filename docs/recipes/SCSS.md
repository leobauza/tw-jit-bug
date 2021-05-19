---
layout: default
title: SCSS
parent: Recipes
nav_order: 3
---

# SCSS

This recipe explains how to set up SCSS for your project.

- [SCSS](#scss)

## Update Dependencies

```bash
yarn add node-sass sass-loader node-sass-glob-importer --dev
```

> Optionally remove any PostCSS packages you won't need (includeing `tailwindcss`)

## Change Extensions

- Change the stylesheets' extensions from `.css` to `.scss`
- Change the extension of `imports` in `index.js` to scss
- In `webpack.dev.js` and `webpack.prod.js` change the stylesheet rule test to `/\.scss$/`

## Update Webpack Configurations

In `webpack.dev.js` change `css-loader`'s `importLoaders` count to `2`, and add

```js
{
  // Inside css rule
  // postcss-loader here
  loader: 'sass-loader', // https://github.com/webpack-contrib/sass-loader
  options: {
    sassOptions: {
      importer: require('node-sass-glob-importer')(),
    },
    sourceMap: true
  }
}
```

In `webpack.prod.js` change `css-loader`'s `importLoaders` count to `2`, and add

```js
{
  // Inside css rule
  // postcss-loader here
  loader: 'sass-loader', // https://github.com/webpack-contrib/sass-loader
  options: {
    sassOptions: {
      importer: require('node-sass-glob-importer')(),
    }
  }
}
```

## PostCSS config updates

Update `postcss.config.js` according to your needs.
