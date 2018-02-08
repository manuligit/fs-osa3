const mongoose = require('mongoose')
const secreturl = require('./secret')

mongoose.connect(secreturl)

const Note = mongoose.model('Note', {
  content: String,
  date: Date,
  important: Boolean
})

Note
.find({})
.then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})

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
