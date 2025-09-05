import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

export const db = mysql.createPool({
  host: 'localhost',
  port: 3306,
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
