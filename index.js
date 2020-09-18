require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const Person = require('./models/person')

// Configure web service and logging
const app = express()
app.use(express.static('build'))
app.use(express.json())
morgan.token('body', (req) => req.method == 'POST' ? JSON.stringify(req.body) : '')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Connect to db
const dburi = process.env.MONGODB_URI
console.log('connecting to', dburi)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.connect(dburi, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('connected to db'))
  .catch(error => console.log('error connecting to db', error.message))

// Create serviced routes:

app.get('/info', (req, res, next) => {
  const now = new Date()
  Person.countDocuments({})
    .then(count => res.send(`<p>Phonebook has info for ${count} people</p><p>${now}</p>`))
    .catch(err => next(err))
})

app.get('/api/persons', (req, res, next) => {  
  Person.find({})
    .then(persons => res.json(persons))
    .catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person === null) {
        return res.status(404).end()
      }
      res.json(person)
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndUpdate(req.params.id, {number: req.body.number}, {new: true, runValidators: true})
    .then(updated => res.json(updated))
    .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const person = new Person({
    name: req.body.name,
    number: req.body.number
  })
  person.save()
    .then(saved => res.json(saved))
    .catch(err => next(err))
})

// Intercept bad routes
app.use((req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
})

// Custom error messages
app.use((err, req, res, next) => {
  console.error(err.message)
  if (err.name === 'BadRequest') {
    return res.status(400).json({ error: err.message })
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({error: err.message})
  }
  if (err.name === 'CastError') {
    return res.status(400).json({error: 'malformatted id'})
  }
  next(err)
})

// Start serving
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})
