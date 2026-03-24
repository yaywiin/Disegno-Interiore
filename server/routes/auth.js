const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../db')
const router = express.Router()

// POST /api/auth/login — Iniciar sesión
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body

  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Correo y contraseña son requeridos.' })
  }

  try {
    // Buscar usuario por correo (excluir eliminados)
    const result = await pool.query(
      'SELECT id, nombre, usuario, correo, contrasena, rol FROM usuarios WHERE correo = $1 AND deleted_at IS NULL',
      [correo]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' })
    }

    const user = result.rows[0]

    // Comparar contraseña con el hash almacenado
    const passwordMatch = await bcrypt.compare(contrasena, user.contrasena)

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' })
    }

    // Generar token JWT
    const payload = {
      id: user.id,
      nombre: user.nombre,
      usuario: user.usuario,
      correo: user.correo,
      rol: user.rol,
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' })

    res.json({
      token,
      user: payload,
    })
  } catch (err) {
    console.error('Error en login:', err)
    res.status(500).json({ error: 'Error interno del servidor.' })
  }
})

// GET /api/auth/me — Verificar sesión activa (requiere token)
router.get('/me', (req, res) => {
  const authHeader = req.headers['authorization']
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autenticado.' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const jwt = require('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    res.json({ user: decoded })
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado.' })
  }
})

module.exports = router
