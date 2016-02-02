# Slides

Have you ever experienced that feeling of dread when you sit down to write a slide deck?  Something like:

> Well, I don't want to use PowerPoint, but I don't want to fiddle around with endless different html slide generators either, I just want to write some notes and get on with it!

Slides takes your notes and images and turns them into a slide deck built with [Bespoke.js](http://markdalgleish.com/projects/bespoke.js)

### Features

 * Keyboard Control
 * Presenter notes
 * Live-reload
 * es6 to es5 translation
 * Source maps
 * Extension API

### Controls

Keyboard controls of note are:

| Key    | Action         |
| ------ |----------------|
| &rarr; | Next slide     |
| &larr; | Previous slide |
| s      | Open notes     |

## Getting started

### Your directory structure

Make your project look like this:

```
my-presentation
  ├- package.json
  ├- slides.jade
  ├- audio
  |  └- foo.mp3
  ├- images
  |  └- foo.jpg
  ├- scripts
  |  |  plugins.js
  |  └- deck.js
  ├- styles
  |  └- main.styl
  └- video
     └- foo.mp4
```

### `slides.jade`

This is where your slides live.

A few simple rules:

1. The presentation will be generated from the `article` element
2. All slides should be in `section` nodes

Otherwise, write normal html:

```jade
article

  section
    h1 Nebula

  section(data-bespoke-backdrop='orion')
    h2 A <a href="https://github.com/markdalgleish/bespoke.js">Bespoke.js</a> theme

  section
    h3 &mdash; Lovingly crafted by &mdash;
    h2 <a href="https://github.com/markdalgleish">Mark Dalgleish</a>

  section
    h2.single-words Try the &lsquo;single-words&rsquo; class

  section
    h2.bullet Enjoy <span class='bullet'>:)</span>

a(href='https://github.com/markdalgleish/bespoke-theme-nebula')
  img(style='position: absolute; z-index: 1; top: 0; right: 0; border: 0; width: 25vw; max-width: 149px;', src='http://aral.github.com/fork-me-on-github-retina-ribbons/right-grey@2x.png' alt='Fork me on GitHub')
```


### `package.json`

Make your `package.json` look something like:

```javascript
{
  "name": "my-presentation",
  "version": "1.0.0",
  "description": "A slideshow",
  "license": "ISC",
  "author": {
    "name": "Your name here",
    "email": "me@example.org"
  },
  "scripts": {
    "start": "slides present",
    "deploy": "slides publish"
  },
  "dependencies": {
    "@achingbrain/slides": "^1.0.0"
  },
  "slides": {
    // all properties are optional
    "title": "Will appear in the <title> tag",
    "author": "Your name",
    "description": "Will appear in a <meta> tag",
    "theme": "bespoke-theme-nebula"
  }
}
```

If you specify a different theme, make sure it's a dependency of your project!

## Extension points

If you need to customise Bespoke.js, this is how you do it.

#### `scripts/plugins.js`

If present, `plugins.js` will be called with the default list of bespoke.js plugins for you to modify.  It should take the form:

```javascript
// plugins.js
module.exports = (plugins) => {
  // plugins is the default list of bespoke.js plugins
}
```

#### `scripts/deck.js`

If present, `scripts/deck.js` will be invoked after creating the slide deck.  It should take the form:

```javascript
// deck.js
module.exports = (deck) => {
  // deck is the bespoke.js slide deck
}
```
