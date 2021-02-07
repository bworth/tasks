# Tasks

[![Build status](https://github.com/bworth/tasks/workflows/Build%20status/badge.svg?branch=main&event=push)](https://github.com/bworth/tasks/actions?query=workflow%3A%22Build+status%22+branch%3Amain)
[![LICENSE](https://img.shields.io/github/license/bworth/tasks?color=lightgrey)](https://github.com/bworth/tasks/blob/main/LICENSE)

Core [gulp](https://gulpjs.com/) tasks for small project development.

## Main features

- Lints JS and Sass source files using [ESlint](https://eslint.org/) and [stylelint](https://stylelint.io/)
- Compiles JS source files with [Babel](https://babeljs.io/)
- Builds CSS from Sass and applies [Autoprefixer](https://github.com/postcss/autoprefixer) using [PostCSS](https://postcss.org/)

## Available gulp tasks

### `build`

- Lints JS and Sass, fails after error
- Copies public files into the specified 'dist' folder along with compiled scripts and styles
- Minifies HTML, JS and CSS
- Any source files in the HTML referenced by `<link>` or `<script>` tags with an `inline` attribute are inserted inline into the markup

### `dev`

(default gulp task)

- Lints JS and Sass
- Serves a non-minified build including sourcemaps
- Watches for changes and reloads into the browser

### `docs`

Creates documentation suites using [JSDoc](https://jsdoc.app/) and [SassDoc](http://sassdoc.com/).

### `lint`

Lints both JS and Sass.
