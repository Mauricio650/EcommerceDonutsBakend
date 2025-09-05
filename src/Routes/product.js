import { Router } from 'express'
import { upload } from '../config/multer.js'

export function createProductRouter ({ Controller, Model }) {
  const productRouter = Router()
  const controllerProduct = new Controller({ ModelProduct: Model })

  productRouter.get('/products', controllerProduct.getProducts)
  productRouter.post('/addproduct', upload.single('image'), (req, res) => controllerProduct.createProduct)
  productRouter.patch('/updateproduct/:id', upload.single('image'), controllerProduct.updateProduct)
  productRouter.delete('/deleteproduct/:id', (req, res) => console.log('/deleteproducts'))

  return productRouter
}
