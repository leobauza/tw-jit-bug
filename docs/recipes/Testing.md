---
layout: default
title: Testing
parent: Recipes
nav_order: 5
---

# Testing

- [Testing](#testing)
  - [Jest](#jest)
  - [Cypress (e2e)](#cypress-e2e)
  - [A11y Testing](#a11y-testing)
  - [More](#more)

It is highly recommended to go through [Kent C. Dodds Testing Javascript](https://testingjavascript.com/) course to learn more about testing. This recipe is a brief overview of how to write tests with a special focus on how to test the `data-module` pattern used in FedPack™.

## Jest

Tests are collocated with the files they test inside `src/`. Tests should generally live inside a `__tests__/` directory. A commented example can be found in `src/js/modules/__tests__/sample.js`.

By default [DOM Testing Library](https://testing-library.com/docs/dom-testing-library/intro) is included to help test DOM nodes.

## Cypress (e2e)

Tests are in `cypress/e2e/`. A commented example can be found in `cypress/e2e/modules/sample.js`.

## A11y Testing

The bare minimum amount of testing on every project should be automated a11y testing using Cypress, `cypress-axe`, and `axe-core`.

FedPack™ comes configured with cypress and a11y testing for the landing page. A commented example can be found in `cypress/e2e/a11y.js`.

## More

Consider adding [jest-dom](https://github.com/testing-library/jest-dom) to your project if you will be doing testing. If you do, make sure to also add and configure [eslint-plugin-jest-dom](https://github.com/testing-library/eslint-plugin-jest-dom).
