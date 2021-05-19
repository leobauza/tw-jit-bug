---
layout: default
title: data-module Pattern
parent: Recipes
nav_order: 1
---

# `data-module` Pattern

- [`data-module` Pattern](#data-module-pattern)
  - [Usage](#usage)
  - [How it works](#how-it-works)
  - [Testing modules](#testing-modules)

## Usage

Use the `data-module` attribute to reference a module in `src/js/modules/`

```html
<button data-module="sample">Button</button>
```

That will automatically load `src/js/modules/sample.js`:

```js
export default class Sample {
  constructor(el) {
    this.el = el
    this.setVars()
    this.bindEvents()
  }

  setVars() {
    /**
     * set any variables the module will need
     *
     * eg.
     *
     * this.button = this.el.querySelector('.btn')
     */
  }

  bindEvents() {
    /**
     * bind any events for the module (don't forget to
     * clean up for HMR)
     *
     * eg.
     * this.el.addEventListener('click', this.myMethod)
     */
  }

  cleanUp() {
    /**
     * remove event listeners, cancel any timers, etc
     */
  }

  // ...more methods for the module
}
```

> **note:** for Hot Module Replacement to work correctly the `cleanUp` method is **required**

---

## How it works

A simplified version of `src/js/index.js` looks like this:

```js
const dataModules = [...document.querySelectorAll('[data-module]')]

dataModules.forEach((element) => {
  element.dataset.module.split(' ').forEach(function (moduleName) {
    import(`./modules/${moduleName}`).then((Module) => {
      new Module.default(element)
    })
  })
})
```

Going line by line to explain what is going on:

Starting with the first line. The first thing the code does is select any element with a [data attribute](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes) of `data-module`.

```js
const dataModules = [...document.querySelectorAll('[data-module]')]
```

Then the code loops through these elements.

```js
dataModules.forEach((element) => {
  // code inside the forEach
})
```

Inside the loop it gets the value of the `module` key stored in the [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLOrForeignElement/dataset) property. Then it splits that value on a space (<code>&nbsp;</code>) in case there is more than 1 module being loaded, and to turn the value into an array.

```js
element.dataset.module.split(' ')
```

Each value in the array produce above is a module name that will correspond to a file name inside `src/js/modules`.

```js
.forEach(function(moduleName) {
  // code inside the forEach
})
```

The module is imported using [dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)

```js
import(`./modules/${moduleName}`)
```

> note: webpack does fancy code splitting when [using dynamic imports](https://webpack.js.org/guides/code-splitting/#dynamic-imports)

Finally the dynamic import returns a promise with a `Module` that can be instantiated with the element that contains the `data-module` attribute (assuming the module is written correctly see the `sample.js` module).

```js
.then(Module => {
  new Module.default(element)
})
```

---

## Testing modules

For a commented sample test of a module see: `src/js/modules/__tests__/sample.js`
