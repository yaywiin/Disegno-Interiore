const express = require('express')
const router = express.Router()
const pool = require('../db')

// Generate a random 9-digit non-sequential number
const generateOrderId = async () => {
  let isUnique = false
  let newId = ''

  while (!isUnique) {
    // Generate 9 digits number
    newId = Math.floor(100000000 + Math.random() * 900000000).toString()
    
    // Check in db
    const res = await pool.query('SELECT id FROM pedidos WHERE id = $1', [newId])
    if (res.rows.length === 0) {
      isUnique = true
    }
  }
  return newId
}

// Obtener todos los pedidos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, nombre_cliente, total, ciudad_estado, fecha_pedido, estado 
      FROM pedidos 
      ORDER BY fecha_pedido DESC
    `)
    res.json(result.rows)
  } catch (err) {
    console.error('Error al obtener pedidos:', err)
    res.status(500).json({ error: 'Error del servidor al obtener pedidos.' })
  }
})

// Obtener reporte de ventas filtrado por fechas (debe ir antes de /:id para no interferir)
router.get('/reportes/ventas', async (req, res) => {
  const { startDate, endDate } = req.query
  try {
    let query = 'SELECT productos, total, metodo_pago, fecha_pedido FROM pedidos'
    let values = []
    
    if (startDate && endDate) {
      // Usamos parámetros nombrados para las fechas y garantizamos el límite hasta la medianoche local si es necesario, pero el cliente pasará isostring.
      query += ' WHERE fecha_pedido >= $1 AND fecha_pedido <= $2'
      values = [startDate, endDate]
    }
    
    query += ' ORDER BY fecha_pedido DESC'
    
    const result = await pool.query(query, values)
    res.json(result.rows)
  } catch (err) {
    console.error('Error al obtener reporte:', err)
    res.status(500).json({ error: 'Error del servidor al obtener reporte.' })
  }
})

// Obtener un pedido por id
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query('SELECT * FROM pedidos WHERE id = $1', [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('Error al obtener pedido:', err)
    res.status(500).json({ error: 'Error del servidor al obtener pedido.' })
  }
})

// Crear un nuevo pedido (usado quizás más tarde o para tests)
router.post('/', async (req, res) => {
  const { nombre_cliente, total, ciudad_estado, estado } = req.body
  
  if (!nombre_cliente || total == null || !ciudad_estado) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' })
  }

  try {
    const newId = await generateOrderId()
    const finalEstado = estado || 'Pendiente'
    
    const result = await pool.query(
      `INSERT INTO pedidos (id, nombre_cliente, total, ciudad_estado, estado) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [newId, nombre_cliente, total, ciudad_estado, finalEstado]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error('Error al crear pedido:', err)
    res.status(500).json({ error: 'Error del servidor al crear pedido.' })
  }
})

// Actualizar el estado del pedido
router.put('/:id/estado', async (req, res) => {
  const { id } = req.params
  const { estado } = req.body
  
  const estadosValidos = ['Pendiente', 'En Proceso', 'Completado', 'Fallido', 'Reembolsado', 'Cancelado']
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ error: 'Estado no válido' })
  }

  try {
    const result = await pool.query(
      'UPDATE pedidos SET estado = $1 WHERE id = $2 RETURNING *',
      [estado, id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('Error al actualizar pedido:', err)
    res.status(500).json({ error: 'Error del servidor al actualizar estado.' })
  }
})

// Actualizar las notas del pedido
router.put('/:id/notas', async (req, res) => {
  const { id } = req.params
  const { notas } = req.body

  try {
    const result = await pool.query(
      'UPDATE pedidos SET notas = $1 WHERE id = $2 RETURNING *',
      [notas, id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }
    res.json(result.rows[0])
  } catch (err) {
    console.error('Error al actualizar notas:', err)
    res.status(500).json({ error: 'Error del servidor al actualizar notas.' })
  }
})

module.exports = router
