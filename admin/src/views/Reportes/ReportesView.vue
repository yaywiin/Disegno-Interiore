<template>
  <AdminLayout>
    <div class="space-y-6 sm:space-y-8">
      
      <!-- Header & Filters -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white/90">
            Corte de Ventas
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Analiza el rendimiento de tus ventas y productos en un periodo específico.
          </p>
        </div>

        <div class="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <input 
            type="date" 
            v-model="startDate" 
            class="text-sm border-none bg-transparent focus:ring-0 text-gray-700 dark:text-gray-300 px-2"
          />
          <span class="text-gray-400">a</span>
          <input 
            type="date" 
            v-model="endDate" 
            class="text-sm border-none bg-transparent focus:ring-0 text-gray-700 dark:text-gray-300 px-2"
          />
          <button 
            @click="fetchReport"
            :disabled="loading"
            class="ml-2 bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors disabled:opacity-50"
          >
            {{ loading ? 'Cargando...' : 'Filtrar' }}
          </button>
        </div>
      </div>

      <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg">
        {{ error }}
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div class="absolute -right-4 -top-4 bg-brand-50 w-24 h-24 rounded-full opacity-50"></div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 relative z-10">Ingresos Totales</p>
          <div class="mt-4 flex items-baseline gap-2 relative z-10">
            <span class="text-3xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(totalVendido) }}</span>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Pagos con Tarjeta</p>
          <div class="mt-4 flex items-baseline gap-2">
            <span class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ formatCurrency(totalTarjeta) }}</span>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Transferencias SPEI</p>
          <div class="mt-4 flex items-baseline gap-2">
            <span class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{{ formatCurrency(totalTransferencia) }}</span>
          </div>
        </div>
      </div>

      <!-- Products Table -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white/90">Productos Vendidos</h3>
          <span class="text-sm text-gray-500">{{ totalItemsVendidos }} artículos en total</span>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead class="bg-gray-50 dark:bg-white/[0.02]">
              <tr>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Producto</th>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">Categoría</th>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 text-center">Unidades Vendidas</th>
                <th class="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 text-right">Monto Generado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
              <tr v-if="aggregatedProducts.length === 0">
                <td colspan="4" class="px-6 py-8 text-center text-gray-500">
                  No hay ventas registradas en este periodo de tiempo.
                </td>
              </tr>
              <tr v-for="prod in aggregatedProducts" :key="prod.id" class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-md overflow-hidden bg-gray-100 border border-gray-200 dark:border-gray-700">
                      <img v-if="prod.img" :src="prod.img" class="w-full h-full object-cover grayscale-[15%]" />
                    </div>
                    <span class="font-medium text-gray-900 dark:text-white">{{ prod.name }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-gray-600 dark:text-gray-300">
                  <span class="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded text-xs font-semibold tracking-wide uppercase">
                    {{ prod.category || 'Varios' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-center font-bold text-gray-900 dark:text-white">
                  {{ prod.quantity }}
                </td>
                <td class="px-6 py-4 text-right text-emerald-600 font-medium">
                  {{ formatCurrency(prod.revenue) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { API_BASE } from '@/config.js'

// Por defecto inicia mostrando el reporte del mes actual
const today = new Date()
const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)

const startDate = ref(firstDay.toISOString().split('T')[0])
const endDate = ref(lastDay.toISOString().split('T')[0])

const rawData = ref([])
const loading = ref(false)
const error = ref('')

const fetchReport = async () => {
  loading.value = true
  error.value = ''
  
  try {
    let url = `${API_BASE}/api/pedidos/reportes/ventas`
    if (startDate.value && endDate.value) {
      // Set end date to 23:59:59 to include the whole day
      const endD = new Date(endDate.value)
      endD.setHours(23, 59, 59, 999)
      
      const startD = new Date(startDate.value)
      startD.setHours(0, 0, 0, 0)

      url += `?startDate=${startD.toISOString()}&endDate=${endD.toISOString()}`
    }

    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
    })
    
    if (!res.ok) throw new Error('Error al cargar reporte')
    
    rawData.value = await res.json()
  } catch (err) {
    error.value = 'Ha ocurrido un error al conectar con el servidor para obtener el reporte.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchReport()
})

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', { 
    style: 'currency', currency: 'MXN', minimumFractionDigits: 2
  }).format(amount || 0)
}

// Compute metrics
const totalVendido = computed(() => {
  return rawData.value.reduce((sum, order) => sum + Number(order.total || 0), 0)
})

const totalTarjeta = computed(() => {
  return rawData.value
    .filter(o => o.metodo_pago === 'Tarjeta')
    .reduce((sum, order) => sum + Number(order.total || 0), 0)
})

const totalTransferencia = computed(() => {
  return rawData.value
    .filter(o => o.metodo_pago === 'Transferencia')
    .reduce((sum, order) => sum + Number(order.total || 0), 0)
})

const aggregatedProducts = computed(() => {
  const map = {}
  
  rawData.value.forEach(order => {
    if (!order.productos) return
    let items = []
    try {
      items = typeof order.productos === 'string' ? JSON.parse(order.productos) : order.productos
    } catch(e) { return }

    items.forEach(item => {
      // item puede venir empacado como item.product o ser directo item
      const prodId = item.product?.id || item.id || 'N/A'
      const name = item.product?.name || item.name || 'Desconocido'
      const cat = item.product?.category || item.category || ''
      const img = item.product?.img || item.img || ''
      const qty = Number(item.quantity) || 1
      const price = Number(item.product?.price || item.price || 0)
      const lineTotal = qty * price

      if (!map[prodId]) {
        map[prodId] = { id: prodId, name, category: cat, img, quantity: 0, revenue: 0 }
      }
      map[prodId].quantity += qty
      map[prodId].revenue += lineTotal
    })
  })

  return Object.values(map).sort((a,b) => b.revenue - a.revenue) // Order by top grossing array
})

const totalItemsVendidos = computed(() => {
  return aggregatedProducts.value.reduce((sum, p) => sum + p.quantity, 0)
})
</script>
