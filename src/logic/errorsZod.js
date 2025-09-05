export const errorMappingZod = (result) => {
  if (!result.success) {
    const errors = {}
    result.error.issues.forEach(e => {
      errors.path = e.path
      errors.message = e.message
      return errors
    })
  }
  return true
}
