# MacWindow

<!-- [![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

[![Build Status](https://travis-ci.org/nju33/mac-window.svg?branch=master)](https://travis-ci.org/nju33/mac-window) -->

Elements like mac's window.


![screenshot](https://github.com/nju33/mac-window/raw/master/images/screenshot.png?raw=true)

## Install or Download

```sh
yarn add mac-window
npm i -S mac-window
```

Or access to [releases page](https://github.com/nju33/mac-window/releases).
Then, download the latest version.

## Usage

First, if you read as a separate file.

```html
<script src="/path/tp/mac-window.js"></script>
```

Markup and script are like this.

```html
<div id="mac-window" style="
  position: relative;
  width: 100%;
  height: 70vh;
">
  <!-- Inner contents -->
</div>
```

```js
// For es
import MacWindow from 'mac-window';
new MacWindow({target: document.getElementById('mac-window')});
```

As an important point, there are only two.
It is to specify the `position:relative` and the size (`width`, `height`, ...) as the container element.

Then, please adjust so that the inner element is just fine.

### Example

- `test/fixtures/index.js`
- `example/webpack/index.js`

## LICENSE

The MIT License (MIT)

Copyright (c) 2017 nju33 <nju33.ki@gmail.com>
