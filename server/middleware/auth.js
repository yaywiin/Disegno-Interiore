const jwt = require('jsonwebtoken')

/**
 * Middleware JWT — verifica el token en el header Authorization.
 * Si es válido, adjunta req.user con el payload del token.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'La sesión ha expirado. Inicia sesión de nuevo.' })
    }
    return res.status(401).json({ error: 'Token inválido.' })
  }
}

module.exports = { verifyToken }
