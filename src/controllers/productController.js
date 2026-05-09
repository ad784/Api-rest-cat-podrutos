const Product = require('../models/Product')

exports.getAllProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, search, page = 1, limit = 10 } = req.query

    const filtro = { isActive: true }

    if (category) filtro.category = category.toLowerCase()
    if (minPrice || maxPrice) {
      filtro.price = {}
      if (minPrice) filtro.price.$gte = Number(minPrice)
      if (maxPrice) filtro.price.$lte = Number(maxPrice)
    }
    if (search) filtro.$text = { $search: search }

    const skip = (Number(page) - 1) * Number(limit)

    const [products, total] = await Promise.all([
      Product.find(filtro)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filtro)
    ])

    res.status(200).json({
      status: 'success',
      results: products.length,
      total,
      page: Number(page),
      data: { products }
    })
  } catch (err) {
    next(err)
  }
}

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('createdBy', 'name email')

    if (!product || !product.isActive) {
      return res.status(404).json({ status: 'error', message: 'produto nao encontrado ou inativo' })
    }

    res.status(200).json({ status: 'success', data: { product } })
  } catch (err) {
    next(err)
  }
}

exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create({ ...req.body, createdBy: req.user._id })
    res.status(201).json({ status: 'success', data: { product } })
  } catch (err) {
    next(err)
  }
}

exports.updateProduct = async (req, res, next) => {
  try {
    const { createdBy, ...dados } = req.body

    const product = await Product.findByIdAndUpdate(req.params.id, dados, {
      new: true,
      runValidators: true
    })

    if (!product) {
      return res.status(404).json({ status: 'error', message: 'produto nao encontrado ou inativo' })
    }

    res.status(200).json({ status: 'success', data: { product } })
  } catch (err) {
    next(err)
  }
}

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    )

    if (!product) {
      return res.status(404).json({ status: 'error', message: 'produto nao encontrado ou inativo' })
    }

    res.status(200).json({ status: 'success', message: 'produto removido' })
  } catch (err) {
    next(err)
  }
}
