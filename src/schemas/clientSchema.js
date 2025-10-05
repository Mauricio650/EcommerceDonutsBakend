import { z } from 'zod'

const schemaClient = z.object({
  name: z.string().min(3, 'debe tener por lo menos 3 caracteres').max(60, 'el nombre tiene que ser maximo de 60 caracteres'),
  phoneNumber: z.string().min(5, 'minimo 5 numeros').max(20, 'maximo 20 numeros'),
  email: z.string().email('Correo invalido, por favor revisa el correo'),
  address: z.string().min(1, 'Minimo 1 caracter').max(200, 'Maximo 200 caracteres'),
  payReference: z.string().min(1, 'minimo 5 caracteres').max(100, 'Maximo 100 caracteres')
})

export const validateSchemaClient = (object) => {
  return schemaClient.safeParse(object)
}
