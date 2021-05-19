import '../css/before.css'
import '../css/styles.css'
import '../css/after.css'

import 'what-input'

const dataModules = [...document.querySelectorAll('[data-module]')]

console.log('it works!')
const storage = {}

dataModules.forEach((element) => {
  element.dataset.module.split(' ').forEach(function (moduleName) {
    import(
      /* webpackChunkName: "[request]" */
      `./modules/${moduleName}`
    ).then((Module) => {
      storage[moduleName] = new Module.default(element)
    })
  })
})

if (module.hot) {
  module.hot.accept()
  module.hot.dispose(() => {
    dataModules.forEach((element) => {
      element.dataset.module.split(' ').forEach(function (moduleName) {
        if (storage[moduleName].cleanUp) {
          storage[moduleName].cleanUp()
        } else {
          console.warn(`missing cleanup method in ${moduleName}`)
        }
      })
    })
  })
}
