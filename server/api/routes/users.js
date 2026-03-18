const express = require('express')
const bcrypt = require('bcrypt')
const pool = require('../db')
const router = express.Router()

// GET /api/users — Listar todos los usuarios
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, usuario, correo, rol, fecha_alta FROM usuarios ORDER BY id ASC'
    )
    res.json(result.rows)
  } catch (err) {
    console.error('Error al obtener usuarios:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// POST /api/users — Crear un nuevo usuario
router.post('/', async (req, res) => {
  const { nombre, usuario, correo, contrasena, rol } = req.body

  if (!nombre || !usuario || !correo || !contrasena || !rol) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' })
  }

  try {
    const saltRounds = 10
    const contrasena_hash = await bcrypt.hash(contrasena, saltRounds)

    const result = await pool.query(
      `INSERT INTO usuarios (nombre, usuario, correo, contrasena_hash, rol)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nombre, usuario, correo, rol, fecha_alta`,
      [nombre, usuario, correo, contrasena_hash, rol]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'El usuario o correo ya existe' })
    }
    console.error('Error al crear usuario:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// PUT /api/users/:id — Editar un usuario
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { nombre, usuario, correo, contrasena, rol } = req.body

  if (!nombre || !usuario || !correo || !rol) {
    return res.status(400).json({ error: 'Nombre, usuario, correo y rol son requeridos' })
  }

  try {
    let query, params

    if (contrasena && contrasena.trim() !== '') {
      const saltRounds = 10
      const contrasena_hash = await bcrypt.hash(contrasena, saltRounds)
      query = `UPDATE usuarios SET nombre=$1, usuario=$2, correo=$3, contrasena_hash=$4, rol=$5
               WHERE id=$6
               RETURNING id, nombre, usuario, correo, rol, fecha_alta`
      params = [nombre, usuario, correo, contrasena_hash, rol, id]
    } else {
      query = `UPDATE usuarios SET nombre=$1, usuario=$2, correo=$3, rol=$4
               WHERE id=$5
               RETURNING id, nombre, usuario, correo, rol, fecha_alta`
      params = [nombre, usuario, correo, rol, id]
    }

    const result = await pool.query(query, params)

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.json(result.rows[0])
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'El usuario o correo ya existe' })
    }
    console.error('Error al editar usuario:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// DELETE /api/users/:id — Borrar un usuario
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const result = await pool.query(
      'DELETE FROM usuarios WHERE id=$1 RETURNING id',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.json({ mensaje: 'Usuario eliminado correctamente' })
  } catch (err) {
    console.error('Error al eliminar usuario:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

module.exports = router
