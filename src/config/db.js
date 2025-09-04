import mysql from 'mysql2/promise'

export const db = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '8#49787#?4?7',
  database: 'edonutsdb',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
})

try {
  await db.execute('SELECT 1')
  console.log('🛢️ DB Connected 🛢️')
} catch (error) {
  console.log('Error during DB connection ⚠️ ')
}
