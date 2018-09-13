/**
 * Put your mongoose schemas here. An example schema is included.
 */

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const robotSchema = Schema({
  'name': String,
  'shield-color': String,
  'helmet-style': String,
  'sign': String
})

module.exports = {
  Robot: mongoose.model('Robot', robotSchema)
}