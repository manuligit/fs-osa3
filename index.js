const express = require('express')
const bodyPerser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

let persons =[
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Martti Tienari",
    "number": "040-123456",
    "id": 2
  },
  {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
  },
  {
    "name": "Lea Kutvonen",
    "number": "040-123456",
    "id": 4
  }
]

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
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  //console.log(id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
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
  } else if (persons.find(person => person.name === body.name)) {
    return res.status(400).json({error: 'duplicate name entry'})
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)
  res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})