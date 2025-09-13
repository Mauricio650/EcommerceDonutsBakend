import { Router } from 'express'
import { upload } from '../config/multer.js'

export function createProductRouter ({ Controller, Model }) {
  const productRouter = Router()
  const controllerProduct = new Controller({ ModelProduct: Model })

  productRouter.get('/products', controllerProduct.getProducts)
  productRouter.post('/products', upload.single('image'), controllerProduct.createProduct)
  productRouter.patch('/products/:id', upload.single('image'), controllerProduct.updateProduct)
  productRouter.delete('/products/:id', controllerProduct.deleteProducts)

  return productRouter
}
