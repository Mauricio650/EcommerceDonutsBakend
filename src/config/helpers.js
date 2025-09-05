import { cloudinary } from './cloudinary.js'
import streamifier from 'streamifier'

/* helper for upload a cloudinary from buffer */
export const uploadImage = ({ fileBuffer, folder = 'homerdonuts/products' }) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        quality: 'auto',
        fetch_format: 'auto'
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )

    streamifier.createReadStream(fileBuffer).pipe(stream)
  })
}
