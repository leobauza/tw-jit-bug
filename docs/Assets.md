---
layout: default
title: Assets
nav_order: 3
---

# Assets

- [Assets](#assets)
  - [CSS](#css)
  - [Fonts](#fonts)
  - [Images](#images)
  - [SVG Icons](#svg-icons)

## CSS

Why is the CSS file being imported in `src/js/index.js`?

1. Webpack in development mode will create a `style` tag in the `<head>` and output all the styles by using the `style-loader`. `style-loader` has Hot Module Replacement capabilities so CSS code can be updated without a page refresh.
2. Webpack in production mode will use `MiniCssExtractPlugin` to extract the CSS into its own file and remove the import from the javascript.

## Fonts

Fonts can be added to `src/fonts/` and referenced in CSS. See: `src/css/base/fonts.css` for more information and sample `@font-face` declarations.

## Images

Images can be added to `src/images/` and referenced in CSS normally:

```css
.selector {
  background: url('../images/sample-image.jpg');
}
```

Or in twig templates:

```html
<img src="./images/FedPack.jpg" alt="" />
```

## SVG Icons

SVG icons can be added to `src/images/icons/` and inlined into twig templates:

```html
<img
  inline
  aria-hidden="true"
  class="text-green-500 rect-icon-xs inline-block"
  src="./src/images/icons/check.svg"
/>
```

**A few notes:**

- The `<img>` tag with the `inline` attribute is provided by the custom webpack plugin `FPHTMLWebpeckInlineSvgPlugin` more information in the [Build Tools `FPHTMLWebpeckInlineSvgPlugin` section](Build-Tools.md#fphtmlwebpeckinlinesvgplugin). It **will not** work if not using the HtmlWebpackPlugin.
- There is a CSS rule in `src/css/base/core.css` that sets all SVG fills to `currentColor`. This allows the `text-black` utility class to set the SVG's color (`color: #000`)
- The `src` **must** be relative to the root of the project (that's just how the plugin works.)
- All attributes that are **not** `src` or `inline` will be passed to the inlined svg
