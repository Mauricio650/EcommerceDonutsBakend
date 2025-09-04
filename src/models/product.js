import { db } from '../config/db.js'

export class ModelProduct {
  static async getProducts () {
    try {
      const [results] = await db.execute('SELECT * FROM `products`')
      return results
    } catch (error) {
      throw new Error('internal server error', error)
    }
  }
}
