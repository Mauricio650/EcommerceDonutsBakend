import { Router } from 'express'

export function createUserRouter ({ Controller, Model }) {
  const userRouter = Router()
  const controllerUser = new Controller({ ModelUser: Model })

  userRouter.post('/user/login', controllerUser.login)
  userRouter.post('/user/register', controllerUser.register)
  userRouter.delete('/user/deleteUser/:id', controllerUser.deleteUser)
  userRouter.post('/user/logOut', controllerUser.logOut)
  userRouter.patch('/user/updatePassword/:id', controllerUser.changePassword)
  userRouter.get('/user/refreshToken', controllerUser.refreshToken)
  userRouter.get('/user/validateToken', controllerUser.validateToken)
  userRouter.get('/user/userList', controllerUser.userList)

  return userRouter
}
