import { z } from 'zod'

const schemaProduct = z.object({
  type: z.enum(['donut', 'strawberriesAndCream']),
  name: z.string().min(6).max(50),
  price: z.coerce.number().int().min(1000).max(999999),
  units: z.coerce.number().int().min(1).max(50),
  toppings: z.string().min(6).max(100)
})

export function validateSchemaProduct (object) {
  return schemaProduct.safeParse(object)
}

export function validatePartialSchemaProduct (object) {
  return schemaProduct.partial().safeParse(object)
}
