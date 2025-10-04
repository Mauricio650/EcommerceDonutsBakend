import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

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
      const total = await this.ModelSales.totalCurrentMonth()
      const totalMonth = Number(total[0].total_sales) + Number(total[1].total_sales)
      res.status(200).json({ donut_total: Number(total[0].total_sales).toLocaleString('es-CO'), strawberriesAndCream_total: Number(total[1].total_sales).toLocaleString('es-CO'), salesTotalByMonth: totalMonth.toLocaleString('es-CO') })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  deleteSaleById = async (req, res) => {
    const token = req.cookies.access_token
    const data = jwt.verify(token, JWT_SECRET)
    const { id } = req.params
    if (!data || data.role !== 'admin') return res.status(401).json({ message: 'access not authorized' })
    try {
      await this.ModelSales.deleteSaleById({ id })
      res.status(200).json({ message: 'Sale deleted' })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}
