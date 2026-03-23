const express = require('express')
const pool = require('../db')
const router = express.Router()

// GET /api/colores
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT "Id" as id, "Nombre" as nombre, "Codigo_Hex" as codigo_hex FROM "color" ORDER BY "Nombre" ASC'
    )
    res.json(result.rows)
  } catch (err) {
    console.error('Error al obtener colores:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// POST /api/colores — Crear nuevo color
router.post('/', async (req, res) => {
  const { nombre, codigo_hex } = req.body
  if (!nombre || !codigo_hex) {
    return res.status(400).json({ error: 'nombre y codigo_hex son requeridos' })
  }
  try {
    const result = await pool.query(
      'INSERT INTO "color" ("Nombre", "Codigo_Hex") VALUES ($1, $2) RETURNING "Id" as id, "Nombre" as nombre, "Codigo_Hex" as codigo_hex',
      [nombre.trim(), codigo_hex.trim()]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    if (err.code === '23505') {
      const existing = await pool.query(
        'SELECT "Id" as id, "Nombre" as nombre, "Codigo_Hex" as codigo_hex FROM "color" WHERE "Nombre" = $1',
        [nombre.trim()]
      )
      return res.status(200).json(existing.rows[0])
    }
    console.error('Error al crear color:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// DELETE /api/colores/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM "color" WHERE "Id"=$1', [req.params.id])
    res.json({ mensaje: 'Color eliminado' })
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

module.exports = router
