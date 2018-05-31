<div align="center">
 <img src="https://user-images.githubusercontent.com/8135252/40784109-ea8d13c8-64e4-11e8-87aa-5ac3b4f27c02.png" alt="Gbck logo" title="Gbck" height="250" />

<div><strong>STY</strong>led console.<strong>LOG</strong></div>
</div>

## Table of Contents

* [Introduction](#introduction)
* [Install](#install)
* [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)

## Introduction

Stylog is a stylish way how to easily format [rich console.log messages](https://developers.google.com/web/tools/chrome-devtools/console/console-write#styling_console_output_with_css).

## Install

`yarn add stylog`

_The library is targeted for the last two version of Chrome, it's designed to be used mostly in dev mode within latest dev tools._

## Usage

### API

```js
stylog(
  (recipe: string),
  (stylesDictionary: ?{
    [id: string]: {
      [property: string]: string
    }
  })
);
```

* **_text_** is everything outside (non-escaped) "**{**"
* **_styled text_** start with "**{**" then there should immediately come **id** (string) and optionally **text** (multiline string) at the end it should be closed with "**}**"
* each **_styled text_** should have corresponding style in _stylesDictionary_
* **_styled text_** can be escaped by \ (in template literal you have to use \\\ )

Check it out the `example/index.html` for interactive playground! 🙌

```js
stylog(
  `{big Hello, everyone! This is nicely styled text!} 
and non-styled text. Lovely, right? {bold *clap* *clap* *clap*} 

{image [GANDALF]} {red Be aware! Wild Gandalf appears!}

.
.

\\{gandalf}

.
.
.

not like this

.
.
.
{gandalf}`,
  {
    bold: {
      fontWeight: "bold"
    },
    big: {
      fontSize: "25px",
      border: "1px solid black",
      padding: "10px"
    },
    image: {
      display: "block !important",
      color: "gray",
      fontSize: "10px",
      background: `url("https://vignette.wikia.nocookie.net/casshan/images/d/dc/Warn.png/revision/latest?cb=20120614181856")`,
      backgroundSize: "15px 15px",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "left",
      paddingLeft: "15px"
    },
    red: {
      color: "red",
      textDecoration: "underline"
    },
    gandalf: {
      display: "block !important",
      color: "gray",
      fontSize: "300px",
      lineHeight: "150px",
      display: "block !important",
      background: `url("https://i.giphy.com/media/FyetIxXamPsfC/giphy.webp")`,
      backgroundSize: "200px",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "left"
    }
  }
);
```

will produce this:

 <img src="https://user-images.githubusercontent.com/8135252/40785138-fde9830e-64e7-11e8-8c57-f205e638a5ba.png" alt="Stylog – Example" title="Stylog - Example" height="500" />

## Contributing

Do you miss something? Open an issue, I'd like to hear more about your use case. You can also fork this repository and run `yarn && yarn dev`, do stuff in the playground (`example/index.html`), then run `yarn test` and finally send a PR! ❤️

## License

The MIT License (MIT) 2018 - Jakub Beneš
