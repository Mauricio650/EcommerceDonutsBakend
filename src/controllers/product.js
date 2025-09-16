import { errorMappingZod } from '../logic/errorsZod.js'
import { validatePartialSchemaProduct, validateSchemaProduct } from '../schemas/productSchema.js'

export class ControllerProduct {
  constructor ({ ModelProduct }) {
    this.ModelProduct = ModelProduct
  }

  createProduct = async (req, res) => { /* 619 × 403 this dimensions is the limit for te images */
    const data = req.session.user
    if (!data || data.role !== 'admin') res.status(401).json({ message: 'Unauthorize' })
    const img = req.file
    if (!img) res.status(400).json({ message: 'please upload an image' })
    const result = validateSchemaProduct(req.body)
    if (!result.success) return res.status(422).json({ message: errorMappingZod(result) })

    try {
      const idProduct = await this.ModelProduct.createProduct({ product: result.data, img })
      res.status(201).json({ message: 'Product created!', id: idProduct })
    } catch (error) {
      res.status(500).json({ message: 'internal server error' })
    }
  }

  updateProduct = async (req, res) => {
    const data = req.session.user
    if (!data || data.role !== 'admin') res.status(401).json({ message: 'Unauthorize' })
    const img = req.file || null
    const { id } = req.params
    if (!id) { return res.status(400).json({ error: 'insert a valid id in the request' }) }
    const result = validatePartialSchemaProduct(req.body)
    if (!result.success) return res.status(422).json({ message: errorMappingZod(result) })
    try {
      await this.ModelProduct.updateProduct({ product: result.data, img, id })
      res.status(200).json({ message: 'Product updated!' })
    } catch (error) {
      console.log(error.message)
      res.status(500).json({ message: 'internal server error' })
    }
  }

  deleteProducts = async (req, res) => {
    const data = req.session.user
    if (!data || data.role !== 'admin') res.status(401).json({ message: 'Unauthorize' })
    const { id } = req.params
    if (!id) { return res.status(400).json({ error: 'insert a valid id in the request' }) }

    try {
      await this.ModelProduct.deleteProducts({ id })
      res.status(200).json({ message: 'Product deleted' })
    } catch (error) {
      res.status(500).json({ message: 'INTERNAL SERVER ERROR' })
    }
  }
}
