import { ref } from 'vue'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api/public'

// Mapea un producto de la BD al formato que usa el template del client
function mapProduct(p) {
  return {
    id:        p.id,
    name:      p.nombre,
    category:  p.categorias?.[0] || 'Sin categoría',
    img:       p.imagen_principal || '/product_living.png',
    gallery:   p.galeria && p.galeria.length > 0
                 ? p.galeria
                 : (p.imagen_principal ? [p.imagen_principal] : ['/product_living.png']),
    badge:     p.descuento > 0 ? `-${p.descuento}%` : null,
    desc:      p.descripcion || '',
    materials: p.materiales || [],
    sizes:     p.tamanios || [],
    colors:    (p.colores || []).map(c => {
      // colores puede ser ["Rojo · #ff0000"] o ["Rojo"] según cómo se guardó
      if (typeof c === 'object' && c.name) return { name: c.name, hex: c.hex || '#888' }
      const str = String(c)
      // Intentar detectar hex inline: "Nombre · #aabbcc"
      const hexMatch = str.match(/#([0-9a-fA-F]{3,6})/)
      const hex = hexMatch ? hexMatch[0] : '#888888'
      const name = str.replace(/·?\s*#[0-9a-fA-F]{3,6}/, '').trim() || str
      return { name, hex }
    }),
    price:      p.descuento > 0 ? (p.precio - (p.precio * p.descuento / 100)) : parseFloat(p.precio) || 0,
    originalPrice: p.descuento > 0 ? parseFloat(p.precio) : null,
    stock:      p.stock || 0,
    ancho:      p.ancho || 0,
    alto:       p.alto || 0,
    profundidad: p.profundidad || 0,
    relacionados: p.productos_relacionados || [],
  }
}

// Estado compartido entre todas las instancias del composable
const products   = ref([])
const loading    = ref(false)
const loaded     = ref(false)
const error      = ref(null)

async function fetchProducts() {
  if (loaded.value || loading.value) return
  loading.value = true
  error.value   = null
  try {
    const res  = await fetch(`${API_URL}/productos`)
    if (!res.ok) throw new Error('Error al cargar productos')
    const data = await res.json()
    products.value = data.map(mapProduct)
    loaded.value = true
  } catch (e) {
    console.error('useProducts:', e)
    error.value = e.message
  } finally {
    loading.value = false
  }
}

export function useProducts() {
  // Auto-cargar cuando se invoca el composable
  fetchProducts()

  const getProductById = (id) => {
    return products.value.find(p => String(p.id) === String(id)) || null
  }

  const reload = () => {
    loaded.value = false
    fetchProducts()
  }

  return {
    products,
    loading,
    error,
    getProductById,
    reload,
  }
}
