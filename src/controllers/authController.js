const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuarioModel')

const gerarToken = (idUsuario) => {
  return jwt.sign({ id_usuario: idUsuario }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  })
}

const formatarUsuario = (usuario) => ({
  id_usuario: usuario.id_usuario,
  nome: usuario.nome,
  email: usuario.email,
  perfil: usuario.perfil
})

exports.register = async (req, res, next) => {
  try {
    const { nome, name, email, senha, password, perfil } = req.body
    const nomeUsuario = nome || name
    const senhaUsuario = senha || password

    if (!nomeUsuario || !email || !senhaUsuario) {
      return res.status(400).json({ status: 'error', message: 'informe nome, email e senha' })
    }

    const senhaHash = await bcrypt.hash(senhaUsuario, 12)
    const usuario = await Usuario.criar({
      nome: nomeUsuario,
      email,
      senha: senhaHash,
      perfil
    })

    const token = gerarToken(usuario.id_usuario)

    res.status(201).json({
      status: 'success',
      token,
      data: { usuario: formatarUsuario(usuario) }
    })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ status: 'error', message: 'email ja esta em uso' })
    }
    next(err)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, senha, password } = req.body
    const senhaUsuario = senha || password

    if (!email || !senhaUsuario) {
      return res.status(400).json({ status: 'error', message: 'informe email e senha' })
    }

    const usuario = await Usuario.buscarPorEmail(email)

    if (!usuario || !(await bcrypt.compare(senhaUsuario, usuario.senha))) {
      return res.status(401).json({ status: 'error', message: 'email ou senha incorretos' })
    }

    const token = gerarToken(usuario.id_usuario)

    res.status(200).json({
      status: 'success',
      token,
      data: { usuario: formatarUsuario(usuario) }
    })
  } catch (err) {
    next(err)
  }
}

exports.getMe = async (req, res, next) => {
  try {
    res.status(200).json({ status: 'success', data: { usuario: req.user } })
  } catch (err) {
    next(err)
  }
}
