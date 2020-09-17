const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: String,
  number: String
})

schema.set('toJSON', {
  transform: (document, json) => {
      json.id = json._id.toString(),
      delete json._id
      delete json.__v
  }
})

module.exports = mongoose.model('Person', schema)
