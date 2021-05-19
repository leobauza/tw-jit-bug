---
layout: default
title: Multiple Pages
parent: Recipes
nav_order: 2
---

# Multiple Pages

- [Multiple Pages](#multiple-pages)
  - [Configure Pages](#configure-pages)
  - [Removing Multiple pages](#removing-multiple-pages)
  - [Creating a New Template](#creating-a-new-template)
  - [Pass Data to Templates](#pass-data-to-templates)

## Configure Pages

Pages are configured in `config/webpack/pages.js`. The steps to create a new page are:

1. Create a new twig file in `src/`
2. Add a new route to the routes object (the key should be the **filename**, and the value should be the **template path**)

eg.

```js
const routes = [{ '/': 'src/index.twig' }, { 'sample.html': 'src/sample.twig' }]
```

> The first entry must always be the `index` and the path should be set to `/`

---

## Removing Multiple pages

To do this remove all objects from the `module.exports` array above except for the `index`

---

## Creating a New Template

To create a new template you may extend `layout.twig` and then put your content inside the `content` block.

<!-- {% raw %} -->

```twig
{% extends "layout.twig" %}

{% block content %}
  <main class="p-16">
    <section id="second-page" class="mb-20 pb-20">
      <h2>Second Page</h2>
    </section>
  </main>
{% endblock %}
```

<!-- {% endraw %} -->

> You can edit `layout.twig` according to your needs

---

## Pass Data to Templates

Modify the `data` option for the `twig-html-loader` in `config/webpack/webpack.common.js` to return data the twig templates will have access to.

```js
...
options: {
  data: context => {
    return {
      title:
        context.resourcePath.indexOf('sample.twig') >= 0
          ? 'Sample'
          : 'Homepage'
    }
  }
}
```

> The default example checks the resourcePath against "sample.twig" and set the title to "Sample or "Homepage". This title variable is then accessed by the Twig templates:

```twig
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>{{ title }}</title>
  </head>
...
```
