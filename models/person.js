const mongoose = require('mongoose')
const url = require('../secret')

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

Person.format = function (person) {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
  //return this.find({ name: new RegExp(name, 'i') }, cb);
}

module.exports = Person