const bespoke = require('bespoke')
const theme = require('<%= theme %>')
const keys = require('bespoke-keys')
const touch = require('bespoke-touch')
const bullets = require('bespoke-bullets')
const backdrop = require('bespoke-backdrop')
const scale = require('bespoke-scale')
const hash = require('bespoke-hash')
const progress = require('bespoke-progress')
const indexFinger = require('bespoke-indexfinger')
const secondary = require('bespoke-secondary')

bespoke.from('article', [
  theme(),
  keys(),
  touch(),
  bullets('li, .bullet'),
  backdrop(),
  scale(),
  hash(),
  progress(),
  indexFinger(),
  secondary()
])

require('prismjs')
