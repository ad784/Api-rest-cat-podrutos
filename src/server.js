require('dotenv').config()
const app = require('./app')
const { initializeDatabase } = require('./config/database')

const PORT = process.env.PORT || 3000

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`servidor rodando na porta ${PORT}`)
  })
}).catch((err) => {
  console.error('erro ao conectar no mysql:', err.message)
  process.exit(1)
})
