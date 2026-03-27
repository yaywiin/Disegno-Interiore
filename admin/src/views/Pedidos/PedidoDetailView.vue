<template>
  <AdminLayout>
    <div class="space-y-5 sm:space-y-6">
      
      <!-- Header -->
      <div class="flex items-center gap-4 mb-6">
        <button
          @click="router.push('/pedidos')"
          class="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeftIcon class="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <div>
          <h2 class="text-xl font-bold text-gray-800 dark:text-white/90">
            Detalle del Pedido #{{ pedido?.id || '...' }}
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400" v-if="pedido">
            {{ formatDate(pedido.fecha_pedido) }}
          </p>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12 text-gray-500">
        Cargando información del pedido...
      </div>
      
      <div v-else-if="error" class="text-center py-12 text-red-500">
        {{ error }}
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Left Card: Datos del cliente y envío -->
        <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 lg:p-8 flex flex-col gap-6 shadow-sm">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white/90 border-b border-gray-100 dark:border-gray-800 pb-4">
            Datos del Cliente y Envío
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <dt class="text-xs font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400 mb-1">Nombre Completo</dt>
              <dd class="text-base text-gray-900 dark:text-white">
                {{ pedido.nombre_cliente }} {{ pedido.apellidos || '' }}
              </dd>
            </div>
            
            <div>
              <dt class="text-xs font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400 mb-1">Correo Electrónico</dt>
              <dd class="text-base text-gray-900 dark:text-white break-all">
                <a :href="'mailto:' + pedido.correo" class="text-brand-600 hover:text-brand-500 transition-colors" v-if="pedido.correo">
                  {{ pedido.correo }}
                </a>
                <span v-else class="text-gray-400 italic">No proporcionado</span>
              </dd>
            </div>

            <div>
              <dt class="text-xs font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400 mb-1">Teléfono Móvil</dt>
              <dd class="text-base text-gray-900 dark:text-white">
                {{ pedido.telefono || 'No proporcionado' }}
              </dd>
            </div>

            <div class="sm:col-span-2">
              <dt class="text-xs font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400 mb-1">Dirección de Entrega</dt>
              <dd class="text-base text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg mt-2">
                <p v-if="pedido.calle_numero" class="font-medium">{{ pedido.calle_numero }}</p>
                <p>
                  {{ pedido.ciudad || pedido.ciudad_estado }}, 
                  {{ pedido.estado_republica || '' }} 
                </p>
                <p v-if="pedido.codigo_postal" class="text-gray-600 dark:text-gray-300">C.P. {{ pedido.codigo_postal }}</p>
              </dd>
            </div>
            <div class="sm:col-span-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <dt class="text-xs font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400 mb-2">Notas del Pedido</dt>
              <dd>
                <textarea 
                  v-model="newNotas"
                  placeholder="Ej: El cliente menciona que el timbre no funciona..."
                  class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 text-sm text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[100px] resize-y mb-3"
                ></textarea>
                <div class="flex justify-end">
                  <button
                    @click="updateNotas"
                    :disabled="updatingNotas || newNotas === (pedido.notas || '')"
                    class="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    {{ updatingNotas ? 'Guardando...' : 'Guardar Notas' }}
                  </button>
                </div>
              </dd>
            </div>
          </div>
          
          <div class="mt-auto border-t border-gray-100 dark:border-gray-800 pt-6">
            <dt class="text-xs font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400 mb-3">Actualizar Estado del Pedido</dt>
            <div class="flex items-center gap-3">
              <select
                v-model="newStatus"
                class="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Completado">Completado</option>
                <option value="Fallido">Fallido</option>
                <option value="Reembolsado">Reembolsado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
              <button
                @click="updateStatus"
                :disabled="updating || newStatus === pedido.estado"
                class="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {{ updating ? 'Actualizando...' : 'Guardar Estado' }}
              </button>
            </div>
            
            <div class="mt-4 flex items-center gap-2">
              <span class="text-sm text-gray-500">Estado actual:</span>
              <span
                :class="[
                  'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide',
                  getStatusColor(pedido.estado)
                ]"
              >
                {{ pedido.estado }}
              </span>
            </div>
          </div>
        </div>

        <!-- Right Card: Productos -->
        <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 lg:p-8 flex flex-col gap-6 shadow-sm">
          <h3 class="text-xl font-bold text-gray-800 dark:text-white/90 border-b border-gray-100 dark:border-gray-800 pb-4">
            Productos
          </h3>

          <div v-if="productosParseados && productosParseados.length > 0" class="flex-1 overflow-y-auto pr-2 custom-scrollbar" style="max-height: 300px;">
            <ul class="space-y-4">
              <li v-for="(item, i) in productosParseados" :key="i" class="flex items-start gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                <div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-white">
                  <img :src="item.product?.img || item.img" class="h-full w-full object-cover object-center" />
                </div>
                <div class="flex flex-1 flex-col">
                  <div class="flex justify-between text-sm font-medium text-gray-900 dark:text-white">
                    <h4 class="line-clamp-2"><a href="#">{{ item.product?.name || item.name || 'Producto' }}</a></h4>
                    <p class="ml-4 whitespace-nowrap">{{ formatCurrency((item.product?.price || item.price) * (item.quantity || 1)) }}</p>
                  </div>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400" v-if="item.options">
                    <span v-if="item.options.color" class="mr-2">Color: {{ item.options.color }}</span>
                    <span v-if="item.options.material" class="mr-2">Material: {{ item.options.material }}</span>
                    <span v-if="item.options.tamano">Tam: {{ item.options.tamano }}</span>
                  </p>
                  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400" v-else-if="item.option">
                     Opción: {{ item.option }}
                  </p>
                  <div class="mt-1 text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Cantidad: {{ item.quantity || 1 }}
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div v-else class="text-sm text-gray-500 italic py-8 text-center bg-gray-50 dark:bg-gray-800/30 rounded-lg">
            No se recabó información individual de productos para este pedido.
          </div>

          <div class="border-t border-gray-200 dark:border-gray-700 pt-6 mt-auto">
            <div class="flex items-center justify-between text-base font-medium text-gray-900 dark:text-white mb-2">
              <p>Subtotal</p>
              <p>{{ formatCurrency(pedido.total) }}</p>
            </div>
            <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
              <p>Envío</p>
              <p>Calculado / Por definir</p>
            </div>
            <div class="flex items-center justify-between text-xl font-bold text-emerald-600 dark:text-emerald-400 border-t border-gray-100 dark:border-gray-800 pt-4">
              <p>Total pagado</p>
              <p>{{ formatCurrency(pedido.total) }}</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeftIcon } from 'lucide-vue-next'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { API_BASE } from '@/config.js'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const API = `${API_BASE}/api/pedidos/${id}`
const authHeaders = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` })

const pedido = ref(null)
const loading = ref(true)
const error = ref('')
const newStatus = ref('')
const newNotas = ref('')
const updating = ref(false)
const updatingNotas = ref(false)

const productosParseados = computed(() => {
  if (!pedido.value || !pedido.value.productos) return []
  try {
    // Si viene como string, parsear
    if (typeof pedido.value.productos === 'string') {
      return JSON.parse(pedido.value.productos)
    }
    // Si ya es un array/object
    return pedido.value.productos
  } catch (e) {
    console.error("Error parseando productos JSON referenciado:", e)
    return []
  }
})

const fetchPedido = async () => {
  try {
    const res = await fetch(API, { headers: authHeaders() })
    if (!res.ok) {
      if (res.status === 404) error.value = 'Pedido no encontrado'
      else error.value = 'Error de servidor'
      return
    }
    const data = await res.json()
    pedido.value = data
    newStatus.value = data.estado
    newNotas.value = data.notas || ''
  } catch (e) {
    error.value = 'Error de red'
  } finally {
    loading.value = false
  }
}

const updateNotas = async () => {
  updatingNotas.value = true
  try {
    const res = await fetch(`${API}/notas`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ notas: newNotas.value })
    })
    if (res.ok) {
      pedido.value.notas = newNotas.value
    } else {
      alert('Error al guardar notas')
    }
  } catch (e) {
    alert('Error de red al guardar notas')
  } finally {
    updatingNotas.value = false
  }
}

const updateStatus = async () => {
  if (!newStatus.value) return
  updating.value = true
  try {
    const res = await fetch(`${API}/estado`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ estado: newStatus.value })
    })
    if (res.ok) {
      pedido.value.estado = newStatus.value
    } else {
      alert('Error al actualizar estado')
    }
  } catch (e) {
    alert('Error de red al actualizar estado')
  } finally {
    updating.value = false
  }
}

onMounted(() => {
  fetchPedido()
})

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-MX', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

const formatCurrency = (amount) => {
  const num = Number(amount)
  if (isNaN(num)) return '$0.00'
  return new Intl.NumberFormat('es-MX', { 
    style: 'currency', currency: 'MXN', minimumFractionDigits: 2
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

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.4);
  border-radius: 20px;
}
</style>
