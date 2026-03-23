const express = require('express')
const pool = require('../db')
const router = express.Router()

// GET /api/categorias — Listar todas las categorías
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, fecha_de_alta FROM categorias ORDER BY id ASC'
    )
    res.json(result.rows)
  } catch (err) {
    console.error('Error al obtener categorías:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// GET /api/categorias/:id — Obtener una categoría
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      'SELECT id, nombre, fecha_de_alta FROM categorias WHERE id = $1',
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('Error al obtener categoría:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// POST /api/categorias — Crear una nueva categoría
router.post('/', async (req, res) => {
  const { nombre } = req.body

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre es requerido' })
  }

  try {
    const result = await pool.query(
      `INSERT INTO categorias (nombre, fecha_de_alta) VALUES ($1, NOW()) RETURNING id, nombre, fecha_de_alta`,
      [nombre.trim()]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Ya existe una categoría con ese nombre' })
    }
    console.error('Error al crear categoría:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// PUT /api/categorias/:id — Editar una categoría
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { nombre } = req.body

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre es requerido' })
  }

  try {
    const result = await pool.query(
      `UPDATE categorias SET nombre = $1 WHERE id = $2
       RETURNING id, nombre, fecha_de_alta`,
      [nombre.trim(), id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' })
    }
    res.json(result.rows[0])
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Ya existe una categoría con ese nombre' })
    }
    console.error('Error al editar categoría:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// DELETE /api/categorias/:id — Borrar una categoría
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      'DELETE FROM categorias WHERE id = $1 RETURNING id',
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' })
    }
    res.json({ mensaje: 'Categoría eliminada correctamente' })
  } catch (err) {
    console.error('Error al eliminar categoría:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

module.exports = router
