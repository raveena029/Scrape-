import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '104020',
  database: process.env.MYSQL_DATABASE || 'snu_mart',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

export { pool }