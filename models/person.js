const mongoose = require('mongoose')
const url = require('../secret')

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: { 
    type: String,
    required: [true, 'name is required']},
  number: {
    type: String,
    required: [true, 'number is required']}
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