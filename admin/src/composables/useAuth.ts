import { useRouter } from 'vue-router'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export function useAuth() {
  const router = useRouter()

  const getToken = (): string | null => {
    return localStorage.getItem('token')
  }

  const getUser = () => {
    const raw = localStorage.getItem('user')
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }

  const isAuthenticated = (): boolean => {
    const token = getToken()
    if (!token) return false
    try {
      // Decodificar sin verificar la firma (solo para comprobar expiración en cliente)
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp > Date.now() / 1000
    } catch {
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/signin')
  }

  /**
   * Devuelve las opciones de fetch con el header Authorization incluido.
   * Uso: fetch(url, authFetch({ method: 'GET' }))
   */
  const authFetch = (options: RequestInit = {}): RequestInit => {
    const token = getToken()
    return {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    }
  }

  return { getToken, getUser, isAuthenticated, logout, authFetch, API_URL }
}
