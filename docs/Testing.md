---
layout: default
title: Testing
nav_order: 5
---

# Testing

Testing is done using [Jest](https://jestjs.io/) as a framework for testing (with help from the [DOM Testing Library](https://testing-library.com/docs/dom-testing-library/intro)). For end-to-end (e2e) testing we use [Cypress](https://www.cypress.io/).

- [Testing](#testing)
  - [Scripts](#scripts)
  - [Configuration](#configuration)
  - [How to test](#how-to-test)

## Scripts

There are two scripts that will most likely be running while development happens:

**1)** To run Jest in watch mode use:

```
yarn test
```

**2)** To open Cypress:

```
yarn test:e2e
```

> **note:** FedPack™ is setup so `yarn test` and `yarn test:e2e` can also be called in a CI (continuous integration) environment. Under the hood `yarn test` calls `yarn test:watch` in dev and `yarn:test:coverage` in CI, while `yarn test:e2e` calls `yarn test:e2e:open` in dev and `yarn test:e2e:run` in CI.

Validation is the last important script to remember. This headlessly runs all the tests.

```
yarn validate
```

The full list of testing scripts:

```js
"test": "is-ci \"test:coverage\" \"test:watch\"", // explained above
"test:watch": "jest --watch", // runs Jest in watch mode
"test:coverage": "jest --coverage", // runs Jest and produces the coverage report
"test:e2e": "is-ci \"test:e2e:run\" \"test:e2e:open\"", // explained above
"cy:run": "cypress run", // runs cypress headlessly
"cy:open": "cypress open", // opens cypress for development
"pretest:e2e:run": "yarn build", // automatically runs before `yarn test:e2e:run` to build the site before testing
"test:e2e:run": "start-server-and-test serve http://localhost:8080 cy:run", // first starts the server and then calls cy:run
"test:e2e:open": "start-server-and-test start http://localhost:8080 cy:open", // first starts the server and then calls cy:open
"validate": "yarn test:coverage && yarn test:e2e:run" // explained above
```

## Configuration

**Jest:**

The main configuration file for Jest is `jest.config.js`. `test/` contains "project" configurations for various purposes:

- `jest.common.js`: Shared jest configuration
- `jest.client.js`: Basic js testing
- `jest.lint.js`: Uses the `jest-runner-eslint` to lint js with Jest
- `jest.stylelint.js` Uses the `jest-runner-styelint` to link css with Jest

> **note:** eslint and stylelint runners are used so that there can be a single test script that runs everything. Ie. running `yarn test` will run tests, js linting, and css linting.

**Cypress**

The main configuration file for Cypress is `cypress.json` All it does is set the base url (so test's don't have to navigate to it when cypress loads) and changes the integration folder to have a better name `e2e/`.

## How to test

See the [Testing recipe](recipes/Testing-Recipe.md) for details on how to write tests.
