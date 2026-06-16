const { pool } = require('../config/database')

const criar = async ({ nome, email, senha, perfil = 'admin' }) => {
  const [result] = await pool.execute(
    'INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)',
    [nome, email, senha, perfil]
  )

  return buscarPorId(result.insertId)
}

const buscarPorEmail = async (email) => {
  const [rows] = await pool.execute(
    'SELECT id_usuario, nome, email, senha, perfil FROM usuarios WHERE email = ? LIMIT 1',
    [email]
  )

  return rows[0] || null
}

const buscarPorId = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id_usuario, nome, email, perfil FROM usuarios WHERE id_usuario = ? LIMIT 1',
    [id]
  )

  return rows[0] || null
}

module.exports = {
  criar,
  buscarPorEmail,
  buscarPorId
}
