const jwt = require('jsonwebtoken')
const User = require('../models/User')

const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  })
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    const user = await User.create({ name, email, password })
    const token = gerarToken(user._id)

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    })
  } catch (err) {
    next(err)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'informe email e senha' })
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ status: 'error', message: 'email ou senha incorretos' })
    }

    const token = gerarToken(user._id)

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    })
  } catch (err) {
    next(err)
  }
}

exports.getMe = async (req, res, next) => {
  try {
    res.status(200).json({ status: 'success', data: { user: req.user } })
  } catch (err) {
    next(err)
  }
}
