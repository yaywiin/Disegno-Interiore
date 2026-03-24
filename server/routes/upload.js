const express = require('express')
const router = express.Router()
const { v2: cloudinary } = require('cloudinary')

// Configurar Cloudinary con variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * POST /api/upload/image
 * Body: { data: "data:image/jpeg;base64,..." }
 * Returns: { url, public_id }
 */
router.post('/image', async (req, res) => {
  const { data } = req.body

  if (!data || !data.startsWith('data:image')) {
    return res.status(400).json({ error: 'Se requiere una imagen en base64 válida' })
  }

  try {
    const result = await cloudinary.uploader.upload(data, {
      folder: 'disegno/productos',
      resource_type: 'image',
      // Optimización automática
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    })

    res.json({ url: result.secure_url, public_id: result.public_id })
  } catch (err) {
    console.error('Error al subir imagen a Cloudinary:', err)
    res.status(500).json({ error: 'Error al subir imagen a Cloudinary' })
  }
})

/**
 * POST /api/upload/images
 * Body: { images: ["data:image/...", ...] }
 * Returns: { urls: [...], public_ids: [...] }
 */
router.post('/images', async (req, res) => {
  const { images } = req.body

  if (!Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ error: 'Se requiere un array de imágenes' })
  }

  try {
    const uploads = await Promise.all(
      images.map(data =>
        cloudinary.uploader.upload(data, {
          folder: 'disegno/productos',
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        })
      )
    )

    res.json({
      urls:       uploads.map(r => r.secure_url),
      public_ids: uploads.map(r => r.public_id),
    })
  } catch (err) {
    console.error('Error al subir imágenes a Cloudinary:', err)
    res.status(500).json({ error: 'Error al subir imágenes a Cloudinary' })
  }
})

module.exports = router
