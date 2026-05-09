const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'nome obrigatorio'],
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  email: {
    type: String,
    required: [true, 'email obrigatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'email invalido']
  },
  password: {
    type: String,
    required: [true, 'senha obrigatoria'],
    minlength: [6, 'senha precisa ter pelo menos 6 caracteres'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { timestamps: true })

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = async function(senha) {
  return await bcrypt.compare(senha, this.password)
}

module.exports = mongoose.model('User', userSchema)
