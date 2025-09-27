import { db } from '../config/db.js'
import bcrypt from 'bcrypt'

export class ModelUser {
  static async login ({ credentials }) {
    const [results] = await db.execute('SELECT * FROM `users` WHERE `username` = ?', [credentials.username])
    if (!results[0]) throw new Error('User not exists')
    const checkPassword = bcrypt.compareSync(credentials.password, results[0].password)
    if (!checkPassword) throw new Error('Password is wrong')
    return results[0]
  }

  static async register ({ newUser }) {
    const [result] = await db.execute('SELECT * FROM users WHERE username = ?', [newUser.username])
    if (result[0]) throw new Error('User already exists')

    try {
      const hashedPassword = bcrypt.hashSync(newUser.password, 12)
      const [result] = await db.execute('INSERT users (username,password,role) VALUES (?,?,?)', [newUser.username, hashedPassword, 'admin'])
      return result.insertId
    } catch (error) {
      throw new Error('Error creating user')
    }
  }

  static async deleteUser ({ id }) {
    try {
      await db.execute('DELETE FROM users WHERE id = ?', [id])
    } catch (error) {
      throw new Error('Error deleting user')
    }
  }

  static async changePassword ({ passwords, id }) {
    const [results] = await db.execute('SELECT * FROM `users` WHERE id = ?', [id])
    if (!results[0]) throw new Error('User not exists')
    const checkPassword = bcrypt.compareSync(passwords.password, results[0].password)
    if (!checkPassword) throw new Error('Password is wrong')
    const passwordHashed = await bcrypt.hash(passwords.newPassword, 12)

    try {
      await db.execute('UPDATE `users` SET `password` = ? WHERE `id` = ?', [passwordHashed, id])
    } catch (error) {
      throw new Error('Error updating table users')
    }
  }
}
