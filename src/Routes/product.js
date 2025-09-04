import { Router } from 'express'

export function createProductRouter ({ Controller, Model }) {
  const productRouter = Router()
  const controllerProduct = new Controller({ ModelProduct: Model })

  productRouter.get('/products', controllerProduct.getProducts)
  productRouter.post('/addproduct', (req, res) => console.log('/addproducts'))
  productRouter.patch('/updateproduct/:id', (req, res) => console.log('/updateproducts'))
  productRouter.delete('/deleteproduct/:id', (req, res) => console.log('/deleteproducts'))

  return productRouter
}
