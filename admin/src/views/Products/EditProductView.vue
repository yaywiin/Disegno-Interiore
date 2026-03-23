<template>
  <AdminLayout>
    <div class="space-y-5 sm:space-y-6">

      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <router-link
            to="/products"
            class="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-brand-500 hover:border-brand-500 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
          >
            <ArrowLeft class="w-5 h-5" />
          </router-link>
          <div>
            <h2 class="text-xl font-bold text-gray-800 dark:text-white/90">Editar Producto</h2>
            <p v-if="form.nombre" class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{{ form.nombre }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <router-link
            to="/products"
            class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            Cancelar
          </router-link>
          <button
            type="button"
            @click="handleSubmit"
            :disabled="submitting || loadingProduct"
            class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors disabled:opacity-50"
          >
            {{ submitting ? 'Guardando…' : 'Guardar Cambios' }}
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loadingProduct" class="flex items-center justify-center py-20">
        <p class="text-gray-400">Cargando producto…</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="grid grid-cols-1 xl:grid-cols-12 gap-6">

        <!-- ── Left Column ── -->
        <div class="xl:col-span-9 space-y-6">

          <!-- Información General -->
          <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 class="text-base font-semibold text-gray-800 dark:text-white/90 mb-5">Información General</h3>
            <div class="space-y-6">

              <!-- Nombre -->
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre <span class="text-error-500">*</span></label>
                <input type="text" v-model="form.nombre" required placeholder="Ej. Silla Ergonómica"
                  class="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-3 text-gray-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90" />
              </div>

              <!-- Descripción -->
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                <textarea v-model="form.descripcion" rows="4" placeholder="Descripción del producto…"
                  class="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-3 text-gray-800 outline-none resize-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90"></textarea>
              </div>

              <!-- Categoría | Precio | Descuento -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Categoría</label>
                  <div class="relative">
                    <select v-model="form.categoria"
                      class="w-full appearance-none rounded-lg border border-gray-200 bg-transparent px-4 py-3 pr-10 text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90">
                      <option value="">Sin categoría</option>
                      <option v-for="cat in categoriasOpts" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
                    </select>
                    <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><ChevronDown class="w-4 h-4" /></span>
                  </div>
                </div>
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Precio <span class="text-error-500">*</span></label>
                  <div class="relative">
                    <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                    <input type="number" step="0.01" min="0" v-model="form.precio" required placeholder="0.00" @blur="formatPrecio"
                      class="w-full rounded-lg border border-gray-200 bg-transparent pl-8 pr-4 py-3 text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90" />
                  </div>
                </div>
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Descuento</label>
                  <div class="relative">
                    <input type="number" step="0.01" min="0" max="100" v-model="form.descuento" placeholder="0"
                      class="w-full rounded-lg border border-gray-200 bg-transparent pl-4 pr-10 py-3 text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90" />
                    <span class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">%</span>
                  </div>
                  <p v-if="form.descuento > 0" class="mt-1 text-xs text-green-600 dark:text-green-400">
                    Precio final: ${{ precioConDescuento }}
                  </p>
                </div>
              </div>

              <!-- Productos Relacionados -->
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Productos Relacionados</label>
                <div class="relative" ref="relDropdownRef">
                  <div class="flex flex-wrap gap-1.5 min-h-[46px] w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 dark:border-gray-700"
                    @click="relInputRef?.focus()">
                    <span v-for="rel in productosRelacionadosSelected" :key="rel.id"
                      class="inline-flex items-center gap-1 rounded-md bg-brand-50 pl-2 pr-1 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-400">
                      {{ rel.nombre }}
                      <button type="button" @click.stop="removeRelacionado(rel.id)"><X class="w-3 h-3" /></button>
                    </span>
                    <input ref="relInputRef" v-model="relSearch" @focus="relOpen = true" @input="relOpen = true"
                      @keydown.escape="relOpen = false" @keydown.enter.prevent="selectFirstRelacionado"
                      type="text" placeholder="Buscar producto…"
                      class="flex-1 min-w-[120px] bg-transparent outline-none text-sm py-0.5 placeholder-gray-400 dark:text-white/90" />
                  </div>
                  <ul v-if="relOpen && relFiltered.length > 0"
                    class="absolute z-50 mt-1 w-full max-h-52 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                    <li v-for="p in relFiltered" :key="p.id" @mousedown.prevent="addRelacionado(p)"
                      class="flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-500/10 text-gray-700 dark:text-gray-200">
                      <span>{{ p.nombre }}</span><span class="text-xs text-gray-400">#{{ p.id }}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Producto Variable switch -->
              <div class="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/30">
                <div>
                  <h4 class="text-sm font-medium text-gray-800 dark:text-gray-200">Producto Variable</h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Activar si tiene colores, tallas o versiones.</p>
                </div>
                <label class="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" v-model="form.isVariable" class="peer sr-only">
                  <div class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-gray-700"></div>
                </label>
              </div>

            </div>
          </div>

        </div><!-- end xl:col-span-9 -->

        <!-- ── Right Column ── -->
        <div class="xl:col-span-3 space-y-6">

          <!-- Dimensiones -->
          <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 class="text-base font-semibold text-gray-800 dark:text-white/90 mb-5">Dimensiones</h3>
            <div class="space-y-4">
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Ancho (cm)</label>
                <input type="number" step="0.01" min="0" v-model="form.ancho" placeholder="0"
                  class="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90" />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Alto (cm)</label>
                <input type="number" step="0.01" min="0" v-model="form.alto" placeholder="0"
                  class="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90" />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Profundidad (cm)</label>
                <input type="number" step="0.01" min="0" v-model="form.profundidad" placeholder="0"
                  class="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90" />
              </div>
            </div>
          </div>

          <!-- Inventario -->
          <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 class="text-base font-semibold text-gray-800 dark:text-white/90 mb-5">Inventario</h3>
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Stock actual</label>
              <input type="number" min="0" v-model="form.stock" placeholder="0"
                class="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-3 text-gray-800 outline-none focus:border-brand-500 dark:border-gray-700 dark:text-white/90" />
            </div>
          </div>

          <!-- Metadata -->
          <div v-if="form.created_at" class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 class="text-base font-semibold text-gray-800 dark:text-white/90 mb-3">Información</h3>
            <dl class="space-y-2 text-sm">
              <div class="flex justify-between"><dt class="text-gray-500">Creado</dt><dd class="text-gray-700 dark:text-gray-200">{{ formatDate(form.created_at) }}</dd></div>
              <div v-if="form.updated_at" class="flex justify-between"><dt class="text-gray-500">Actualizado</dt><dd class="text-gray-700 dark:text-gray-200">{{ formatDate(form.updated_at) }}</dd></div>
            </dl>
          </div>

        </div>

      </form>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, ChevronDown, X } from 'lucide-vue-next'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const API = 'http://localhost:3001/api'
const router = useRouter()
const route  = useRoute()
const id     = route.params.id

// ── State ──────────────────────────────────────
const loadingProduct = ref(true)
const submitting      = ref(false)

const form = ref({
  nombre: '', descripcion: '', categoria: '',
  precio: '', descuento: '', stock: '',
  ancho: '', alto: '', profundidad: '',
  isVariable: false,
  created_at: null, updated_at: null,
})

// ── Load product ────────────────────────────────
onMounted(async () => {
  try {
    const res  = await fetch(`${API}/productos/${id}`)
    const data = await res.json()
    if (!res.ok) { router.push('/products'); return }

    // Map DB columns → form
    form.value = {
      nombre:       data.nombre        || '',
      descripcion:  data.descripcion   || '',
      precio:       data.precio        || '',
      descuento:    data.descuento     || '',
      stock:        data.stock         ?? '',
      ancho:        data.ancho         || '',
      alto:         data.alto          || '',
      profundidad:  data.profundidad   || '',
      isVariable:   data.es_variable   || false,
      created_at:   data.created_at    || null,
      updated_at:   data.updated_at    || null,
      categoria:    '',  // resolved below
    }

    // Resolve categoria: match the first category name against categoriasOpts
    await loadCategorias()
    if (data.categorias && data.categorias.length > 0) {
      const match = categoriasOpts.value.find(
        c => c.nombre.toLowerCase() === data.categorias[0].toLowerCase()
      )
      if (match) form.value.categoria = match.id
    }

    // Pre-load related products
    await loadTodos()
    if (data.productos_relacionados && data.productos_relacionados.length > 0) {
      productosRelacionadosSelected.value = todosLosProductos.value
        .filter(p => data.productos_relacionados.includes(p.id))
        .map(p => ({ id: p.id, nombre: p.nombre }))
    }

  } catch (e) {
    console.error('Error al cargar producto:', e)
    router.push('/products')
  } finally {
    loadingProduct.value = false
  }
})

// ── Categorías ──────────────────────────────────
const categoriasOpts = ref([])
async function loadCategorias() {
  try {
    const res = await fetch(`${API}/categorias`)
    categoriasOpts.value = await res.json()
  } catch {}
}

// ── Productos relacionados ──────────────────────
const todosLosProductos           = ref([])
const productosRelacionadosSelected = ref([])
const relSearch   = ref('')
const relOpen     = ref(false)
const relInputRef    = ref(null)
const relDropdownRef = ref(null)

async function loadTodos() {
  try {
    const res = await fetch(`${API}/productos`)
    todosLosProductos.value = (await res.json()).filter(p => String(p.id) !== String(id))
  } catch {}
}

onMounted(() => {
  document.addEventListener('click', e => {
    if (relDropdownRef.value && !relDropdownRef.value.contains(e.target)) relOpen.value = false
  })
})

const relFiltered = computed(() => {
  const q = relSearch.value.trim().toLowerCase()
  const selectedIds = productosRelacionadosSelected.value.map(p => p.id)
  return todosLosProductos.value
    .filter(p => !selectedIds.includes(p.id))
    .filter(p => !q || p.nombre.toLowerCase().includes(q))
    .slice(0, 8)
})

function addRelacionado(p) {
  productosRelacionadosSelected.value.push({ id: p.id, nombre: p.nombre })
  relSearch.value = ''; relOpen.value = false
}
function removeRelacionado(id) {
  productosRelacionadosSelected.value = productosRelacionadosSelected.value.filter(p => p.id !== id)
}
function selectFirstRelacionado() {
  if (relFiltered.value.length > 0) addRelacionado(relFiltered.value[0])
}

// ── Helpers ─────────────────────────────────────
function formatPrecio() {
  const v = parseFloat(form.value.precio)
  if (!isNaN(v)) form.value.precio = v.toFixed(2)
}

const precioConDescuento = computed(() => {
  const p  = parseFloat(form.value.precio)   || 0
  const d  = parseFloat(form.value.descuento) || 0
  return (p - p * d / 100).toFixed(2)
})

function formatDate(str) {
  if (!str) return '—'
  const d = new Date(str)
  return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`
}

// ── Submit ──────────────────────────────────────
async function handleSubmit() {
  if (!form.value.nombre || !form.value.precio) {
    alert('Nombre y precio son requeridos')
    return
  }
  submitting.value = true
  try {
    const catSeleccionada = categoriasOpts.value.find(c => c.id === form.value.categoria)
    const categoriasArr   = catSeleccionada ? [catSeleccionada.nombre] : []

    const payload = {
      nombre:       form.value.nombre.trim(),
      precio:       parseFloat(form.value.precio)      || 0,
      descripcion:  form.value.descripcion             || '',
      descuento:    parseFloat(form.value.descuento)   || 0,
      stock:        parseInt(form.value.stock)         || 0,
      ancho:        parseFloat(form.value.ancho)       || 0,
      alto:         parseFloat(form.value.alto)        || 0,
      profundidad:  parseFloat(form.value.profundidad) || 0,
      categorias:   categoriasArr,
      es_variable:  form.value.isVariable,
      productos_relacionados: productosRelacionadosSelected.value.map(p => p.id),
      // Unchanged array fields — pass back what we got
      colores: [], tamanios: [], materiales: [],
      imagen_principal: '', galeria: [],
    }

    const res  = await fetch(`${API}/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) { alert(data.error || 'Error al guardar'); return }
    router.push('/products')
  } catch {
    alert('Error de conexión con el servidor')
  } finally {
    submitting.value = false
  }
}
</script>
