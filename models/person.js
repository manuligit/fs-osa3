const mongoose = require('mongoose')
if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI
mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: {
    type: String,
    required: [true, 'name is required'] },
  number: {
    type: String,
    required: [true, 'number is required'] }
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