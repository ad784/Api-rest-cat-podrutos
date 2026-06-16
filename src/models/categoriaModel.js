const { pool } = require('../config/database')

const listar = async () => {
  const [rows] = await pool.execute(
    'SELECT id_categoria, nome FROM categorias ORDER BY id_categoria'
  )

  return rows
}

const buscarPorId = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id_categoria, nome FROM categorias WHERE id_categoria = ? LIMIT 1',
    [id]
  )

  return rows[0] || null
}

const criar = async (nome) => {
  const [result] = await pool.execute(
    'INSERT INTO categorias (nome) VALUES (?)',
    [nome]
  )

  return buscarPorId(result.insertId)
}

const atualizar = async (id, nome) => {
  const [result] = await pool.execute(
    'UPDATE categorias SET nome = ? WHERE id_categoria = ?',
    [nome, id]
  )

  if (result.affectedRows === 0) return null
  return buscarPorId(id)
}

const remover = async (id) => {
  const [result] = await pool.execute(
    'DELETE FROM categorias WHERE id_categoria = ?',
    [id]
  )

  return result.affectedRows > 0
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover
}
