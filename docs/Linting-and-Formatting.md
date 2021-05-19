---
layout: default
title: Linting and Formatting
nav_order: 4
---

# Linting & Formatting

Basic usage:

```bash
yarn format
```

- [Linting & Formatting](#linting--formatting)
  - [Scripts](#scripts)
    - [JS](#js)
    - [CSS](#css)
    - [Prettier](#prettier)
    - [Lint-staged hook](#lint-staged-hook)
    - [Everything](#everything)
  - [Configuration](#configuration)
    - [Additional Configuration](#additional-configuration)

## Scripts

There are four categories of scripts for formatting and linting code:

### JS

- **Check**: `yarn lint-js` runs eslint on `src/js/` without any flags using config in `.eslintrc`
- **Fix**: `yarn fix-js` runs `lint-css` with the `--fix` flag

### CSS

- **Check**: `yarn lint-css` runs stylelint on `src/css` without any flags using config in `.stylelintrc`
- **Fix**: `yarn fix-css` runs `lint-js` with the `--fix` flag

### Prettier

- **Check**: `yarn prettier` runs prettier without any flags on all files matching `js|jsx|json|yml|yaml|css|less|scss|ts|tsx|md|mdx|graphql|vue` inside `src/` using config in `.prettierrc`
- **Fix**: `yarn prettify` runs `prettier` with the `--write` flag
  = **Editor Setting** we have formatOnSave enabled right now for VSCode editors, so you will see code being prettified as you type.

### Lint-staged hook

- Before you commit, Husky will run both the linter and prettier on all the files you've touched and fix any errors automatically (if their extension is included in the list of matching files from the prettier check above)

### Everything

- **Check**: `yarn validate` runs a combination of `lint-js`, `lint-css` and `prettier` and returns any errors without fixing them
- **Fix**: `yarn format` runs a combination of `fix-js`, `fix-css` and `prettify`, automatically fixing any errors it can

> You will probably only ever need `yarn format`

## Configuration

There are four files that can work with your editor to automatically format your code or warn you of errors:

- `.prettierrc` minimal configuration for [prettier](https://prettier.io/)
- `.stylelintrc` uses [stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard), [stylelint-config-prettier](https://github.com/prettier/stylelint-config-prettier), and [styleling-order](https://github.com/hudochenkov/stylelint-order). Also See: [stylelint](https://stylelint.io/)
- `.editorconfig` (see: [editorconfig](https://editorconfig.org/))
- `.eslint` uses (see: [eslint](https://eslint.org/)):
  - [eslint:recommended](https://eslint.org/docs/rules/) and
  - [babel-eslint parser](https://github.com/babel/babel-eslint).

### Additional Configuration

We are using the [DOM testing library](https://testing-library.com/docs/dom-testing-library/intro) you may want to add and configure [eslint-plugin-testing-library](https://testing-library.com/docs/ecosystem-eslint-plugin-testing-library/)
