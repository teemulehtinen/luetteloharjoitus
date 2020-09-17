const mongoose = require('mongoose')

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log('Supported arguments:')
  console.log('PASSWORD                 Gets all persons')
  console.log('PASSWORD NAME NUMBER     Creates a new person')
  process.exit(1)
}

const url = `mongodb+srv://fullstack:${process.argv[2]}@cluster0.zbkoj.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})
const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })
  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })

} else {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(p => console.log(`${p.name} ${p.number}`))
    mongoose.connection.close()
  })
}
