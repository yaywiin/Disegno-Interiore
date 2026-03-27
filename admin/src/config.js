// Configuración central de la API
// En producción (Vercel), VITE_API_URL apunta al servidor desplegado.
// En desarrollo local, hace fallback a http://localhost:3001
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'
