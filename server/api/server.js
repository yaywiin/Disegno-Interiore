require('dotenv').config()
const express = require('express')
const cors = require('cors')
const pool = require('./db')
const usersRouter = require('./routes/users')

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
        contrasena_hash TEXT NOT NULL,
        rol VARCHAR(20) NOT NULL CHECK (rol IN ('Administrador', 'Asistente')),
        fecha_alta TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    console.log('✅ Tabla "usuarios" lista en Neon PostgreSQL')
  } catch (err) {
    console.error('❌ Error al inicializar la base de datos:', err)
    process.exit(1)
  }
}

// Rutas
app.use('/api/users', usersRouter)

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
