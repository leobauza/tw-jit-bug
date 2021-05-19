---
layout: default
title: Craft
parent: Recipes
nav_order: 6
---

# Craft

- [Craft](#craft)
  - [Assumptions:](#assumptions)
  - [1. Get FedPack™](#1-get-fedpack)
  - [2. Install npm packages](#2-install-npm-packages)
  - [3. Remove Unnecessary FedPack™ Files](#3-remove-unnecessary-fedpack-files)
  - [4. Modify Configuration Files](#4-modify-configuration-files)
    - [Modify `purge` config on `tailwind.config.js`:](#modify-purge-config-on-tailwindconfigjs)
    - [Replace `/config/webpack/webpack.common.js`](#replace-configwebpackwebpackcommonjs)
    - [Replace `webpack.dev.js`](#replace-webpackdevjs)
    - [Replace `webpack.prod.js`](#replace-webpackprodjs)
  - [5. Configure Craft](#5-configure-craft)
    - [Craft Asset Rev](#craft-asset-rev)
    - [Adding js to template](#adding-js-to-template)
    - [Adding css to template](#adding-css-to-template)
    - [Handling SVGs:](#handling-svgs)
    - [Handling Images:](#handling-images)
  - [6. FAQ](#6-faq)
  - [7. Sample Template](#7-sample-template)
  - [8. Testing and Formatting](#8-testing-and-formatting)
    - [`.editorconfig`](#editorconfig)
    - [Jest](#jest)
    - [Cypress](#cypress)
    - [Local Network Availability](#local-network-availability)

## Assumptions:

This recipe assumes a starting point of a fresh Craft CMS installation. All directions assume you are at the root of your Craft CMS installation.

Use of [tailwind](https://tailwindcss.com/docs/what-is-tailwind/) and [postcss](https://postcss.org/). If using a different css strategy this guide will probably still mostly work.

Uses of the [Craft asset rev plugin](https://github.com/clubstudioltd/craft-asset-rev).

The entry point for `js` will be a file named `index.js` and that an entry file for css named `styles.css` is imported into `index.js`

```js
// /src/js/index.js
import '../css/styles.css'
```

A `template/` directory.

The output directory is `web/assets/`.

> **IMPORTANT:** Webpack will delete and replace the contents of `web/assets`. If there are uploaded images (through Craft's UI), they need to live in a directory outside of `web/assets` otherwise running `yarn build` will delete them.

## 1. Get FedPack™

1. From the root of your Craft project clone (or download) the FedPack™ repo into a directory named `fedpack/`. The following command clones FedPack™ into a directory named `fedpack/`:

```
git clone git@github.com:vigetlabs/FedPack.git --single-branch --branch main --depth 1 fedpack/
```

> This command only clones the main branch and only downloads the latest commit. This makes the cloning process faster since the entire git history of FedPack™ is irrelevant for the purposes of getting set up here. If you want a different branch replace `main` with the name of the branch.

2. `cd fedpack/`
3. Delete these files/directories inside `fedpack/`:
   - `README.md`
   - `src/*.twig` (all `.twig` files in `src`),
   - `docs/` and,
   - `.git/`

> The `README.md` and `.git/` directory from your Craft project should **NOT** be deleted. Only delete things inside the `fedpack/` directory.

4. Manually move the contents of `fedpack/` to the root of your Craft installation **except** for:
   - `config/` and
   - `.gitignore`

> Craft already has a `config/` and `.gitignore` so we will manually merge them next. If there are any other conflicts resolve them manually (usually `.editorconfig`).

5. Modify the `.gitignore` at the root of the Craft installation to make sure it includes:

```
/node_modules
/web/assets
/web/manifest.json
/cypress/videos
/cypress/screenshots
.DS_Store
/coverage
.eslintcache
stats.json
```

6. From the root of your Craft project move `fedpack/config/webpack/` and `fedpack/config/tailwind/` to `config/`

> If you are following along then you may be inside `fedpack/` if so: go up a level with `cd ..` so you are at the **root** of your project

```
mv fedpack/config/webpack config
mv fedpack/config/tailwind config
```

7. Finally delete `fedpack/`

## 2. Install npm packages

1. Run `yarn install` (**this step is not needed if running Craft on Docker**)
2. **Remove** the serve script from `package.json`. Delete this line:

```json
{
  "serve": "serve --no-clipboard --listen 8080 ./public"
}
```

3. **Modify** e2e test scripts. Change these lines:

```json
{
  "scripts": {
    "test:e2e:run": "start-server-and-test serve http<s?>://<replace-me>.test cy:run",
    "test:e2e:open": "start-server-and-test start http<s?>://<replace-me>.test cy:open"
  }
}
```

4. Replace `package.json`'s `lint-staged`

```json
"lint-staged": {
  "*.js": "eslint --cache --fix",
  "*.css": "stylelint --fix",
  "*.{js,jsx,json,yml,yaml,css,less,scss,ts,tsx,md,mdx,graphql,vue}, !./config/project": "prettier --write"
}
```

> This prevents Craft's project config files from being reformatted on commit

5. Remove unnecessary devDependencies:

```
yarn remove html-loader html-webpack-plugin twig-html-loader favicons favicons-webpack-plugin serve parse5 html-webpack-harddisk-plugin
```

6. Add devDependencies we will need for the Craft setup:

```
yarn add --dev copy-webpack-plugin dotenv
```

After doing all this you will probably want to delete the `node_modules` directory that is created if you are going to run the site on Docker. Also, make sure to uncomment or add the `yarn` container to your `docker-compose.yml`.

## 3. Remove Unnecessary FedPack™ Files

Remove:

- `config/webpack/pages.js`,
- `config/webpack/plugins/`, and
- `config/webpack/webpack-common-plugins.js`

> These files are used by FedPack™ for rendering Html templates, since Craft is taking care of templates we won't need them in our webpack configurations

## 4. Modify Configuration Files

We will modify **4 files**:

- `webpack.common.js`,
- `webpack.dev.js`,
- `webpack.prod.js`, and
- `tailwind.config.js`

All three of `webpack.*.*` files will be **replaced** (copy and paste from this recipe). The tailwind configuration just needs one small change:

### Modify `purge` config on `tailwind.config.js`:

```js
module.exports = {
  // ...
  purge: ['./templates/**/*.html'],
  // ...
```

> This tells purge where to look for tailwind classes.

### Replace `/config/webpack/webpack.common.js`

```js
const webpack = require('webpack')

module.exports = {
  entry: {
    app: './src/js/index.js',
  },
  module: {
    rules: [
      {
        test: /\.(webp|png|jpg|gif|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[hash][ext][query]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[hash][ext][query]',
        },
      },
      {
        test: /\.m?(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
  plugins: [new webpack.IgnorePlugin({ resourceRegExp: /__tests__/ })],
  resolve: {
    extensions: ['.ts', '.tsx', '.wasm', '.mjs', '.js', '.json'],
  },
}
```

<details>
<summary>View Summary of Changes</summary>

- Removes `CleanWebpackPlugin` because we need more specific rules for Craft when in dev and prod
- Removes loading of `.twig` files since templating is done by Craft not the `HtmlWebpackPlugin`
</details>

### Replace `webpack.dev.js`

````js
const path = require('path')
const { merge } = require('webpack-merge')
const webpack = require('webpack')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const common = require('./config/webpack/webpack.common.js')
const dotenv = require('dotenv')

dotenv.config()

/**
 * Configure dev server.
 *
 * These can be set manually or using `dotenv`.
 * If using `dotenv` your project should have a `.env`
 * file that has the line like:
 *
 * ```
 * # Site URL
 * PRIMARY_SITE_URL="http://viget-craft.test"
 * ```
 *
 * if `PRIMARY_SITE_URL` is named something different change the
 * `BASE_URL` line below to reflect the change.
 *
 * To set everything manually you would do something
 * like this:
 *
 * eg. for viget.test:8080
 *
 * const BASE_URL = new URL('http://viget.test')
 */
const BASE_URL = new URL(process.env.PRIMARY_SITE_URL)
const PROTO = BASE_URL.protocol
const HOST = process.env.FRONTEND_HOSTNAME || BASE_URL.host
const PORT = 8080

module.exports = merge(common, {
  target: 'web',
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  /**
   * The devServer runs parallel to the server running Craft
   * and only serves up assets. Some details:
   *
   * - contentBase + watchContentBase handle refreshing the
   *   browser when templates change
   * - writeToDisk moves images to `/web/assets/images`
   *   (ie. to the Craft server) even on dev so that Craft
   *   can process them. This works in conjunction with the
   *   `CopyPlugin`
   */
  devServer: {
    public: `${HOST}:${PORT}`,
    port: PORT,
    hot: true,
    contentBase: path.resolve(__dirname, './templates'),
    watchContentBase: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    // allowedHosts: [`.${HOST}`], // for multisite HMR support
    writeToDisk: (filePath) => {
      return /\/web\/assets\/images\/[\S]+\.(?:svg|webp|png|jpg)/.test(filePath)
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    /**
     * Copies images to `/web` (see devServer for more)
     */
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './src/images'),
          to: path.resolve(__dirname, './web/assets/images'),
        },
      ],
    }),
    /**
     * Creates the manifest file that the Craft asset rev requires.
     * Other details:
     *
     * - writeToFileEmit: writes to file in dev
     * - seed: all the images get erased from the manifest if this
     *   isn't here (no idea why)
     * - map: the manifest plugin is not aware that the copy plugin
     *   is copying images over to `/web` and that craft MUST get
     *   the images from it's own server (not the devServer.) This
     *   function fixes that path to look for images in
     */
    new WebpackManifestPlugin({
      writeToFileEmit: true,
      fileName: '../manifest.json',
      seed: {}, // THIS IS APPARENTLY SUPER IMPORTANT
      map: (file) => {
        // modify output for images
        const regex = new RegExp(
          `${PROTO}//${HOST}:${PORT}/images/[\\S]+.(?:svg|webp|png|jpg)`
        )

        if (regex.test(file.path)) {
          const modifiedFile = Object.assign({}, file, {
            name: file.name.replace('src/', ''),
            path: file.path.replace(`${PROTO}//${HOST}:${PORT}/`, '/assets/'),
          })

          return modifiedFile
        }

        return file
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  /**
   * Public path should be to the devServer so that Craft can grab
   * the bundle with HMR
   * Path should point to `/web/assets` so that images can be referenced
   * with a shorter path without needing to change `assetrev.php`'s "assetBasePath"
   */
  output: {
    publicPath: `${PROTO}//${HOST}:${PORT}/`,
    filename: 'assets/js/[name].bundle.js',
    path: path.resolve(__dirname, './web/assets'),
  },
})
````

<details>
<summary>View Summary of Changes</summary>

- Sets up `devServer` to work with Craft setup
- Removes `HtmlWebpackPlugin` since Craft takes care of templating
- Removes all `HtmlWebpackPlugin` specific companion plugins
- Adds the `CopyPlugin` to handle images for craft
- Adds the `ManifestPlugin` for things to work with the `craft-rev-plugin`
- Modifies the `output` object to work with Craft setup
</details>

> If running on Docker you must pass the `PRIMARY_SITE_URL` environmental variable to your `yarn` container

```yml
yarn:
  environment:
    - PRIMARY_SITE_URL=<your-primary-site-url>
```

### Replace `webpack.prod.js`

```js
const path = require('path')
const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const common = require('./config/webpack/webpack.common.js')

module.exports = merge(common, {
  target: 'browserslist',
  mode: 'production',
  module: {
    rules: [
      {
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
  plugins: [
    /**
     * Clears the assets with every build
     */
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
    }),
    /**
     * Slightly different than in dev, a hash is added to
     * the filename for cache busting
     */
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './src/images'),
          to: path.resolve(
            __dirname,
            './web/assets/images/[path][name]-[chunkhash][ext]'
          ),
        },
      ],
    }),
    /**
     * Remove the hash from the name of the image files
     * (not the path) so that it can be referenced in Craft
     * templates using Craft asset rev plugin
     */
    new WebpackManifestPlugin({
      fileName: '../manifest.json',
      map: (file) => {
        // modify output for images
        if (/images\/[\S]+\.(?:svg|webp|png|jpg)/.test(file.name)) {
          const modifiedFile = Object.assign({}, file, {
            name: file.name
              .replace('src/', '')
              .replace(/-[^-]{32}\.(svg|webp|png|jpg)/, '.$1'),
          })

          return modifiedFile
        }

        return file
      },
    }),
  ],
  /**
   * Change output.path for Craft cms
   */
  output: {
    publicPath: '/assets/',
    filename: 'js/[name].[contenthash].js',
    path: path.resolve(__dirname, 'web/assets'),
  },
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
```

<details>
<summary>View Summary of Changes</summary>

- Removes `HtmlWebpackPlugin` since Craft takes care of templating
- Removes all `HtmlWebpackPlugin` specific companion plugins
- Adds the `CopyPlugin` to handle images for craft
- Adds the `ManifestPlugin` for things to work with the `craft-rev-plugin`
- Modifies the `output` object to work with Craft setup
</details>

## 5. Configure Craft

### Craft Asset Rev

Set up the [Craft asset rev plugin](https://github.com/clubstudioltd/craft-asset-rev). Webpack will output a `manifest.json` file to `web/`. The configuration for the plugin (`config/assetrev.php`) should look like this:

```php
<?php
return array(
  'manifestPath' => 'web/manifest.json',
);
```

> If this file is not automatically generated so you have to create it

### Adding js to template

Webpack will split out the `runtime` and `vendor` css files into their own bundles. Only add those in production, since they are not split in dev. The conditional makes sure that `rev()` is not returning the same string is passed in (as it would if there is no entry fo it in `manifest.json`):

<!-- {% raw %} -->

```twig
{# templates/index.html or your layout wrapper (before closing body tag) #}

{# runtime and vendors only split in prod #}
{% if craft.app.env != 'dev' %}
  <script src="{{ rev('runtime.js') }}"></script>

  {# vendors could still not exist in prod #}
  {% if rev('vendors.js') != 'vendors.js' %}
    <script src="{{ rev('vendors.js') }}"></script>
  {% endif %}
{% endif %}

<script src="{{ rev('app.js') }}"></script>
```

<!-- {% endraw %} -->

> Keep in mind that to preview a build locally you will have to manually change `.env`. If running on Docker this means making changes inside `docker-compose.yml` specifically to the `php` container's `ENVIRONMENT` environmental variable, and to the `yarn` container's `command`.

```yml
php:
  #...
  environment:
    - ENVIRONMENT=production
  # ...
```

and

```yml
yarn:
  # ...
  command: ['yarn', 'build']
  # ...
```

### Adding css to template

The bundled css file only needs to be added in production. This checks that `rev` isn't just outputting the same string that's going into it (as it would if there is no entry for it in `manifest.json`, ie. in dev)

```twig
{# templates/index.html or your layout wrapper (somewhere in the head) #}
{% if craft.app.env != 'dev' %}
  <link rel="stylesheet" href="{{ rev('app.css') }}">
{% endif %}
```

> Keep in mind that to preview a build locally you will have to manually change `.env`

### Handling SVGs:

Create a macro that handles svgs

<!-- {% raw %} -->

```twig
{%- macro inlineSvg(icon, class='') -%}
  {% set path = '@webroot/' ~ rev('images/icons/' ~ icon ~ '.svg') %}
  {{ svg(path, class=class)}}
{%- endmacro -%}
```

<!-- {% endraw %} -->

> This is a sample inlineSvg macro. It assumes your svg images live in `src/images/icons/`. Replace `icons/` with whatever directory you use for svgs, or modify for your particular use case. Keep in mind that FedPack™ assumes a `src/images` directory exists. **Don't change that part of the structure**.

Use the `inlineSvg` macro:

<!-- {% raw %} -->

```twig
{{ inlineSvg('check', 'rect-icon text-green') }}
```

<!-- {% endraw %} -->

> This will output a file `assets/images/icons/check.svg` with the classes `rect-icon text-green`

For more information on macros see the [Twig docs](https://twig.symfony.com/doc/2.x/tags/macro.html).

### Handling Images:

Use the rev plugin. Eg:

<!-- {% raw %} -->

```twig
<img alt="" class="block rect-logo" src="{{ rev('images/FedPack.jpg') }}"/>
```

<!-- {% endraw %} -->

## 6. FAQ

- I go to `<name>.test:8080` on my browser and things don't look right, why?

`<name>.test:8080` is the URL for the devServer not your craft site. This is a parallel server that hosts your assets to enable hot module replacement.

> `yarn start` starts the devServer. Open the browser to your Craft site's local url (eg. viget.test), **NOT** the dev server url (eg. viget.test:8080), the dev server will only serve assets and is not the same server where Craft is hosted (eg. MAMP or something similar)

## 7. Sample Template

This is a re-implementation of the FedPack™ landing page inside a Craft template (`templates/index.html`)

<!-- {% raw %} -->

```twig
{% import _self as _ %}
{% macro codeline(val) %}
  <code class="text-14 bg-gray-200 px-4">{{ val }}</code>
{% endmacro %}
{%- macro inlineSvg(icon, class='') -%}
  {% set path = '@webroot/' ~ rev('images/icons/' ~ icon ~ '.svg') %}
  {{ svg(path, class=class)}}
{%- endmacro -%}

{% set heading = "mb-16" %}
{% set subheading = "mb-16 text-16" %}

{%- set todo -%}
<div class="border-2 bg-gray-200 inline-block px-4 rounded mr-8">
  {{ _.inlineSvg('check', 'text-transparent rect-icon-xs inline-block') }}
  <span class="sr-only">Todo</span>
</div>
{%- endset -%}

{%- set check -%}
<div class="border-2 border-green bg-green-100 inline-block px-4 rounded shadow mr-8">
  {{ _.inlineSvg('check', 'text-green-500 rect-icon-xs inline-block') }}
  <span class="sr-only">Done</span>
</div>
{%- endset -%}
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta content="IE=edge" http-equiv="X-UA-Compatible"/>
    <meta charset="utf-8"/>
    <title>Welcome to Craft CMS</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta content="origin-when-cross-origin" name="referrer"/>
    {% if rev('app.css') != 'app.css' %}
      <link rel="stylesheet" href="{{ rev('app.css') }}">
    {% endif %}
  </head>
  <body class="ltr">
    <header class="flex items-center p-16 mb-16 bg-gray-200">
      <a class="block mr-16 border" href="https://github.com/vigetlabs/FedPack">
        <img alt="FedPack™ Logo" class="block rect-logo" src="{{ rev('images/FedPack.jpg') }}"/>
      </a>
      <div>
        <h1>FedPack™
          <small class="bg-white border rounded p-4 ml-4">
            <code>craft sample</code>
          </small>
        </h1>
        <p>Webpack isn't hard, it's just the worst</p>
      </div>
    </header>

    <main class="p-16">
      <section class="mb-24 pb-24" id="features">
        <h2 class="{{ heading }}">Features</h2>

        <div class="md:flex">
          <article class="md:w-1/3 mb-24 md:mb-0 md:pr-16">
            <h3 class="{{ subheading }}">General</h3>
            <ul class="list">
              <li>{{ check }} Make static one pagers</li>
              <li>{{ check }} fonts using {{ _.codeline("@font-face") }}</li>
              <li>{{ check }} Images</li>
              <li>{{ check }} Inline SVGs (no wrapper needed to style)</li>
              <li>{{ check }} Tailwind {{ _.codeline('0.7.x') }}
                setup</li>
              <li>{{ check }} Templating with Twig</li>
              <li>{{ check }} <a href="https://github.com/vigetlabs/FedPack" target="_blank">README documentation</a>
              </li>
              <li>{{ check }} Favicon</li>
              <li>{{ check }} Welcome Page (this page)</li>
              <li>{{ check }} Branded FedPack™ Experience</li>
            </ul>
          </article>
          <article class="md:w-1/3 mb-24 md:mb-0 md:px-32">
            <h3 class="{{ subheading }}">Development</h3>
            <ul class="list">
              <li>{{ check }} Development server ready: {{ _.codeline('yarn start') }}</li>
              <li>{{ check }} CSS Hot Module Replacement</li>
              <li>{{ check }} JS Hot Module Replacement</li>
              <li>{{ check }} Reload on template edit</li>
              <li>{{ check }} PurgeCss</li>
            </ul>
          </article>
          <article class="md:w-1/3 md:pl-16">
            <h3 class="{{ subheading }}">Production</h3>
            <ul class="list">
              <li>{{ check }} Production ready: {{ _.codeline('yarn build') }}</li>
              <li>{{ check }} Extract manifest.js</li>
              <li>{{ check }} PurgeCss</li>
            </ul>
          </article>
        </div>
      </section>

      <section data-module="sample" id="sandbox" class="mb-24 border p-16">
        <h2 class="{{ heading }}">Sandbox</h2>
        <p class="mb-12 md:w-1/2">Sample component (see:
          {{_.codeline("./src/css/buttons.css")}}) and module (see:
          {{_.codeline("./src/js/modules/sample.js")}}):</p>
        <p class="counter"></p>
        <button class="btn mb-8">Button</button>
      </section>
    </main>

    <footer class="p-24">
      <p class="text-center">You are going to need
        <a href="https://i.imgur.com/ZZn0jrI.gifv" target="_blank">this</a>
      </p>
    </footer>

    {# runtime only split in prod #}
    {% if rev('runtime.js') != 'runtime.js' %}
      <script src="{{ rev('runtime.js') }}"></script>
    {% endif %}

    {# vendors only split in prod #}
    {% if rev('vendors.js') != 'vendors.js' %}
      <script src="{{ rev('vendors.js') }}"></script>
    {% endif %}

    <script src="{{ rev('app.js') }}"></script>
  </body>
</html>
```

<!-- {% endraw %} -->

## 8. Testing and Formatting

### `.editorconfig`

Depending on your project you may want to uncomment the optional PHP settings

```
# Optional PHP settings (varies per project)
[*.{php,py,html}]
indent_style = space
indent_size = 4
```

### Jest

We don't want to test anything inside `node_modules/`, `web/`, or `vendor/` so we will add those paths to the `testPathIgnorePatterns` array in `test/jest-common.js`

```js
module.exports = {
  ...
  testPathIgnorePatterns: [
    '<rootDir>/web/',
    '<rootDir>/node_modules/',
    '<rootDir>/vendor/'
  ]
  ...
}
```

> For more on testing see the main FedPack™ documentation

### Cypress

As long as the changes to `package.json` at the beginning of this document are done everything should work after changing the `baseUrl` in `cypress.json`:

```json
{
  "baseUrl": "http<s?>://<replace-me>.test",
  "integrationFolder": "cypress/e2e"
}
```

### Local Network Availability

Local network availability is driven by the `.env` file and the `FRONTEND_HOSTNAME` variable. You must configure Craft to use the `FRONTEND_HOSTNAME` when provided. These setups vary depending on whether you are using Docker, Mamp, or something else.

The variable looks like this in a `.env` file:

```
# .env
...
FRONTEND_HOSTNAME=my-computer.local
...
```

The variable looks like this in a `docker-compose.yml` file:

```
  yarn:
    environment:
      - FRONTEND_HOSTNAME=my-computer.local
```

> To find out what your computer name on the network is either go to Settings > Sharing > Look at the host name under the "Computer Name" input or run `scutil --get LocalHostName` and append `.local` to the output. This name is editable.

`webpack.dev.js` is set up to use `process.env.PRIMARY_SITE_URL` or `process.env.FRONTEND_HOSTNAME` depending on whether `FRONTEND_HOSTNAME` exists. The important things to do are:

- Make sure Craft uses `FRONTEND_HOSTNAME` as the `siteUrl` if `FRONTEND_HOSTNAME` is provided (since it will be used by webpack)
- If you provide a `FRONTEND_HOSTNAME` navigate to that when viewing your site, not the `PRIMARY_SITE_URL`.

Configuration for Craft would look like this:

```php
// general.php
'dev' => [
    'siteUrl' => 'http://' . getenv('FRONTEND_HOSTNAME') ?? getenv('PRIMARY_SITE_URL'),
],
```

**More in depth explanation:**

On dev Webpack serves your assets from a different server than Craft. Assets need to come from the same domain otherwise things break. This is why when we use `FRONTEND_HOSTNAME` we need to visit our dev site at that domain and not any other (that's where the assets are coming from). This becomes extra important if you are trying to hit graphQL or REST endpoints that would otherwise cause CORS issues.
