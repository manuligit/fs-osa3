const express = require('express')
const bodyPerser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.static('build'))

app.use(cors())
app.use(bodyPerser.json())

morgan.token('json', function(req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :json :status :res[content-length] :response-time ms'))

app.get('/info', (req, res) => {
  let timestamp = new Date()
  let number = 0
  Person.count({}, function (err, count) {
    if (err) {
      console.log('errer')
      number = 0}
    console.log(count)
    number = Number(count)
    res.send(`<p>puhelinluettelossa ${number} henkilon tiedot <br /> ${timestamp}</p>`)
  })

  //res.send(`<p>puhelinluettelossa ${number} henkilon tiedot <br /> ${timestamp}</p>`)
})
//method url {} id headers reqlength - response time 
app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(Person.format))
    })
    .catch(error => {
      console.log(error.name)
      res.status(404).end()
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      res.json(Person.format(person))
    }).catch(error => {
      console.log(error.name)
      res.status(404).end()
    })
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  morgan.token('type', function(req, res) { return JSON.stringify(req.headers['content-type'])})
  
  const person = new Person ({
    name: body.name,
    number: body.number
  })

  Person
    .find({name: body.name})
    .then(result => {
      if (result.length > 0) {
        console.log('name already exists in db')
        throw new Error('duplicate name')
        return null
      } else {
        return true
      }
    })
    .then(result => {
      if (result) {
        person
        .save()
        .then(savedPerson => {
          return Person.format(savedPerson)
          }).then(formattedPerson => {
            res.json(formattedPerson)
          }).catch(error => {
          console.log(error.name)
          res.status(400).end()
        })
      }
    }).catch(error => {
      console.log(error)
      res.status(400).send({ error: 'bad request' })
  })
})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(Person.format(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      console.log(req.params.id)
      res.status(400).send({ error: 'malformatted id'})
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})