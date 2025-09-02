import jwt from 'jsonwebtoken'
import { validateSchemaUser } from '../schemas/userSchema'
import dotenv from 'dotenv'

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET_KEY

export class ControllerUser {
  constructor ({ ModelUser }) {
    this.ModelUser = ModelUser
  }

  login = async (req, res) => {
    /* validate the data sent in the body with the zod schema. */
    const result = validateSchemaUser(req.body) /* {username: pepeitO31, password: Uvabombom31} */

    /* check the validation status. If there is an error, we display an object indicating what the error is and what needs to be corrected. */
    if (!result) {
      const errors = {}
      result.error.issues.forEach(e => {
        errors.path = e.path
        errors.message = e.message
        return errors
      })
      return res.status(400).json({ message: errors })
    }

    try {
      /* call the Model's function that return us a user if this exists  */
      const user = await this.ModelUser.login({ credentials: result.data })

      /* create tokens for cookies, and add user's information */
      const token = jwt.sign({ id: user.id, user: user.username, role: user.role }, JWT_SECRET, { expiresIn: '20m' })
      const refreshToken = jwt.sign({ id: user.id, user: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' })

      res.cookies('access_token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true

      })

      res.cookies('refresh_token', refreshToken, {
        httpOnly: true, /* cookie can not read o modified from js in the browser */
        sameSite: 'none', /* allow request from others domains, fronted and backend in different domains */
        secure: true /* cookie only is send by https */

      })

      /* return a object with user information */
      res.status(200).json({ message: user })
    } catch (error) {
      /* validate which error return from backend for give a custom error */
      if (error.message === 'User not exists' || error.message === 'Password is wrong') {
        return res.status(400).json({ message: 'User or password is worng' })
      }
      return res.status(500).json({ message: 'Internal server error' })
    }
  }
}
