const express = require('express')
const pool = require('../db')
const router = express.Router()

// GET /api/productos — Listar todos (no borrados)
router.get('/', async (req, res) => {
  try {
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
    console.error('Error al obtener productos:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// GET /api/productos/:id — Obtener uno
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      `SELECT id, nombre, precio, descripcion, descuento, stock,
              ancho, alto, profundidad,
              productos_relacionados, categorias,
              imagen_principal, galeria,
              es_variable, colores, materiales, tamanios,
              created_at, updated_at
       FROM productos WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('Error al obtener producto:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// POST /api/productos — Crear producto
router.post('/', async (req, res) => {
  const {
    nombre, precio, descripcion = '', descuento = 0, stock = 0,
    ancho = 0, alto = 0, profundidad = 0,
    productos_relacionados = [], categorias = [],
    imagen_principal = '', galeria = [],
    es_variable = false, colores = [], materiales = [], tamanios = []
  } = req.body

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre es requerido' })
  }
  if (precio === undefined || precio === null) {
    return res.status(400).json({ error: 'El precio es requerido' })
  }

  // Generate a unique 8-digit random ID (retry up to 5 times on collision)
  async function generateUniqueId() {
    for (let i = 0; i < 5; i++) {
      const candidate = Math.floor(10000000 + Math.random() * 90000000)
      const check = await pool.query('SELECT id FROM productos WHERE id = $1', [candidate])
      if (check.rows.length === 0) return candidate
    }
    throw new Error('No se pudo generar ID único')
  }

  try {
    const newId = await generateUniqueId()
    const result = await pool.query(
      `INSERT INTO productos
         (id, nombre, precio, descripcion, descuento, stock,
          ancho, alto, profundidad,
          productos_relacionados, categorias,
          imagen_principal, galeria,
          es_variable, colores, materiales, tamanios)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
       RETURNING id, nombre, precio, descripcion, descuento, stock,
                 ancho, alto, profundidad,
                 productos_relacionados, categorias,
                 imagen_principal, galeria,
                 es_variable, colores, materiales, tamanios,
                 created_at`,
      [
        newId,
        nombre.trim(), precio, descripcion, descuento, stock,
        ancho, alto, profundidad,
        productos_relacionados, categorias,
        imagen_principal, galeria,
        es_variable, colores, materiales, tamanios
      ]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Error al crear producto:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})


// PUT /api/productos/:id — Actualizar producto
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const {
    nombre, precio, descripcion, descuento, stock,
    ancho, alto, profundidad,
    productos_relacionados, categorias,
    imagen_principal, galeria,
    es_variable, colores, materiales, tamanios
  } = req.body

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ error: 'El nombre es requerido' })
  }

  try {
    const result = await pool.query(
      `UPDATE productos SET
         nombre=$1, precio=$2, descripcion=$3, descuento=$4, stock=$5,
         ancho=$6, alto=$7, profundidad=$8,
         productos_relacionados=$9, categorias=$10,
         imagen_principal=$11, galeria=$12,
         es_variable=$13, colores=$14, materiales=$15, tamanios=$16,
         updated_at=NOW()
       WHERE id=$17 AND deleted_at IS NULL
       RETURNING id, nombre, precio, descripcion, descuento, stock,
                 ancho, alto, profundidad,
                 productos_relacionados, categorias,
                 imagen_principal, galeria,
                 es_variable, colores, materiales, tamanios,
                 created_at, updated_at`,
      [
        nombre.trim(), precio, descripcion, descuento, stock,
        ancho, alto, profundidad,
        productos_relacionados, categorias,
        imagen_principal, galeria,
        es_variable, colores, materiales, tamanios,
        id
      ]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('Error al actualizar producto:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// DELETE /api/productos/:id — Soft delete
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query(
      'UPDATE productos SET deleted_at = NOW() WHERE id=$1 AND deleted_at IS NULL RETURNING id',
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }
    res.json({ mensaje: 'Producto eliminado correctamente' })
  } catch (err) {
    console.error('Error al eliminar producto:', err)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

module.exports = router
