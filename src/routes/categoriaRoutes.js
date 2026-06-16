const express = require('express')
const router = express.Router()
const categoriaController = require('../controllers/categoriaController')
const { protect, requireMatchingUser } = require('../middlewares/auth')

router.use(protect, requireMatchingUser)

router
  .route('/')
  .get(categoriaController.listar)
  .post(categoriaController.criar)

router
  .route('/:id')
  .get(categoriaController.buscarPorId)
  .put(categoriaController.atualizar)
  .delete(categoriaController.remover)

module.exports = router
