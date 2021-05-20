# Tailwing JIT Breaks with multiple entries

The Problem:

When there are multiple entry points that import css in webpack JIT does not behave as expected.

To reproduce the problem:

1. Start dev server with `yarn start`
2. Open `tailwind.config.js`
3. Change the value of `spacing[150]`
4. There will be no change until the `src/css/styles.css` file is saved
5. Open `./src/js/second.js`
6. Comment out the line: `import '../css/second.css'`
7. Doing step 2 and 3 results in a normal HMR update
