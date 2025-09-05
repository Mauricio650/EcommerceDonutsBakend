import { db } from '../config/db.js'
import { uploadImage } from '../config/helpers.js'
import { deleteImage } from '../config/cloudinary.js'

export class ModelProduct {
  static async getProducts () {
    try {
      const [results] = await db.execute('SELECT * FROM products')
      return results
    } catch (error) {
      throw new Error('internal server error', error)
    }
  }

  static async createProduct ({ product, img }) {
    const fileBuffer = img.buffer
    try {
      const data = await uploadImage({ fileBuffer })
      await db.execute('INSERT INTO `products` (type, name,price,units,toppings,url_img,id_img) VALUES (?,?,?,?,?,?,?)',
        [product.type, product.name, product.price, product.units, product.toppings, data.secure_url, data.public_id])
      return 'Product inserted'
    } catch (error) {
      throw new Error('internal server error', error)
    }
  }

  static async updateProduct ({ product, img, id }) {
    try {
      if (img) {
        const [results] = await db.execute('SELECT id_img FROM products WHERE id = ?', [id])
        await deleteImage({ publicId: results[0].id_img })
      }
    } catch (error) {
      throw new Error('Error deleting invoice')
    }

    try {
      const columns = Object.entries(product).map(p => `${p[0]} = ?`).join(', ')
      const fileBuffer = img.buffer
      const data = await uploadImage({ fileBuffer })
      await db.execute(`UPDATE products SET ${columns} url_img = ? id_img = ? WHERE id = ?`, [product, data.secure_url, data.public_id, id])
    } catch (error) {
      throw new Error('Error updating table')
    }
  }

  static async deleteProducts ({ id }) {
    try {
      const [results] = await db.execute('SELECT id_img FROM products WHERE id = ?', [id])
      await deleteImage({ publicId: results[0].id_img })
      await db.execute('DELETE FROM products WHERE id = ?', [id])
    } catch (error) {
      throw new Error('Error deleting product', error)
    }
  }
}
