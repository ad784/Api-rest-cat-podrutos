const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.protect = async (req, res, next) => {
  try {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({ status: 'error', message: 'nao autorizado, faca login primeiro' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'usuario nao encontrado' })
    }

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'token invalido ou expirado' })
  }
}

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'error', message: 'sem permissao para essa acao' })
    }
    next()
  }
}
