const mongoose = require('mongoose')
const url = require('../secret')

mongoose.connect(url)

const Note = mongoose.model('Note', {
  content: String,
  date: Date,
  important: Boolean
})

module.exports = Note