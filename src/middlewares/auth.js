const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuarioModel')

const obterToken = (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1]
  }

  return null
}

exports.protect = async (req, res, next) => {
  try {
    const token = obterToken(req)

    if (!token) {
      return res.status(401).json({ status: 'error', message: 'nao autorizado, faca login primeiro' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const idUsuario = decoded.id_usuario || decoded.id

    if (!idUsuario) {
      return res.status(401).json({ status: 'error', message: 'token sem identificacao de usuario' })
    }

    const usuario = await Usuario.buscarPorId(idUsuario)
    if (!usuario) {
      return res.status(401).json({ status: 'error', message: 'usuario nao encontrado' })
    }

    req.user = usuario
    next()
  } catch (err) {
    return res.status(401).json({ status: 'error', message: 'token invalido ou expirado' })
  }
}

exports.requireMatchingUser = (req, res, next) => {
  const idInformado = req.headers['x-user-id'] || req.body.id_usuario || req.query.id_usuario

  if (!idInformado) {
    return res.status(401).json({
      status: 'error',
      message: 'id_usuario deve ser informado no cabecalho x-user-id, query ou corpo da requisicao'
    })
  }

  if (Number(idInformado) !== Number(req.user.id_usuario)) {
    return res.status(403).json({ status: 'error', message: 'id_usuario nao corresponde ao token' })
  }

  next()
}

exports.restrictTo = (...perfis) => {
  return (req, res, next) => {
    if (!perfis.includes(req.user.perfil)) {
      return res.status(403).json({ status: 'error', message: 'sem permissao para essa acao' })
    }
    next()
  }
}
