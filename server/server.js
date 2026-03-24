require('dotenv').config()
const express = require('express')
const cors = require('cors')
const pool = require('./db')
const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users')
const categoriasRouter = require('./routes/categorias')
const productosRouter = require('./routes/productos')
const coloresRouter = require('./routes/colores')
const materialesRouter = require('./routes/materiales')
const tamaniosRouter = require('./routes/tamanios')
const uploadRouter  = require('./routes/upload')
const { verifyToken } = require('./middleware/auth')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json({ limit: '15mb' }))
app.use(express.urlencoded({ extended: true, limit: '15mb' }))

// Crear tabla si no existe
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        usuario VARCHAR(50) UNIQUE NOT NULL,
        correo VARCHAR(150) UNIQUE NOT NULL,
        contrasena TEXT NOT NULL,
        rol VARCHAR(20) NOT NULL CHECK (rol IN ('Administrador', 'Asistente')),
        fecha_alta TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    console.log('✅ Tabla "usuarios" lista en Neon PostgreSQL')

    // Verificar tabla categorias
    await pool.query('SELECT id, nombre, fecha_de_alta FROM categorias LIMIT 1')
    console.log('✅ Tabla "categorias" accesible en Neon PostgreSQL')

    // Ampliar codigo_hex de CHAR(1) a VARCHAR(7) si todavía es demasiado corto
    try {
      await pool.query(`
        ALTER TABLE "color"
        ALTER COLUMN codigo_hex TYPE VARCHAR(7)
        USING codigo_hex::VARCHAR(7)
      `)
      console.log('✅ Columna color.codigo_hex ampliada a VARCHAR(7)')
    } catch (e) {
      console.log('ℹ️  color.codigo_hex ya tiene el tipo correcto')
    }

  } catch (err) {
    console.error('❌ Error al inicializar la base de datos:', err)
    process.exit(1)
  }
}

// Rutas públicas (sin autenticación)
app.use('/api/auth', authRouter)

// Ruta pública de productos para el client (sin JWT)
app.get('/api/public/productos', async (req, res) => {
  try {
    const pool = require('./db')
    const result = await pool.query(
      `SELECT id, nombre, precio, descripcion, descuento, stock,
              ancho, alto, profundidad,
              productos_relacionados, categorias,
              imagen_principal, galeria,
              es_variable, colores, materiales, tamanios,
              created_at, updated_at
       FROM productos
       WHERE deleted_at IS NULL
       ORDER BY id ASC`
    )
    res.json(result.rows)
  } catch (err) {
    console.error('Error al obtener productos públicos:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

app.get('/api/public/productos/:id', async (req, res) => {
  try {
    const pool = require('./db')
    const result = await pool.query(
      `SELECT id, nombre, precio, descripcion, descuento, stock,
              ancho, alto, profundidad,
              productos_relacionados, categorias,
              imagen_principal, galeria,
              es_variable, colores, materiales, tamanios,
              created_at, updated_at
       FROM productos WHERE id = $1 AND deleted_at IS NULL`,
      [req.params.id]
    )
    if (result.rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Rutas protegidas (requieren JWT válido)
app.use('/api/users', verifyToken, usersRouter)
app.use('/api/categorias', verifyToken, categoriasRouter)
app.use('/api/productos', verifyToken, productosRouter)
app.use('/api/colores', verifyToken, coloresRouter)
app.use('/api/materiales', verifyToken, materialesRouter)
app.use('/api/tamanios',   verifyToken, tamaniosRouter)
app.use('/api/upload',     verifyToken, uploadRouter)

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ estado: 'ok', hora: new Date().toISOString() })
})

// Arrancar servidor
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor API corriendo en http://localhost:${PORT}`)
  })
})
