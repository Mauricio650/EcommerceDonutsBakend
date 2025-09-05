import multer from 'multer'

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true)
  else cb(new Error('only allow images', false))
}

const limits = {
  fileSize: 5 * 1024 * 1024
}
export const upload = multer({ storage, fileFilter, limits })
