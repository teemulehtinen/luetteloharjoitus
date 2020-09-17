require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
//let persons = require('./persons')
const mongoose = require('mongoose')
const Person = require('./models/person')

// Configure web server
const app = express()
app.use(express.static('build'))
app.use(express.json())
morgan.token('body', (req, res) => req.method == 'POST' ? JSON.stringify(req.body) : '')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Connect to db
const dburi = process.env.MONGODB_URI
console.log('connecting to', dburi)
mongoose
  .connect(dburi, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(result => console.log('connected to db'))
  .catch(error => console.log('error connecting to db', error.message))

// Finally, create routes:

const bad_req = (res, message) => {
  res.status(400).json({error: message})
}

app.get('/info', (req, res) => {
  //res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
  const now = new Date()
  Person.count({}).then(count => {
    res.send(`<p>Phonebook has info for ${count} people</p><p>${now}</p>`)
  })
})

app.get('/api/persons', (req, res) => {  
  //res.json(persons)
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res) => {
  //const id = Number(req.params.id)
  //const person = persons.find(p => p.id === id)
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
})

app.delete('/api/persons/:id', (req, res) => {
  //const id = Number(req.params.id)
  //persons = persons.filter(p => p.id !== id)
  Person.findByIdAndDelete(req.params.id).then(() => {
    res.status(204).end()
  })
})

app.post('/api/persons', (req, res) => {
  if (!req.body.name) {
    return bad_req(res, 'name missing')
  }
  if (!req.body.number) {
    return bad_req(res, 'number missing')
  }
  //if (persons.find(p => p.name === req.body.name))
  Person.find({name: req.body.name}).then(persons => {
    if (persons.length > 0) {
      bad_req(res, 'name must be unique')
    } else {
      const person = new Person({
        name: req.body.name,
        number: req.body.number
        //id: Math.floor(Math.random() * 1000000000)
      })
      //persons = persons.concat(person)
      //res.json(person)
      person.save().then(saved => res.json(saved))
    }
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})
