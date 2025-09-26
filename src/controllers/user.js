import jwt from 'jsonwebtoken'
import { validatePartialSchemaUser, validateSchemaUser } from '../schemas/userSchema.js'
import dotenv from 'dotenv'

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET_KEY

export class ControllerUser {
  constructor ({ ModelUser }) {
    this.ModelUser = ModelUser
  }

  login = async (req, res) => {
    /* validate the data sent in the body with the zod schema. */
    const result = validatePartialSchemaUser(req.body) /* {username: password:} */
    /* check the validation status. If there is an error, we display an object indicating what the error is and what needs to be corrected. */
    if (!result.success) {
      const errors = {}
      result.error.issues.forEach(e => {
        errors.path = e.path
        errors.message = e.message
        return errors
      })
      return res.status(422).json({ message: errors })
    }

    try {
      /* call the Model's function that return us a user if this exists  */
      const user = await this.ModelUser.login({ credentials: result.data })

      /* create tokens for cookies, and add user's information */
      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '120m' })
      const refreshToken = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '7d' })

      res.cookie('access_token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true

      })

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true, /* cookie can not read o modified from js in the browser */
        sameSite: 'none', /* allow request from others domains, fronted and backend in different domains */
        secure: true /* cookie only is send by https */

      })
      /* return a object with user information */
      res.status(200).json({ user })
    } catch (error) {
      /* validate which error return from backend for give a custom error */
      if (error.message === 'User not exists' || error.message === 'Password is wrong') {
        return res.status(400).json({ message: 'User or password is worng' })
      }
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  register = async (req, res) => {
    const token = req.cookies.access_token
    const result = validatePartialSchemaUser(req.body)

    const data = jwt.verify(token, JWT_SECRET)
    if (!data || data.role !== 'admin') return res.status(401).json({ message: 'access not authorized' })

    if (!result.success) { /* save path and message of errors on object */
      const errors = {}
      result.error.issues.forEach(e => {
        errors.path = e.path
        errors.message = e.message
        return errors
      })
      return res.status(422).json({ message: errors })
    }

    try {
      const response = await this.ModelUser.register({ newUser: result.data })
      res.status(200).json({ message: response })
    } catch (error) {
      if (error.message === 'User already exists') res.status(409).json({ error: 'User already exists' })
      res.status(500).json({ error: 'Internal server error' })
    }
  }

  changePassword = async (req, res) => {
    const token = req.cookies.access_token
    const result = validatePartialSchemaUser(req.body) /* {newPassword, password} */

    const data = jwt.verify(token, JWT_SECRET)
    if (!data || data.role !== 'admin') return res.status(401).json({ message: 'access not authorized' })

    if (!result.success) { /* save path and message of errors on object */
      const errors = {}
      result.error.issues.forEach(e => {
        errors.path = e.path
        errors.message = e.message
        return errors
      })
      return res.status(422).json({ message: errors })
    }

    try {
      const response = await this.ModelUser.changePassword({ passwords: result.data, username: data.username })
      return res.status(200).json({ message: response })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  /* Created a new access token when this expire */
  refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refresh_token

    if (!refreshToken) return res.status(401).json({ error: 'access not authorized' })

    const data = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY)
    if (!data) return res.status(403).json({ message: 'access not authorized' })
    const token = jwt.sign({ id: data.id, username: data.username, role: data.role }, JWT_SECRET, { expiresIn: '20m' })
    res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true
    })
    res.status(200).json({ message: 'New access token generated' })
  }

  /* validate user's access token */
  validateToken = async (req, res) => {
    try {
      const token = req.cookies.access_token
      if (!token) {
        return res.status(401).json({ error: 'No token provided' })
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

      res.status(200).json({
        id: decoded.id,
        username: decoded.username,
        role: decoded.role
      })
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }
  }

  logOut = async (req, res) => {
    res.clearCookie('access_token')
    res.clearCookie('refresh_token')
    res.status(200).json({ message: 'Log out successfully' })
  }
}
