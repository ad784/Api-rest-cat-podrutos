const express = require('express')
const router = express.Router()

router.get('/status', (req, res) => {
  res.status(200).json({
    versao: process.env.API_VERSION || '2.0.0',
    status: 'online'
  })
})

router.get('/versao', (req, res) => {
  res.status(200).json({
    versao: process.env.API_VERSION || '2.0.0',
    status: 'online'
  })
})

module.exports = router
