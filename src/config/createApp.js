import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { corsOptions } from '../cors/cors.js'
import { createUserRouter } from '../Routes/user.js'
import { createProductRouter } from '../Routes/product.js'
import { ControllerUser } from '../controllers/user.js'
import jwt from 'jsonwebtoken'
import { ControllerProduct } from '../controllers/product.js'

export function createApp ({ ModelUser, ModelProduct }) {
  const app = express()
  app.disable('x-powered-by')
  app.use(express.json())
  app.use(cors(corsOptions))
  app.use(cookieParser())
  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello world!' })
  })

  app.use(createUserRouter({ Controller: ControllerUser, Model: ModelUser }))

  app.use('/', (req, res, next) => {
    const token = req.cookies.access_token
    const refreshToken = req.cookies.refresh_token
    req.session = { user: null }
    try {
      if (token) {
        const data = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.session.user = data
      } else if (refreshToken) {
        const dataR = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY)
        req.session.user = dataR
      }
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
}
