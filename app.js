import { createApp } from './src/config/createApp.js'
import { ModelUser } from './src/models/user.js'
import { ModelProduct } from './src/models/product.js'
import { cloudinary } from './src/config/cloudinary.js'
import { db } from './src/config/db.js'

export const app = createApp({ ModelUser, ModelProduct })
