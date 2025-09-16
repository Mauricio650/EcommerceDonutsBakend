import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import { corsOptions } from '../cors/cors.js'
import { createUserRouter } from '../Routes/user.js'
import { createProductRouter } from '../Routes/product.js'
import { ControllerUser } from '../controllers/user.js'
import jwt from 'jsonwebtoken'
import { ControllerProduct } from '../controllers/product.js'

export function createApp ({ ModelUser, ModelProduct }) { /* dependencies inversion - MODELS */
  const app = express()
  app.use(express.json())
  app.use(cors(corsOptions))
  app.use(helmet())
  app.use(cookieParser())

  app.get('/products', async (req, res) => {
    try {
      const products = await ModelProduct.getProducts()
      res.status(200).json({ products })
    } catch (error) {
      res.status(500).json({ message: 'internal server error' })
    }
  })

  app.use(createUserRouter({ Controller: ControllerUser, Model: ModelUser }))

  app.use('/', (req, res, next) => {
    const token = req.cookies.access_token
    req.session = { user: null }
    try {
      const data = jwt.verify(token, process.env.JWT_SECRET_KEY)
      req.session.user = data
    } catch (error) {
      return res.status(401).json({ error: 'access not authorized' })
    }

    next()
  })

  app.use(createProductRouter({ Controller: ControllerProduct, Model: ModelProduct }))

  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀 http://localhost:${PORT}/ 🚀`)
  })

  return app
}
