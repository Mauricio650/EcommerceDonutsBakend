import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { corsOptions } from '../cors/cors.js'
import { createUserRouter } from '../Routes/user.js'
import { createProductRouter } from '../Routes/product.js'
import { ControllerUser } from '../controllers/user.js'

export function createApp ({ ModelUser }) {
  const app = express()
  app.disable('x-powered-by')
  app.use(express.json())
  app.use(cors(corsOptions))
  app.use(cookieParser())
  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello world!' })
  })

  app.use(createUserRouter({ Controller: ControllerUser, Model: ModelUser }))
  app.use(createProductRouter())

  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀 http://localhost:${PORT}/ 🚀`)
  })
}
