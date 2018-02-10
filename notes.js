const express = require('express')
const app = express()
const bodyPerser = require('body-parser')
const cors = require('cors')
const Note = require('./models/note')
const secreturl = require('./secret')

let notes = [
  {
    id: 1,
    content: 'HTML on helppoa',
    date: '2017-12-10T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Selain pystyy suorittamaan vain javascriptiä',
    date: '2017-12-10T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'HTTP-protokollan tärkeimmät metodit ovat GET ja POST',
    date: '2017-12-10T19:20:14.298Z',
    important: true
  }
]

app.use(cors())
app.use(bodyPerser.json())

const generateId = () => {
  const maxId = notes.length > 0 ? notes.map(n => n.id).sort().reverse()[0] : 1
  return maxId + 1
}

const formatNote = (note) => {
  const formattedNote = { ...note._doc, id: note._id }
  delete formattedNote._id
  delete formattedNote.__v

  return formattedNote
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({error: 'content missing'})
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date()
  })

  note
    .save()
    .then(savedNote => {
      response.json(formatNote(savedNote))
    })
})

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note
    .find({})
    .then(notes => {
      response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response) => {
  Note
    .findById(request.params.id)
    .then(note => {
      response.json(formatNote(note))
    })
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

