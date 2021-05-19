# FedPack™

Webpack isn't hard, it's just the worst.

Visit the [docs](/docs/README.md) for complete documentation.

## Quickstart

Most relevant files are in `src/` (ie. html, css, javascript, images, and fonts.) `tailwind.config.js` is located at the root directory.

**Clone the repo**

Use the "Use this template" button to create your own repo with FedPack™ as the template, then:

```
git clone <your-github-url> <your-project-directory-name> && cd <your-project-directory-name>
```

**Set node version**

See `.nvmrc` or `.tool-versions` depending on your preferred node version management tool. Follow documentation for your tool to install and use the correct node version.

**Install dependencies**

```
yarn install
```

**Start the dev server:**

```
yarn start
```

Alternatively if doing Cypress driven development

```
yarn test:e2e
```

If it doesn't automatically open go to: `http://localhost:8080/`. If using Cypress it should automatically open as well.

> if something is already running on port `8080` FedPack™ will run on the next avaialable port. You can check the terminal output and should see a line that specifies where the project is running (eg. `ℹ ｢wds｣: Project is running at http://0.0.0.0:8080/` and `Opening on: http://localhost:8080`)

**Local Network Availability**

To access the site on a local address like `mycomputer.local` add `allowedHosts: ['.mycomputer.local']` to the Webpack Dev Server configuration in `webpack.dev.js`

```js
devServer: {
  ...
  allowedHosts: ['.mycomputer.local'],
  ...
}
```

> Computer name found on mac at System Preferences > Sharing > under "Computer Name:" input

**Run tests as you develop**

```
yarn test
```

This will start Jest in watch mode

**Format your code:**

```
yarn format
```

This will use prettier, eslint, and stylelint with the default settings to prettify and fix all the js/css in `src/`.

**Once development is done make a production build:**

```
yarn validate
```

This runs all test and builds to `public/`, preview the build by running:

```
yarn serve
```

This serves the contents of the `public/` folder. Navigate to `http://127.0.0.1:8080/` to view.
