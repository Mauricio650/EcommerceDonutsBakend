import { Router } from 'express'

export function createUserRouter ({ Controller, Model }) {
  const userRouter = Router()
  const controllerUser = new Controller({ ModelUser: Model })

  userRouter.post('/login', controllerUser.login)
  userRouter.post('/register', controllerUser.register)
  userRouter.post('/logOut', controllerUser.logOut)
  userRouter.patch('/updatePassword', controllerUser.changePassword)
  userRouter.get('/refreshToken', controllerUser.refreshToken)
  userRouter.get('/validateToken', controllerUser.validateToken)

  return userRouter
}
