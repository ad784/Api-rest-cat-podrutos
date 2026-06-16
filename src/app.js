const express = require('express')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const rateLimit = require('express-rate-limit')

const authRoutes = require('./routes/authRoutes')
const apiRoutes = require('./routes/apiRoutes')
const categoriaRoutes = require('./routes/categoriaRoutes')
const errorHandler = require('./middlewares/errorHandler')

const app = express()

app.use(helmet())
app.use(mongoSanitize())
app.use(express.json({ limit: '10kb' }))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { status: 'error', message: 'muitas requisicoes, tente mais tarde' }
})
app.use('/api', limiter)

app.use('/api', apiRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/categorias', categoriaRoutes)
app.use('/api/v1/categorias', categoriaRoutes)

app.all('*', (req, res) => {
  res.status(404).json({ status: 'error', message: `rota ${req.originalUrl} nao existe` })
})

app.use(errorHandler)

module.exports = app

