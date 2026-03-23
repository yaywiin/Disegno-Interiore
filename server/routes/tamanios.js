const express = require('express')
const pool = require('../db')
const router = express.Router()

// GET /api/tamanios
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT "Id" as id, "Nombre" as nombre, "Altura_cm" as altura_cm, "Ancho_cm" as ancho_cm, "Profunidad_cm" as profundidad_cm
       FROM "tamaños" ORDER BY "Nombre" ASC`
    )
    res.json(result.rows)
  } catch (err) {
    console.error('Error al obtener tamaños:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// POST /api/tamanios — Crear nuevo tamaño
router.post('/', async (req, res) => {
  const { nombre, altura_cm = 0, ancho_cm = 0, profundidad_cm = 0 } = req.body
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es requerido' })
  }
  try {
    const result = await pool.query(
      `INSERT INTO "tamaños" ("Nombre", "Altura_cm", "Ancho_cm", "Profunidad_cm")
       VALUES ($1, $2, $3, $4)
       RETURNING "Id" as id, "Nombre" as nombre, "Altura_cm" as altura_cm, "Ancho_cm" as ancho_cm, "Profunidad_cm" as profundidad_cm`,
      [nombre.trim(), altura_cm, ancho_cm, profundidad_cm]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Ya existe ese tamaño' })
    console.error('Error al crear tamaño:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// DELETE /api/tamanios/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM "tamaños" WHERE "Id"=$1', [req.params.id])
    res.json({ mensaje: 'Tamaño eliminado' })
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

module.exports = router
