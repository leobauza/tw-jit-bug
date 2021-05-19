---
layout: default
title: Introduction
nav_order: 2
---

# Introduction

**By default FedPack™ is set up for building a multi-page or single page site using:**

- PostCss (with Tailwind)
- Twig Templating
- Vanilla JS following the Viget `data-module` pattern with Hot Module Replacement baked in (see Data Module Pattern section below)

**FedPack™ can handle:**

- Images
- Fonts
- Inline SVG's (without requiring a wrapper for styling)
- Multiple pages

## Goals

FedPack™ should be:

1. A tool for learning about build tools (using webpack)
2. A tool for learning about the FED process
3. A build tools starter pack that can be modified with various recipes for any type of project\*
4. A tool for quick prototyping
5. A tool for quick single page/multipage site development

> Any type of project that doesn't have a better option for build tools (eg. Gatsby has its own set of build tools that work great for that type of project, no need for FedPack™.)

## Out-of-the-box features:

### Dev environment:

- Hot Module Replacement (HMR) for js
- Hot Module Replacement (HMR) for css
- Reloading HTML/Twig files on save (via `postcss.config.js` custom plugin)
- PurgeCss
- Prettier config in `.prettierrc` (`yarn prettify`)
- Eslint config in `.eslintrc` (`yarn fix-js`)
- Stylelint config in `.stylelintrc` (`yarn fix-css`)
- Formatting of all js and css via `yarn format` (combines the previous 3 commands)
- Webpack devServer running on `localhost`
- Testing with Jest and Cypress (`yarn test` & `yarn test:e2e`)
- Local network availability

### Prod environment:

- Cache busting with contenthashes
- Splitting runtime and node_modules chunks
- CSS extraction + PurgeCss + cssnano
- Manifest file extraction
- HTML minification
- Preview build with [serve](https://github.com/zeit/serve)
