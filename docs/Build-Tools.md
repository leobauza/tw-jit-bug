---
layout: default
title: Build Tools
nav_order: 3
---

# Build Tools

- [Build Tools](#build-tools)
  - [Babel](#babel)
  - [Postcss](#postcss)
  - [Webpack](#webpack)
    - [`webpack/webpack.common.js`](#webpackwebpackcommonjs)
    - [`webpack/webpack-common-plugins.js`](#webpackwebpack-common-pluginsjs)
    - [`webpack.dev.js`](#webpackdevjs)
    - [`webpack.prod.js`](#webpackprodjs)
  - [`package.json`](#packagejson)
  - [Custom Webpack Plugin Notes:](#custom-webpack-plugin-notes)
    - [FPHTMLWebpeckInlineSvgPlugin](#fphtmlwebpeckinlinesvgplugin)

## Babel

Babel transforms modern javascript to javascript browsers can understand. [Babel.js](https://babeljs.io/) configuration lives in `.babelrc.js` (the file is heavily commented with details.)

> **note:** `@babel/plugin-syntax-dynamic-import` is used for the Data Module Pattern but probably isn't needed for other types of projects.

## Postcss

The `postcss.config.js` contains comments describing what [PostCSS](https://postcss.org/) is doing.

## Webpack

The default Webpack files a heavily commented. See `webpack/`, `webpack.dev.js`, and `webpack.prod.js`. Overview of each file:

### `webpack/webpack.common.js`

- Contains common settings between dev and prod builds

### `webpack/webpack-common-plugins.js`

- Contains plugins shared by `webpack.dev.js` and `webpack.prod.js`

### `webpack.dev.js`

- Dev specific build.
- Starts the devServer
- Doesn't ouput files to `public/` (except for `index.html` to support reloading)

### `webpack.prod.js`

- Outputs minimized, production ready files to `public/`
- Extracts css into it's own bundle
- Extrects a `manifest.json` file
- Performs various optimizations

## `package.json`

A breakdown of the `package.json` file.

Standard `package.json` values created using `yarn init`:

```js
{
  "name": "fedpack",
  "version": "<current-version>",
  "description": "just some webpack settings",
  "main": "index.js",
  "license": "MIT",
  "private": true,
  ...
}
```

Various scripts:

The main ones to run and build the site are:

- `yarn start` starts the webpack devServer using `webpack.dev.js` as a configuration and automatically opens a browser window to `localhost:8080`
- `yarn build` creates a production build that outputs to `public/`
- `yarn serve` starts a node server that serves the production build in `public/` at `localhost:3001`

> linting, formatting, and validating scripts documented in the [Linting & Formatting](#linting--formatting) section

> testing scripts documented in the [Testing](#testing) section

```js
"scripts": {
  "start": "webpack-dev-server --open --config webpack.dev.js",
  "build": "webpack --config webpack.prod.js",
  "serve": "serve --no-clipboard --listen 8080 ./public",
  "lint-js": "eslint './src/js/**/*.js'",
  "lint-css": "stylelint './src/css/**/*.css'",
  "fix-css": "yarn lint-css --fix",
  "fix-js": "yarn lint-js --fix",
  "prettify": "yarn prettier --write",
  "prettier": "prettier 'src/**/*.{js,jsx,json,yml,yaml,css,less,scss,ts,tsx,md,mdx,graphql,vue}'",
  "format": "yarn prettify && yarn fix-js && yarn fix-css",
  "test": "is-ci \"test:coverage\" \"test:watch\"",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:e2e": "is-ci \"test:e2e:run\" \"test:e2e:open\"",
  "cy:run": "cypress run",
  "cy:open": "cypress open",
  "pretest:e2e:run": "yarn build",
  "test:e2e:run": "start-server-and-test serve http://localhost:8080 cy:run",
  "test:e2e:open": "start-server-and-test start http://localhost:8080 cy:open",
  "validate": "yarn test:coverage && yarn test:e2e:run"
},
```

Configuration for jest's eslint runner:

```js
"jest-runner-eslint": {
  "cliOptions": {
    "ignorePath": "./.gitignore"
  }
},
```

All the packages FedPack™ needs to run.

```js
  ...
  "devDependencies": {
    "@babel/core": "<version>", // transform js
    "@babel/plugin-proposal-class-properties": "<version>", // allow properties on js classes
    "@babel/plugin-syntax-dynamic-import": "<version>", // allow dynamic imports
    "@babel/preset-env": "<version>", // basic babel preset to conver js
    "@testing-library/dom": "<version>", // light-weight solution for testing DOM nodes with Jest
    "@viget/tailwindcss-plugins": "<version>", // viget's tailwindcss custom plugins + utils
    "autoprefixer": "<version>", // postcss plugin to add browser prefixes
    "axe-core": "<version>", // used by cypress for automated a11y testing
    "babel-eslint": "<version>", // parser for eslint (needed because of our use of the latest and greatest js)
    "babel-loader": "<version>", // webpack loader to use babel
    "clean-webpack-plugin": "<version>", // delete the contents of the public folder before every new build
    "core-js": "<version>", // used by babel to support the latest and greatest js
    "css-loader": "<version>", // webpack loader for css (1 of 3)
    "cssnano": "<version>", // used to minify and uglify css for production
    "cypress": "<version>", // used for end-to-end (e2e) testing
    "cypress-axe": "<version>", // provides cypress commands for e2e a11y testing using axe-core
    "eslint": "<version>", // used for js linting
    "eslint-plugin-cypress": "<version>", // used for js linting (specifically for cypress files)
    "eslint-plugin-jest": "<version>", // used for js linting (specifically jest files)
    "favicons": "<version>", // needed for favicons-webpack-plugin
    "favicons-webpack-plugin": "<version>", // webpack plugin to add favicons
    "html-loader": "<version>", // webpack loader for html
    "html-webpack-harddisk-plugin": "<version>", // enhances HTMLWebpackPlugin by adding the alwaysWriteToDisk options
    "html-webpack-plugin": "<version>", // webpack plugin for generating html files from templates
    "husky": "<version>", // used to set up hooks to run commands like linting and formatting on pre-commit
    "is-ci-cli": "<version>", // used by scripts to run different commands in a CI env
    "jest": "<version>", // testing framework (unit and integration)
    "jest-runner-eslint": "<version>", // used to allow jest to run eslint checks at the same time as tests
    "jest-runner-stylelint": "<version>", // used to allow jest to run stylelint checks at the same time as tests
    "lint-staged": "<version>" // run shell tasks with a list of staged files, filtered by a specified glob pattern
    "mini-css-extract-plugin": "<version>", // webpack plugin for extracting css file from js import in production builds
    "parse5": "<version>", // used by a custom webpack plugin to parse html (FPHTMLWebpackInlineSvgsPlugin)
    "postcss": "<version>", // used for writing postcss plugins in postcss.config.js
    "postcss-color-hex-alpha": "<version>", // postcss plugins for alpha on hex colours
    "postcss-easy-import": "<version>", // allow @import in css files
    "postcss-loader": "<version>", // webpack loader for css (2 of 3)
    "postcss-nesting": "<version>", // postcss plugin for nesting css rules
    "prettier": "<version>", // automatic code formatting
    "serve": "<version>", // simple server for testing production builds
    "start-server-and-test": "<version>", // used by scripts to start the dev server and then start jest in watch mode
    "style-loader": "<version>", // webpack loader for css (3 of 3)
    "stylelint": "<version>", // used for css linting
    "stylelint-config-prettier": "<version>", // used by stylelint (base rules that play well with prettier)
    "stylelint-config-standard": "<version>", // used by stylelint (base rules)
    "stylelint-order": "<version>", // used by stylelint (alpha order rules)
    "tailwindcss": "<version>", // postcss plugin for tailwind
    "twig-html-loader": "<version>", // webpack loader to process twig files
    "webpack": "<version>", // build tool
    "webpack-bundle-analyzer": "<version>", // analyze bundle sizes
    "webpack-cli": "<version>", // build tool cli
    "webpack-dev-server": "<version>", // local development server
    "webpack-manifest-plugin": "<version>", // createst a manifest.json file
    "webpack-merge": "<version>" // merge multiple webpack configuration files
  },
},
  ...
```

Finally dependencies:

```js
  ...
  "dependencies": {
    "what-input": "<version>" // a11y package used by the default css
  }
  ...
```

> **note:** see `package.json` for exact versions of all packages

## Custom Webpack Plugin Notes:

- Custom plugins located in `webpack/custom-webpack-plugins/`
- Custom plugins should be prefixed with FP (FedPack) until they become npm packages

### FPHTMLWebpeckInlineSvgPlugin

Adds inline SVG support without the need of a wrapper. This plugin depends on `HtmlWebpackPlugin` and the use of the very specific `html-loader` settings (see: `webpack.common.js`).

> See [the inline SVG icons section of Assets documentation](Assets.md#svg-icons) for more information
