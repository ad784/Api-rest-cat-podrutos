const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'loja',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0
})

const initializeDatabase = async () => {
  await pool.query('SELECT 1')

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id_usuario INT UNSIGNED NOT NULL AUTO_INCREMENT,
      nome VARCHAR(100) NOT NULL,
      email VARCHAR(120) NOT NULL,
      senha VARCHAR(255) NOT NULL,
      perfil ENUM('user', 'admin') NOT NULL DEFAULT 'admin',
      criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id_usuario),
      UNIQUE KEY email_UNIQUE (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3
  `)

  console.log('mysql conectado')
}

module.exports = {
  pool,
  initializeDatabase
}
