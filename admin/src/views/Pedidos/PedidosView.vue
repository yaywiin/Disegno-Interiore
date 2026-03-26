<template>
  <AdminLayout>
    <div class="space-y-5 sm:space-y-6">
      
      <!-- Header y Filtros -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 class="text-xl font-bold text-gray-800 dark:text-white/90 cursor-pointer" @click="fetchPedidos">Pedidos</h2>
        
        <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <!-- Búsqueda -->
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por ID o Nombre..."
            class="w-full sm:w-64 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          
          <!-- Filtro Fecha -->
          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-500 dark:text-gray-400">Fecha:</label>
            <input
              v-model="dateFilter"
              type="date"
              class="w-full sm:w-auto rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              v-if="dateFilter"
              @click="dateFilter = ''"
              class="text-xs text-brand-500 hover:underline"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      <!-- Tabla -->
      <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-gray-50 dark:bg-white/[0.02]">
              <tr>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Numero de Pedido</th>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Cliente</th>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Total  </th>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Entrega</th>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Fecha</th>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
              <tr
                v-for="pedido in paginatedPedidos"
                :key="pedido.id"
                @click="goToDetail(pedido.id)"
                class="hover:bg-gray-50 dark:hover:bg-white/[0.02] cursor-pointer transition-colors"
                title="Ver detalle del pedido"
              >
                <td class="px-6 py-4 font-medium text-gray-800 dark:text-white/90">
                  #{{ pedido.id }}
                </td>
                <td class="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {{ pedido.nombre_cliente }}
                </td>
                <td class="px-6 py-4 font-medium text-emerald-600 dark:text-emerald-400">
                  {{ formatCurrency(pedido.total) }}
                </td>
                <td class="px-6 py-4 text-gray-600 dark:text-gray-400 text-sm">
                  {{ pedido.ciudad_estado }}
                </td>
                <td class="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                  {{ formatDate(pedido.fecha_pedido) }}
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                      getStatusColor(pedido.estado)
                    ]"
                  >
                    {{ pedido.estado }}
                  </span>
                </td>
              </tr>
              <tr v-if="paginatedPedidos.length === 0">
                <td colspan="6" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No se encontraron pedidos.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div
          v-if="totalPages > 1"
          class="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 px-6 py-4"
        >
          <span class="text-sm text-gray-500 dark:text-gray-400">
            Mostrando {{ (currentPage - 1) * 10 + 1 }} a {{ Math.min(currentPage * 10, filteredPedidos.length) }} de {{ filteredPedidos.length }} pedidos
          </span>
          <div class="flex gap-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
      
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const router = useRouter()
const API = 'http://localhost:3001/api/pedidos'
const authHeaders = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` })

const pedidos = ref([])
const searchQuery = ref('')
const dateFilter = ref('')
const currentPage = ref(1)

// Cargar pedidos desde la API
const fetchPedidos = async () => {
  try {
    const res = await fetch(API, { headers: authHeaders() })
    if (res.ok) {
      pedidos.value = await res.json()
    }
  } catch (e) {
    console.error('Error al cargar pedidos:', e)
  }
}

onMounted(() => {
  fetchPedidos()
})

// Filtrado de pedidos
const filteredPedidos = computed(() => {
  let filtered = pedidos.value

  // Búsqueda por ID o Nombre
  if (searchQuery.value) {
    const lowerQ = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.id.toLowerCase().includes(lowerQ) || 
      p.nombre_cliente.toLowerCase().includes(lowerQ)
    )
  }

  // Búsqueda por fecha (ignorando hora en zona local)
  if (dateFilter.value) {
    filtered = filtered.filter(p => {
      const d = new Date(p.fecha_pedido)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const localDateStr = `${year}-${month}-${day}`
      return localDateStr === dateFilter.value
    })
  }

  return filtered
})

// Paginación (10 elementos)
const totalPages = computed(() => Math.ceil(filteredPedidos.value.length / 10))

const paginatedPedidos = computed(() => {
  const start = (currentPage.value - 1) * 10
  const end = start + 10
  return filteredPedidos.value.slice(start, end)
})

// Acciones
const goToDetail = (id) => {
  router.push(`/pedidos/${id}`)
}

// Helpers
const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  // Formato dd/mm/aaaa
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatCurrency = (amount) => {
  const num = Number(amount)
  if (isNaN(num)) return '$0.00'
  return new Intl.NumberFormat('es-MX', { 
    style: 'currency', 
    currency: 'MXN',
    minimumFractionDigits: 2
  }).format(num)
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Completado': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800/20 dark:text-emerald-400'
    case 'Pendiente': return 'bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-400'
    case 'En Proceso': return 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400'
    case 'Fallido': return 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'
    case 'Cancelado': return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400'
    case 'Reembolsado': return 'bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-400'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400'
  }
}
</script>
