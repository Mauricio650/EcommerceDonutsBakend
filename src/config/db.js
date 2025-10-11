import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

export const db = mysql.createPool({
  host: process.env.HOST_DB,
  port: process.env.PORT_DB,
  user: process.env.USER_DB,
  password: process.env.PASSWORD_DB,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
})

try {
  await db.execute('SELECT 1')
  console.log('🛢️ DB Connected 🛢️')
} catch (error) {
  console.log('Error during DB connection ⚠️ ', error)
}
