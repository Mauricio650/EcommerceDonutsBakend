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
      const [result] = await db.execute(`
        SELECT type, SUM(price * quantity) AS total_sales  FROM sales
                WHERE created_at >= DATE_FORMAT(CURDATE(),'%Y-%m-01')
                AND created_at < DATE_FORMAT(CURDATE() + INTERVAL 1 MONTH, '%Y-%m-01')
                GROUP BY type`)
      const donutTotal = result[0]?.total_sales || 0
      const strawberriesAndCreamTotal = result[1]?.total_sales || 0
      const totalMonth = Number(donutTotal) + Number(strawberriesAndCreamTotal)
      return { totalMonth, strawberriesAndCreamTotal, donutTotal }
    } catch (error) {
      throw new Error('Error getting sales total')
    }
  }

  static async deleteSaleById ({ id }) {
    try {
      await db.execute('DELETE FROM sales WHERE client_id = ?', [id])
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

  static async ordersByClient () {
    try {
      /* make a request to get orders by client */
      const [result] = await db.execute(`
        SELECT
        c.name, c.phone_number, c.email, c.address, c.pay_reference,
        c.status_order, s.name as product, s.price, s.type, s.quantity, 
        s.client_id, c.id FROM clients AS c
        INNER JOIN sales AS s ON s.client_id = c.id  WHERE status_order = 'pending'`)

      /* make a reduce for organize de information by client in a object */
      const orders = result.reduce((acc, cv) => {
        if (Object.hasOwn(acc, `client_${cv.id}`)) {
          acc[`client_${cv.id}`].orders.push({ product: cv.product, quantity: cv.quantity, price: cv.price })
        } else {
          (
            acc[`client_${cv.id}`] = {
              id: cv.id,
              name: cv.name,
              phone: cv.phone_number,
              email: cv.email,
              address: cv.address,
              payReference: cv.pay_reference,
              statusOrder: cv.status_order,
              orders: [{ product: cv.product, quantity: cv.quantity, price: cv.price }]
            }

          )
        }
        return acc
      }, {})
      /* return a array of objects for each client */
      return Object.values(orders)
    } catch (error) {
      throw new Error('Error getting orders by client')
    }
  }

  static async orderStatus ({ id }) {
    try {
      const [result] = await db.execute('UPDATE clients SET status_order = \'delivered\' WHERE id = ?', [id])
      return result.id
    } catch (error) {
      throw new Error('Error deleting client')
    }
  }

  static async clientsList () {
    try {
      const [result] = await db.execute('SELECT id,name,phone_number,email,address FROM clients')
      return result
    } catch (error) {
      throw new Error('Error getting invoices')
    }
  }
}
