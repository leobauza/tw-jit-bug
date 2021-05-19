---
layout: default
title: Project Structure
nav_order: 6
---

# Project Structure

A list of technology choices, types of project, and folder structure that need to be addressed and thought about to create recipes and organize the FedPack™ repo.

- [Project Structure](#project-structure)
  - [Possible Workflow](#possible-workflow)
  - [Technology Choices](#technology-choices)
  - [Project Types](#project-types)

## Possible Workflow

> Consider the `Use This Template` button to create a new repo to start from. Or downloading as a zip.

1. Clone this project using `git clone git@github.com:vigetlabs/FedPack.git --single-branch --branch main --depth 1 <project-dir-name> && cd <project-dir-name>`.
2. Determine type of project & technology choices
3. Look for recipes in `recipes/` and make changes
4. Change folder structure to accomodate any other project needs
5. Modify `webpack/webpack.common.js`, `webpack/webpack-common-plugins.js`, `webpack.dev.js`, and `webpack.prod.js` accordingly
6. Modify any other configuration files

## Technology Choices

These are the technologies will be supported by FedPack™

<details>
<summary>View Technology Choices</summary>

```yaml
CSS
  - postcss + tailwind # default
  - postcss # remove tailwind (otherwise already set up)
  - scss # see scss recipe
JS
  - vanilla js # default
FONTS
  - @font-face fonts # default
IMAGES
  - webp|jpg|png|gif # default (handled by Asset Modules) [no-optim]
  - svg (inlined) # default (handled by custom HTMLWebpack plugin inliner) [no-optim]
  - svg (css) # default (handled by Asset Modules) [no-optim]
HTML
  - twig # default
  - plain html # change html loader / convert .twig => .html
```

</details>

## Project Types

<details>
<summary>View Project Types</summary>

```yaml
- Single page static site # default (uses HTMLWebpackPlugin)
- Multi page static site # default (uses HTMLWebpackPlugin)
- Craft # see recipes/craft/README.md
```

</details>
