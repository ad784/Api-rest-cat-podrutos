const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')
const { protect, restrictTo } = require('../middlewares/auth')

router.get('/', productController.getAllProducts)
router.get('/:id', productController.getProductById)

router.use(protect)
router.post('/', productController.createProduct)
router.put('/:id', productController.updateProduct)
router.delete('/:id', restrictTo('admin'), productController.deleteProduct)

module.exports = router
