const Categoria = require('../models/categoriaModel')

const validarId = (id) => Number.isInteger(Number(id)) && Number(id) > 0

exports.listar = async (req, res, next) => {
  try {
    const categorias = await Categoria.listar()
    res.status(200).json({
      status: 'success',
      results: categorias.length,
      data: { categorias }
    })
  } catch (err) {
    next(err)
  }
}

exports.buscarPorId = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!validarId(id)) {
      return res.status(400).json({ status: 'error', message: 'id_categoria invalido' })
    }

    const categoria = await Categoria.buscarPorId(id)

    if (!categoria) {
      return res.status(404).json({ status: 'error', message: 'categoria nao encontrada' })
    }

    res.status(200).json({ status: 'success', data: { categoria } })
  } catch (err) {
    next(err)
  }
}

exports.criar = async (req, res, next) => {
  try {
    const { nome } = req.body

    if (!nome || String(nome).trim().length < 2) {
      return res.status(400).json({ status: 'error', message: 'nome da categoria obrigatorio' })
    }

    const categoria = await Categoria.criar(String(nome).trim())
    res.status(201).json({ status: 'success', data: { categoria } })
  } catch (err) {
    next(err)
  }
}

exports.atualizar = async (req, res, next) => {
  try {
    const { id } = req.params
    const { nome } = req.body

    if (!validarId(id)) {
      return res.status(400).json({ status: 'error', message: 'id_categoria invalido' })
    }

    if (!nome || String(nome).trim().length < 2) {
      return res.status(400).json({ status: 'error', message: 'nome da categoria obrigatorio' })
    }

    const categoria = await Categoria.atualizar(id, String(nome).trim())

    if (!categoria) {
      return res.status(404).json({ status: 'error', message: 'categoria nao encontrada' })
    }

    res.status(200).json({ status: 'success', data: { categoria } })
  } catch (err) {
    next(err)
  }
}

exports.remover = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!validarId(id)) {
      return res.status(400).json({ status: 'error', message: 'id_categoria invalido' })
    }

    const removida = await Categoria.remover(id)

    if (!removida) {
      return res.status(404).json({ status: 'error', message: 'categoria nao encontrada' })
    }

    res.status(200).json({ status: 'success', message: 'categoria removida' })
  } catch (err) {
    next(err)
  }
}
