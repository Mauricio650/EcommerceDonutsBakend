import { Router } from 'express'

export function createUserRouter ({ Controller, Model }) {
  const userRouter = Router()
  const controllerUser = new Controller({ ModelUser: Model })

  userRouter.post('/login', controllerUser.login)
  userRouter.patch('/updatePassword', controllerUser.changePassword)

  return userRouter
}
