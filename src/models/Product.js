const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'nome do produto obrigatorio'],
    trim: true,
    minlength: 2,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  price: {
    type: Number,
    required: [true, 'preco obrigatorio'],
    min: [0, 'preco nao pode ser negativo']
  },
  category: {
    type: String,
    required: [true, 'categoria obrigatoria'],
    trim: true,
    lowercase: true
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  attributes: {
    type: Map,
    of: String,
    default: {}
  },
  tags: {
    type: [String],
    default: []
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true })

productSchema.index({ name: 'text', description: 'text', tags: 'text' })
productSchema.index({ category: 1, isActive: 1 })

module.exports = mongoose.model('Product', productSchema)
