const mongoose = require('mongoose')
const url = require('../secret')

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

module.exports = Person