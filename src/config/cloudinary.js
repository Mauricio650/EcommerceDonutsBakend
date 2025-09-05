import { v2 } from 'cloudinary'

export const cloudinary = v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY_CLOUDINARY,
  api_secret: process.env.API_SECRET_CLOUDINARY,
  secure: true
})

async function checkCloudinary () {
  try {
    await cloudinary.api.resources({ max_results: 1 })
    console.log('✅ Cloudinary connected')
  } catch (err) {
    console.error('❌ Error during connection:', err.message)
  }
}

export async function deleteImage ({ publicId }) {
  const result = await cloudinary.uploader.destroy(publicId)
  return result // { result: "ok" } o { result: "not found" }
}

checkCloudinary()
