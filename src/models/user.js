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

  static async changePassword ({ passwords, username }) {
    const [results] = await db.execute('SELECT * FROM `users` WHERE `username` = ?', [username])
    if (!results[0]) throw new Error('User not exists')
    const checkPassword = bcrypt.compareSync(passwords.password, results[0].password)
    if (!checkPassword) throw new Error('Password is wrong')
    const passwordHashed = await bcrypt.hash(passwords.newPassword, 12)

    try {
      await db.execute('UPDATE `users` SET `password` = ? WHERE `id` = ?', [passwordHashed, results[0].id])
    } catch (error) {
      throw new Error('Error updating table users')
    }
  }
}
