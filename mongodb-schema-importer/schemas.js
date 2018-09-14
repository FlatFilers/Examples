/**
 * Put your mongoose schemas here. An example schema is included.
 */

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const robotSchema = Schema({
  'name': {type: String, required: true},
  'shield-color': {type: String, lowercase: true},
  'helmet-style': {type: String, enum: ['triangle', 'hexagram', 'square', 'octagonal', 'circular']},
  'sign': {type: String, match: [/^\w{4}$/, `'sign' may only have exactly 4 alphabetic characters.`], },
  'age': {type: Number, min: 0, max: 1000},
  'drone': {type: Boolean, default: false}
})

module.exports = {
  Robot: mongoose.model('Robot', robotSchema)
}