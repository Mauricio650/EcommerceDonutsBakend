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
      const [result] = await db.execute('INSERT INTO `products` (type, name,price,units,toppings,url_img,id_img) VALUES (?,?,?,?,?,?,?)',
        [product.type, product.name, product.price, product.units, product.toppings, data.secure_url, data.public_id])
      const idProduct = result.insertId
      return idProduct
    } catch (error) {
      throw new Error('internal server error', error)
    }
  }

  static async updateProduct ({ product, img, id }) {
    const columns = Object.entries(product).map(p => `${p[0]} = ?`).join(', ') // nombres de las columnas que se van a actualizar
    const values = []
    // recorrer dinámicamente el objeto product y llenar el array con los valores actualizados
    for (const [key, value] of Object.entries(product)) {
      values.push(value)
    }

    try {
      if (img) {
        const [results] = await db.execute('SELECT id_img FROM products WHERE id = ?', [id])
        await deleteImage({ publicId: results[0].id_img }) // recuperamos el id de la imagen en la db y borramos la img de cloudinary

        const fileBuffer = img.buffer
        const data = await uploadImage({ fileBuffer }) // en estas 3 lineas guardamos la nueva img y agregamos al arreglo de valores actualizados la url y el id_img que nos da cloudinary y el id de la row en la db
        values.push(data.secure_url, data.public_id, id)

        await db.execute(`UPDATE products SET ${columns}, url_img = ?, id_img = ? WHERE id = ?`, values)
      } else {
        values.push(id) // metemos el id del producto en al db para el 'where'
        await db.execute(`UPDATE products SET ${columns} WHERE id = ?`, values)
      }
    } catch (error) {
      throw new Error('Error deleting invoice')
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
