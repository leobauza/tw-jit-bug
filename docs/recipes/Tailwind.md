---
layout: default
title: Tailwind
parent: Recipes
nav_order: 4
---

# Tailwind

- [Tailwind](#tailwind)
  - [Tailwind `1.x`](#tailwind-1x)
  - [Modifications](#modifications)
    - [Using `@viget/tailwindcss-plugins`](#using-vigettailwindcss-plugins)
    - [Add max-width breakpoints](#add-max-width-breakpoints)
    - [Preflight and container turned off](#preflight-and-container-turned-off)
    - [Don't use size values (for the most part)](#dont-use-size-values-for-the-most-part)
    - [Modified properties](#modified-properties)
  - [Plugin Suggestions](#plugin-suggestions)
    - [Tailwind 1.2 Changes](#tailwind-12-changes)
    - [Tailwind 1.4 Changes](#tailwind-14-changes)

## Tailwind `1.x`

FedPack™ uses [Tailwind](https://tailwindcss.com/) by default. This recipe explains some of the modifications to the default tailwind setup and provides a list of tailwind plugins that may come in handy.

---

## Modifications

Out of the box, FedPack™ makes some of the most common changes you may want to make to your tailwind setup.

### Using [`@viget/tailwindcss-plugins`](https://github.com/vigetlabs/tailwindcss-plugins)

We pull three helper functions and two plugins by default from our designated repo for shared tailwind resources:

- [`em()`](https://github.com/vigetlabs/tailwindcss-plugins/blob/main/utilities/fns)
- [`remPair()`](https://github.com/vigetlabs/tailwindcss-plugins/blob/main/utilities/fns)
- [`pxPair()`](https://github.com/vigetlabs/tailwindcss-plugins/blob/main/utilities/fns)
- [rect plugin](https://github.com/vigetlabs/tailwindcss-plugins/blob/main/plugins/rect)
- [sr plugin](https://github.com/vigetlabs/tailwindcss-plugins/blob/main/plugins/sr)

For more reusable plugins or custom plugin examples, visit that repo.

### Add max-width breakpoints

It's sometimes useful to have `max-width` breakpoints. We add a `-d` after our screen sizes to indicate these are screen breakpoints going "down".

```js
{
  'sm-d': { max: em(639) },
  'md-d': { max: em(767) },
  'lg-d': { max: em(1023) },
  'xl-d': { max: em(1279) }
}
```

### Accessibility and container turned off

The core plugin `accessibility` is turned off; our own `sr` plugin replaces it (see above). The core plugin `container` is also turned off (you may consider using `tailwindcss-fluid-container`).

```js
corePlugins: {
  accessibility: false,
  container: false
}
```

### Don't use size values (for the most part)

Instead of using keys like `sm`, `md`, `lg`, etc., prefer pixel value keys. When a design changes it is hard to find an intermediate between something like `sm` and `md`, this isn't a problem when using pixel value keys. Using pixel value keys also reduces the need to remember what size corresponds to what pixel value when implementing a design.

**If** you have buy-in on committing to a **strict** design system, semantic values can (and likely should) be used for some things, like text sizes. However, this would need to be established and agreed upon prior to the start of design.

eg.

**DON'T DO THIS:**

```js
{
  sm: '4px',
  md: '8px',
  lg: '12px'
}
```

**Do this instead:**

```js
{
  ...pxPair(4),
  ...pxPair(8),
  ...pxPair(12),
}
```

> Anywhere where the default tailwind config uses size values they have been replaced with our preferences and the keys have been changed to be numeric.

### Modified properties

We've modified properties using the functions mentioned above and with more commonly used values.

---

## Plugin Suggestions

There is a growing list of our own plugins that can be easily imported using [`@viget/tailwindcss-plugins`](https://github.com/vigetlabs/tailwindcss-plugins). Some additional third-party plugins we sometimes use that are not added by default include:

- [tailwindcss-aspect-ratio](https://github.com/webdna/tailwindcss-aspect-ratio)
- [tailwindcss-multi-column](https://github.com/hacknug/tailwindcss-multi-column)
- [tailwindcss-fluid-container](https://github.com/benface/tailwindcss-fluid-container)

### Tailwind 1.2 Changes

Tailwind 1.2 replaced a lot of plugins with default support, including:

- [transforms](https://tailwindcss.com/docs/translate/) (specifically `translateX`, `translateY`, `rotate`, `scale`, and `transform-origin`)
- [transitions](https://tailwindcss.com/docs/transition-property/)
- [grid](https://tailwindcss.com/docs/grid-template-columns)

However, `transforms` specifically makes use of **CSS custom properties**, which are not supported in IE11.

### Tailwind 1.4 Changes

Tailwind 1.4 introduced more usage of **CSS custom properties** (e.g. the nicely composable property-specific opacity utilities), as well as a new concept that is aware of the growing contingent of modules without IE support: [`target`](https://github.com/tailwindcss/tailwindcss/releases#ie-11-target-mode).

FedPack uses the Tailwind default setting of `browserslist`, which checks [.browserslistrc](../../.browserslistrc) for IE 11 support. If it sees you are supporting IE, it will do a number of helpful things, including converting the `transform`, `space` and `divide` to compatible versions and removing (by default) utilities for properties IE doesn't support, such as `grid` and `object-fit`.

This feature is extensively described [in its PR](https://github.com/tailwindcss/tailwindcss/pull/1635), including a full list of affected plugins.

If you want more control, you can still turn individually on disabled plugins. For instance, if you were using `object-fit` only on mobile or were including a polyfill, you could add:

```js
// tailwind.config.js
module.exports = {
  target: [
    'browserslist',
    {
      objectFit: 'relaxed',
      objectPosition: 'relaxed',
    },
  ],
  theme: {},
  variants: {},
  plugins: [],
}
```

While not recommended, you can also turn this off completely, either by removing IE 11 from your `.browserslistrc` or changing the config to `target: relaxed`.
