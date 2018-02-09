const mongoose = require('mongoose')
const secreturl = require('./secret')

mongoose.connect(secreturl)

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

// const note = new Note ({
//   content: "HTML on helppoa",
//   date: new Date(),
//   important: true
// })


// note  
//   .save()
//   .then(response => {
//     console.log('note saved!')
//     mongoose.connection.close()
//   })
