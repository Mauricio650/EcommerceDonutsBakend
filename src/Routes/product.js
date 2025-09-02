import { Router } from 'express'

export function createProductRouter () {
  const productRouter = Router()

  productRouter.get('/products', (req, res) => console.log('/products'))
  productRouter.post('/addproduct', (req, res) => console.log('/addproducts'))
  productRouter.patch('/updateproduct/:id', (req, res) => console.log('/updateproducts'))
  productRouter.delete('/deleteproduct/:id', (req, res) => console.log('/deleteproducts'))

  return productRouter
}
