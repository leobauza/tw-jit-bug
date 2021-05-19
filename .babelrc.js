// is this running on a test environment (ie. Jest)?
const isTest = String(process.env.NODE_ENV) === 'test'

module.exports = {
  // by default babel does nothing...plugins are what make it change your code
  plugins: [
    /**
     * a plugin that allows class properties
     *
     * class MyClass {
     *   myProperty = '' // <= this is a class property
     * }
     */
    '@babel/plugin-proposal-class-properties',
    /**
     * a plugin that allows dynamic imports
     *
     * eg:
     * import(`./modules/sample`).then(Module => {
     *   new Module.default()
     * })
     */
    '@babel/plugin-syntax-dynamic-import',
  ],
  // presets are preassembled sets of plugins
  presets: [
    [
      /**
       * this preset "allows you to use the latest JavaScript without needing
       * to micromanage which syntax transforms"
       */
      '@babel/env',
      {
        /**
         * Enable debug mode to see things like:
         *
         * - targetted browsers
         * - plugin usage
         * - polyfills added
         */
        // debug: true,
        /**
         * Makes sure babel doesn't transform `import/export` statments into `require/module.exports`
         * statements (aka not ES6 modules), which webpack can't statically analyze. One of the
         * reasons this matters is that using ES6 modules enables some webpack features like tree
         * shaking (https://webpack.js.org/guides/tree-shaking/)
         *
         * When using babel in a test environment (ie. a Jest environment) we do want `import/export`
         * statments transformed into `require/module.exports`. This is because Jest runs in node
         * and node doesn't understand `import/export` statements.
         *
         * Sources:
         * - https://dev.to/jnielson94/demystifying-babel-preset-env-3h88
         * - https://testingjavascript.com/lessons/jest-compile-modules-with-babel-in-jest-tests
         */
        modules: isTest ? 'commonjs' : false,
        /**
         * Adds specific imports for polyfills when they are used in each file.
         * no need to add "@babel/polyfill"
         *
         * eg.
         *
         * const b = new Map();
         *
         * will cause this import:
         *
         * import "core-js/modules/es6.map";
         */
        useBuiltIns: 'usage',
        /**
         * Specifies the version of core-js
         * see: https://babeljs.io/docs/en/babel-preset-env#corejs
         */
        corejs: '3',
      },
    ],
  ],
}
