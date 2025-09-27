import supertest from 'supertest'
import { app } from '../../app.js'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const api = supertest(app)
let jwt
let idProductCreated
let idUserCreated

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

describe('Users Test', () => {
  test('Register user', async () => {
    const response = await api.post('/register')
      .set('Cookie', jwt)
      .send({ username: 'Xaz13', password: 'Zfagomhom56' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    idUserCreated = response.body.message
  })

  test('Update password', async () => {
    await api.patch(`/updatePassword/${idUserCreated}`)
      .set('Cookie', jwt)
      .send({ newPassword: 'Zfagomhom57', password: 'Zfagomhom56' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('RefreshToken', async () => {
    const response = await api.get('/refreshToken')
      .set('Cookie', jwt)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    jwt = response.headers['set-cookie']
  })

  test('Validate Tokens', async () => {
    await api.get('/validateToken')
      .set('Cookie', jwt)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Delete user', async () => {
    await api.delete(`/deleteUser/${idUserCreated}`)
      .set('Cookie', jwt)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

describe('Product Tests', () => {
  test('Get products', async () => {
    await api.get('/products')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Create Products', async () => {
    const imgPath = path.join(__dirname, 'fixtures', 'do5.webp')

    const response = await api.post('/products')
      .set('Cookie', jwt)
      .attach('image', imgPath)
      .field('type', 'donut')
      .field('name', 'Donut rosita 2x1')
      .field('price', 8000)
      .field('units', 2)
      .field('toppings', 'glaseado de fresa con durazno')
      .expect(201)
      .expect('Content-Type', /application\/json/)

    idProductCreated = response.body.id
  })

  test('update product', async () => {
    const imgPath = path.join(__dirname, 'fixtures', 'd1.webp')
    await api.patch(`/products/${idProductCreated}`)
      .set('Cookie', jwt)
      .attach('image', imgPath)
      .field('name', 'Efectivamente una deona')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Delete products', async () => {
    await api.delete(`/products/${idProductCreated}`)
      .set('Cookie', jwt)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

afterAll(async () => {
  await api.post('/logOut')
    .set('Cookie', jwt)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
