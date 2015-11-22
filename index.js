'use strict'

const API = require('ipfs-api')
const createEventStream = require('ipfs-event-stream')
const blessed = require('blessed')
const contrib = require('blessed-contrib')

const api = new API('localhost', '5001')
const event$ = createEventStream(api)

const screen = blessed.screen()
const grid = new contrib.grid({
  rows: 2,
  cols: 2,
  screen: screen
})

const map = grid.set(0, 1, 1, 1, contrib.map, {label: 'Peers'})

const log = grid.set(0, 0, 1, 1, contrib.log, {label: 'Events'})

event$
  .filter(event => event.source === 'log/tail')
  .forEach(event => log.log(event.message))

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0)
})

screen.render()
