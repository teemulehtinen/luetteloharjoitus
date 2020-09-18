const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    unique: true
  },
  number: {
    type: String,
    required: true,
    minlength: 8
  }
})
schema.plugin(uniqueValidator)

schema.set('toJSON', {
  transform: (document, json) => {
    json.id = json._id.toString(),
    delete json._id
    delete json.__v
  }
})

module.exports = mongoose.model('Person', schema)
