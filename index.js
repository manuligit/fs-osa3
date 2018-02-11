const express = require('express')
const bodyPerser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const secreturl = require('./secret')
const Person = require('./models/person')

app.use(express.static('build'))

app.use(cors())
app.use(bodyPerser.json())

morgan.token('json', function(req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :json :status :res[content-length] :response-time ms'))

app.get('/info', (req, res) => {
  let timestamp = new Date()
  res.send(`<p>puhelinluettelossa ${persons.length} henkilon tiedot <br /> ${timestamp}</p>`)
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

const generateId = () => {
  return Math.floor(Math.random() * Math.floor(100000))
}

app.post('/api/persons', (req, res) => {
  const body = req.body
  morgan.token('type', function(req, res) { return JSON.stringify(req.headers['content-type'])})
  if (!body.name) {
    return res.status(400).json({error: 'name missing'})
  } else if (!body.number) {
    return res.status(400).json({error: 'number missing'})
  }

  const person = new Person ({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(savedPerson => {
      res.json(Person.format(savedPerson))
    }).catch(error => {
      console.log(error.name)
      res.status(400).end()
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