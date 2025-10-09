import { Router } from 'express'

export function createSalesRouter ({ Controller, Model }) {
  const salesRouter = Router()
  const controllerSales = new Controller({ ModelSales: Model })

  salesRouter.post('/sales', controllerSales.createSale)
  salesRouter.get('/sales/totalCurrentMonth', controllerSales.totalCurrentMonth)
  salesRouter.delete('/sales/:id', controllerSales.deleteSaleById)
  salesRouter.post('/sales/clients', controllerSales.createClient)
  salesRouter.get('/sales/clients', controllerSales.clientsList)
  salesRouter.delete('/sales/clients/:id', controllerSales.deleteClient)
  salesRouter.get('/sales/clients/orders', controllerSales.ordersByClient)
  salesRouter.patch('/sales/clients/orders/:id', controllerSales.orderStatus)

  return salesRouter
}
