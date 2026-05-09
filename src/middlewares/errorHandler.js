const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500
  let message = err.message || 'erro interno do servidor'

  if (err.name === 'CastError') {
    status = 400
    message = 'id invalido'
  }

  if (err.code === 11000) {
    status = 409
    const campo = Object.keys(err.keyValue)[0]
    message = `${campo} ja esta em uso`
  }

  if (err.name === 'ValidationError') {
    status = 400
    message = Object.values(err.errors).map(e => e.message).join(' | ')
  }

  if (err.name === 'JsonWebTokenError') {
    status = 401
    message = 'token invalido'
  }

  res.status(status).json({ status: 'error', message })
}

module.exports = errorHandler
