---
layout: default
title: Contributing
nav_order: 7
---

# Contributing

Thanks for your interest.

- [Contributing](#contributing)
  - [Versions](#versions)
    - [Patch Release](#patch-release)
    - [Minor Release](#minor-release)
    - [Major Release](#major-release)
  - [Instructions for Release](#instructions-for-release)

## Versions

Roughly follow [Semver](https://semver.org/).

Make PRs against the latest appropriate version branch. How do I know which version branch is appropriate?

### Patch Release

Fixes a minor bug or **only** adds documentation (eg. adds `doc/` sections, fix spelling errors, etc.)

### Minor Release

There are no breaking changes. Someone could copy your changes and keep their `src/` and everything would continue to work normally (in fact better.)

### Major Release

There are breaking changes. If someone copied your changes they would need to follow an upgrade guide for their `src/` to adhere to the new standards.

## Instructions for Release

**Before starting release process do the following:**

1. Update main `README.md` documentation (pay special attention to the packages list, recipes list, and any new scripts)
2. Update recipes `README.md` documentation
3. Run through the [QA List](./QA-list.md)
4. Fix anything that is broken

**Before a release do the following:**

1. Be on a version branch (eg. `version-major.minor.patch`)
2. Up `package.json` version to match the branch
3. Push and make a PR comparing version branch with `main`
4. If 👍 then merge version branch into `main`
5. On Github go to "Releases" => "Draft a new release" => Give it a dope title that somehow relates to foxes => List relevant changes in the description
