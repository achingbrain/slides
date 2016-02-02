# Slides

A slide deck built with [Bespoke.js](http://markdalgleish.com/projects/bespoke.js)

### Features

 * Keyboard Control
 * Presenter notes
 * Livereload

## Getting started

### View slides locally

Install dependencies and run the preview server:

```bash
$ npm install
$ npm start
```

### Publishing slides

```bash
$ npm run publish-slides
```

### Controls

| Key    | Action         |
| ------ |----------------|
| &rarr; | Next slide     |
| &larr; | Previous slide |
| s      | Open notes     |


### Your directory structure

    my-presentation
      ├- slides.jade
      ├- images
      |  └- foo.jpg
      ├- video
      |  └- foo.mp4
      ├- audio
      |  └- foo.mp3
      ├- styles
      |  └- main.styl
      └- scripts
         └- main.js

## A sample `slides.jade`

N.b. the root node should be an `article`

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
