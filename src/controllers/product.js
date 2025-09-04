export class ControllerProduct {
  constructor ({ ModelProduct }) {
    this.ModelProduct = ModelProduct
  }

  getProducts = async (req, res) => {
    try {
      const products = await this.ModelProduct.getProducts()
      res.status(200).json({ message: products })
    } catch (error) {
      res.status(500).json({ message: 'internal server error' })
    }
  }
}
