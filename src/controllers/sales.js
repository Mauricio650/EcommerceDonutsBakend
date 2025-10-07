import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { errorMappingZod } from '../logic/errorsZod.js'
import { validateSchemaClient } from '../schemas/clientSchema.js'

dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET_KEY

export class ControllerSales {
  constructor ({ ModelSales }) {
    this.ModelSales = ModelSales
  }

  createSale = async (req, res) => {
    try {
      const idSale = await this.ModelSales.createSale({ sale: req.body.sale })
      res.status(201).json({ message: 'Sale created!', id: idSale })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  totalCurrentMonth = async (req, res) => {
    const token = req.cookies.access_token
    const data = jwt.verify(token, JWT_SECRET)
    if (!data || data.role !== 'admin') return res.status(401).json({ message: 'access not authorized' })

    try {
      const {
        totalMonth,
        strawberriesAndCreamTotal, donutTotal
      } = await this.ModelSales.totalCurrentMonth()
      res.status(200).json({
        donut_total: donutTotal,
        strawberriesAndCream_total: strawberriesAndCreamTotal,
        salesTotalByMonth: totalMonth
      })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  deleteSaleById = async (req, res) => {
    const token = req.cookies.access_token
    const data = jwt.verify(token, JWT_SECRET)
    const { id } = req.params
    if (!id) return res.status(400).json({ message: 'verify the id in the params of url' })
    if (!data || data.role !== 'admin') return res.status(401).json({ message: 'access not authorized' })
    try {
      await this.ModelSales.deleteSaleById({ id })
      res.status(200).json({ message: 'Sale deleted' })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  createClient = async (req, res) => {
    const result = validateSchemaClient(req.body)
    if (!result.success) if (!result.success) return res.status(422).json({ message: errorMappingZod(result) })
    try {
      const id = await this.ModelSales.createClient({ client: result.data })
      res.status(201).json({ message: 'Client created', idClient: id })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  deleteClient = async (req, res) => {
    const token = req.cookies.access_token
    const data = jwt.verify(token, JWT_SECRET)
    const { id } = req.params
    if (!data || data.role !== 'admin') return res.status(401).json({ message: 'access not authorized' })
    if (!id) return res.status(400).json({ message: 'verify the id in the params of url' })

    try {
      await this.ModelSales.deleteClient({ id })
      res.status(200).json({ message: 'Client deleted' })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  ordersByClient = async (req, res) => {
    const token = req.cookies.access_token
    const data = jwt.verify(token, JWT_SECRET)
    if (!data || data.role !== 'admin') return res.status(401).json({ message: 'access not authorized' })
    try {
      const orders = await this.ModelSales.ordersByClient()
      res.status(200).json({ message: orders })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  orderStatus = async (req, res) => {
    const token = req.cookies.access_token
    const data = jwt.verify(token, JWT_SECRET)
    const { id } = req.params
    if (!id) return res.status(400).json({ message: 'verify the id in the params of url' })
    if (!data || data.role !== 'admin') return res.status(401).json({ message: 'access not authorized' })
    try {
      const idUpdated = await this.ModelSales.orderStatus({ id })
      res.status(200).json({ message: 'Order updated', idUpdated })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}
