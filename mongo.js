const mongoose = require('mongoose')
if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI


mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

const args = process.argv

if (args.length === 2) {
  console.log("Puhelinluettelo: ")

  Person
    .find({})
    .then(result => {
      result.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })

} else if (args.length > 3) {
  console.log("lisätään henkilö", args[2], "numero", args[3], "luetteloon")
  const person = new Person ({
    name: args[2],
    number: args[3]
  })

  person
    .save()
    .then(response => {
      console.log("person saved!")
      mongoose.connection.close()
    })
  } else {
    mongoose.connection.close()
  }