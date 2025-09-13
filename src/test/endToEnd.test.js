import supertest from 'supertest'
import { app } from '../../app.js'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const api = supertest(app)
let jwt
let idProductCreated

beforeAll(async () => {
  const response = await api.post('/login')
    .send(
      {
        username: 'Mau31',
        password: 'Uvabombom31'
      })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  jwt = response.headers['set-cookie']
})

describe('Product Tests', () => {
  test('Get products', async () => {
    await api.get('/products')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Create Products', async () => {
    const imgPath = path.join(__dirname, 'fixtures', 'foto.jpeg')

    const response = await api.post('/products')
      .set('Cookie', jwt)
      .attach('image', imgPath)
      .field('type', 'donut')
      .field('name', 'epadddddd epa epa')
      .field('price', 6500)
      .field('units', 1)
      .field('toppings', 'epadddddd epa con epita')
      .expect(201)
      .expect('Content-Type', /application\/json/)

    idProductCreated = response.body.id
  })

  test('update image', async () => {
    const imgPath = path.join(__dirname, 'fixtures', 'ia_pho.png')
    await api.patch(`/products/${idProductCreated}`)
      .set('Cookie', jwt)
      .attach('image', imgPath)
      .field('name', 'Efectivamente una deona')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Delete images', async () => {
    await api.delete(`/products/${idProductCreated}`)
      .set('Cookie', jwt)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})
