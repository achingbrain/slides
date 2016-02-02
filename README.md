# Slides

Have you ever experienced that feeling of dread when you sit down to write a slide deck?  Something like:

> Well, I don't want to use PowerPoint, but I don't want to fiddle around with endless different html slide generators either, I just want to write some notes and get on with it!

Slides takes your notes and images and turns them into a slide deck built with [Bespoke.js](http://markdalgleish.com/projects/bespoke.js)

### Features

 * Keyboard Control
 * Presenter notes
 * Live-reload

### Controls

Keyboard controls of note are:

 | Key    | Action         |
 | ------ |----------------|
 | &rarr; | Next slide     |
 | &larr; | Previous slide |
 | s      | Open notes     |

## Getting started

To write a slideshow, make your package.json look something like:

```javascript
{
  "name": "electricity-a-primer",
  "version": "1.0.0",
  "description": "A slideshow",
  "dependencies": {
    "slides": "^0.0.0"
  },
  "scripts": {
    "start": "slides present",
    "deploy": "slides publish"
  },
  "author": {
    name: "Your name here"
  },
  "license": "ISC",
  "slides": {
    // configuration options here
  }
}
```

## Configuration

By default slides uses the `bespoke-theme-nebula` theme and pulls the `name`, `description` and `author.name` fields from your project's `package.json`.

To override this behaviour, add a `slides` entry to your `package.json`:

```javascript
{
  "slides": {
    "title": "Will appear in the <title> tag",
    "author": "Your name",
    "description": "Will appear in a <meta> tag",
    "theme": "bespoke-theme-nebula"
  }
}
```

If you specify a different theme, make sure it's installed!

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
  |  └- main.js
  ├- styles
  |  └- main.styl
  └- video
     └- foo.mp4
```

### A sample `slides.jade`

A few simple rules:

1. The root node should be an `article`
2. All slides should be in `section` nodes

Otherwise, write normal html:

```jade
article

  section
    h1 I am a slide deck

  section.emphatic-text
    h2 This slide has notes
    p Press 's' to see

    aside
      h2 These are notes
      ul
        li Note 1
        li Note 2

  section
    h2 I can have lists
    ul
      li Item 1
      li Item 2
```
