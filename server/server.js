require('dotenv').config()
const express = require('express')
const cors = require('cors')
const pool = require('./db')
const usersRouter = require('./routes/users')
const categoriasRouter = require('./routes/categorias')
const productosRouter = require('./routes/productos')
const coloresRouter = require('./routes/colores')
const materialesRouter = require('./routes/materiales')
const tamaniosRouter = require('./routes/tamanios')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}))
app.use(express.json())

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

// Rutas
app.use('/api/users', usersRouter)
app.use('/api/categorias', categoriasRouter)
app.use('/api/productos', productosRouter)
app.use('/api/colores', coloresRouter)
app.use('/api/materiales', materialesRouter)
app.use('/api/tamanios', tamaniosRouter)

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
