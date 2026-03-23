const express = require('express')
const pool = require('../db')
const router = express.Router()

// GET /api/materiales
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT nombre, tipo FROM materiales ORDER BY nombre ASC')
    res.json(result.rows)
  } catch (err) {
    console.error('Error al obtener materiales:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// POST /api/materiales — Crear nuevo material
router.post('/', async (req, res) => {
  const { nombre, tipo } = req.body
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es requerido' })
  }
  try {
    const result = await pool.query(
      'INSERT INTO materiales (nombre, tipo) VALUES ($1, $2) RETURNING nombre, tipo',
      [nombre.trim(), (tipo || '').trim()]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Ya existe ese material' })
    console.error('Error al crear material:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// DELETE /api/materiales/:nombre
router.delete('/:nombre', async (req, res) => {
  try {
    await pool.query('DELETE FROM materiales WHERE nombre=$1', [req.params.nombre])
    res.json({ mensaje: 'Material eliminado' })
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

module.exports = router
