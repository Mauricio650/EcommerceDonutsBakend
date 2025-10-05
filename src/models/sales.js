import { db } from '../config/db.js'

export class ModelSales {
  static async createSale ({ sale }) {
    const placeHolders = sale.map(v => '(?,?,?,?,?)')
    const query = `INSERT INTO sales (name, price, type, quantity, client_id) VALUES ${placeHolders}`
    try {
      const [result] = await db.execute(query, sale.flat())
      return result.insertId
    } catch (error) {
      throw new Error('Error creating sale')
    }
  }

  static async totalCurrentMonth () {
    try {
      const [result] = await db.execute(`SELECT type, SUM(price * quantity) AS total_sales  FROM sales
                WHERE created_at >= DATE_FORMAT(CURDATE(),'%Y-%m-01')
                AND created_at < DATE_FORMAT(CURDATE() + INTERVAL 1 MONTH, '%Y-%m-01')
                GROUP BY type;`)
      return result
    } catch (error) {
      throw new Error('Error getting sales total')
    }
  }

  static async deleteSaleById ({ id }) {
    try {
      await db.execute('DELETE FROM sales WHERE id = ?', [id])
    } catch (error) {
      throw new Error('internal server error')
    }
  }

  static async createClient ({ client }) {
    try {
      const [result] = await db.execute('INSERT INTO clients (name,phone_number,email,address,pay_reference) VALUES (?,?,?,?,?)', Object.values(client))
      return result.insertId
    } catch (error) {
      throw new Error('Error creating client')
    }
  }

  static async deleteClient ({ id }) {
    try {
      await db.execute('DELETE FROM clients WHERE id = ?', [id])
    } catch (error) {
      throw new Error('Error deleting client')
    }
  }
}
