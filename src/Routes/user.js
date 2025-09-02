import { Router } from 'express'

export function createUserRouter () {
  const userRouter = Router()

  userRouter.post('/login', (req, res) => console.log('/login'))
  userRouter.patch('/updatePassword', (req, res) => console.log('/updatePassword'))

  return userRouter
}
