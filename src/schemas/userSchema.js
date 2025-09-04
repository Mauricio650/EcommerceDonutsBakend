import { z } from 'zod'

const userSchema = z.object({
  username: z.string().regex(/^(?=.*[A-Z])(?=.*\d)/,
    { message: 'must contain at least a number and a uppercase, min 8 max 20 chars' }).min(5).max(20),
  password: z.string().regex(/^(?=.*[A-Z])(?=.*\d)/,
    { message: 'must contain at least a number and a uppercase, min 8 max 20 chars' }).min(8).max(20),
  newPassword: z.string().regex(/^(?=.*[A-Z])(?=.*\d)/,
    { message: 'must contain at least a number and a uppercase, min 8 max 20 chars' }).min(8).max(20)
})

export function validateSchemaUser (object) {
  return userSchema.safeParse(object)
}

export function validatePartialSchemaUser (object) {
  return userSchema.partial().safeParse(object)
}
