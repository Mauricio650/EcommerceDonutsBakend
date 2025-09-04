import { createApp } from './src/config/createApp.js'
import { ModelUser } from './src/models/user.js'
import { ModelProduct } from './src/models/product.js'

createApp({ ModelUser, ModelProduct })
