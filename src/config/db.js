import mysql from 'mysql2'

export const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '8#49787#?4?7',
  database: 'edonutsdb'
})

db.connect((err) => {
  if (err) {
    console.error('error during connection database', err)
    return
  }
  console.log('Database connected successfully')
})
