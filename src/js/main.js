require('prismjs')
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

var plugins = [
  theme(),
  keys(),
  touch(),
  bullets('<%= bullets %>'),
  backdrop(),
  scale(),
  hash(),
  progress(),
  indexFinger(),
  secondary()
]

try {
  require('plugins')(plugins)
} catch (error) {

}

var deck = bespoke.from('article', plugins)

try {
  let d = require('deck')

  if (d && typeof d.default === 'function') {
    d = d.default
  }

  d(deck)
} catch (error) {

}
