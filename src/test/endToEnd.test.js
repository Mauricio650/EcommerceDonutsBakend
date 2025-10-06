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
let idSaleCreated
let idClientCreated

beforeAll(async () => {
  const response = await api.post('/user/login')
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
    const response = await api.post('/user/register')
      .set('Cookie', jwt)
      .send({ username: 'Xaz13', password: 'Zfagomhom56' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    idUserCreated = response.body.message
  })

  test('Update password', async () => {
    await api.patch(`/user/updatePassword/${idUserCreated}`)
      .set('Cookie', jwt)
      .send({ newPassword: 'Zfagomhom57' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('RefreshToken', async () => {
    const response = await api.get('/user/refreshToken')
      .set('Cookie', jwt)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    jwt = response.headers['set-cookie']
  })

  test('Validate Tokens', async () => {
    await api.get('/user/validateToken')
      .set('Cookie', jwt)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Users list', async () => {
    await api.get('/user/userList')
      .set('Cookie', jwt)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Delete user', async () => {
    await api.delete(`/user/deleteUser/${idUserCreated}`)
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

describe('Sales tests', () => {
  test('Create a client', async () => {
    const response = await api.post('/sales/clients')
      .send({
        name: 'a ver y te creo',
        phoneNumber:
        '14523698770',
        email: 'test@gmail.com',
        address: 'cra test con 58 test',
        payReference: 'MTtesttestes01'
      })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    idClientCreated = response.body.idClient
  })

  test('Create a sale', async () => {
    const response = await api.post('/sales')
      .send({ sale: [['donut test', 9400, 'donut', 3, idClientCreated]] })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    idSaleCreated = response.body.id
  })

  test('Delete a sale', async () => {
    await api.delete(`/sales/${idSaleCreated}`)
      .set('Cookie', jwt)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Delete a client', async () => {
    await api.delete(`/sales/clients/${idClientCreated}`)
      .set('Cookie', jwt)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Get total sales by month', async () => {
    await api.get('/sales/totalCurrentMonth')
      .set('Cookie', jwt)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('get orders by client', async () => {
    await api.get('/sales/clients/orders')
      .set('Cookie', jwt)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

afterAll(async () => {
  await api.post('/user/logOut')
    .set('Cookie', jwt)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
