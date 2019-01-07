const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String
})

const product = mongoose.model('product', productSchema)
module.exports = product
