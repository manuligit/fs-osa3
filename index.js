const express = require('express')
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

app.get('/', (req, res) => {
  res.send('<h1>Persons</h1>')
})

app.get('/info', (req, res) => {
  let timestamp = new Date()
  res.send(`<p>puhelinluettelossa ${persons.length} henkilon tiedot <br /> ${timestamp}</p>`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  console.log(id)
  const person = persons.find(person => person.id.toString() === id.toString())

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})