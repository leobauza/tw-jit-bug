---
layout: default
title: QA List
nav_order: 8
---

# QA List

- [QA List](#qa-list)
  - [Installation](#installation)
  - [Dev](#dev)
  - [Local Network](#local-network)
  - [Prod Build](#prod-build)
  - [Testing](#testing)
  - [Recipes](#recipes)

This list should contain all the things to check when updating or changing FedPack™ in any way.

## Installation

- Delete `node_modules/`
- Run `yarn`
- Make sure everything installs and there are no errors

Visually check that `yarn start` opens a working site (and that you can navigate to "page 2")

## Dev

- Run `yarn start`
- Make sure the site automatically opens
- Make sure the site is working (styles and js load)
- Navigate to `page 2` and make sure it's working
- Open `src/css/base/core.css` make a change and make sure HRM is working for css (make sure to undo your changes.)
- Open `/src/js/modules/sample.js` make a change and make sure HRM is working fo JS (make sure to undo your changes.)
- Open `/src/layout.twig` make a change and make sure the page reloads with our changes (make sure to undo your changes.)
- In `/src/layout.twig` change the header background to a background color that has been purged by purgeCSS to make sure purgeCSS is working correctly (eg. `bg-orange-600`)

## Local Network

- Open the site on a different device using your compuer IP (don't forget the port)
- Make sure the site is works the same as above.

> This can also be tested using `mycomputer.local:<port>`. To set that up make sure to consult the [README.md](../README.md)

## Prod Build

- Run `yarn build`
- Run `yarn serve` and visit the local adress provided
- Checks styles, js, and `page 2` are working

## Testing

- Run `yarn validate` to make sure nothing is broken

## Recipes

- If you have edited a recipe make sure to run through the steps for that recipe to ensure it is still working as expected.
- There is no automated or easy way to check recipes at the moment
