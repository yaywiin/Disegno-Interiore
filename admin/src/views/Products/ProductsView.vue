<template>
  <AdminLayout>
    <div class="space-y-5 sm:space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 class="text-xl font-bold text-gray-800 dark:text-white/90">Productos</h2>
        <router-link
          to="/add-product"
          class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
        >
          <Plus class="w-4 h-4" />
          Añadir Nuevo
        </router-link>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="p-0 sm:p-0">
          <ProductsTable
            :products="products"
            :loading="loading"
            @view="openView"
            @edit="goToEdit"
            @delete="confirmDelete"
          />
        </div>
      </div>
    </div>

    <!-- ───── Modal Ver ───── -->
    <div
      v-if="showViewModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      @click.self="showViewModal = false"
    >
      <div class="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Detalle del Producto</h3>
        <dl class="space-y-3">
          <div><dt class="text-xs text-gray-500 dark:text-gray-400">ID</dt><dd class="text-sm font-medium text-gray-800 dark:text-white/90">{{ selected?.id }}</dd></div>
          <div><dt class="text-xs text-gray-500 dark:text-gray-400">Nombre</dt><dd class="text-sm font-medium text-gray-800 dark:text-white/90">{{ selected?.nombre }}</dd></div>
          <div><dt class="text-xs text-gray-500 dark:text-gray-400">Precio</dt><dd class="text-sm font-medium text-gray-800 dark:text-white/90">${{ Number(selected?.precio).toFixed(2) }}</dd></div>
          <div><dt class="text-xs text-gray-500 dark:text-gray-400">Stock</dt><dd class="text-sm font-medium text-gray-800 dark:text-white/90">{{ selected?.stock }}</dd></div>
          <div><dt class="text-xs text-gray-500 dark:text-gray-400">Descripción</dt><dd class="text-sm text-gray-600 dark:text-gray-300">{{ selected?.descripcion || '—' }}</dd></div>
        </dl>
        <div class="flex justify-end mt-6">
          <button @click="showViewModal = false" class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors">Cerrar</button>
        </div>
      </div>
    </div>

    <!-- ───── Modal Confirmar Borrar ───── -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      @click.self="showDeleteModal = false"
    >
      <div class="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">Eliminar Producto</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
          ¿Estás seguro de eliminar
          <span class="font-semibold text-gray-800 dark:text-white/90">"{{ selected?.nombre }}"</span>?
          Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end gap-3">
          <button @click="showDeleteModal = false" class="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors">Cancelar</button>
          <button @click="deleteProduct" :disabled="deleting" class="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors disabled:opacity-50">
            {{ deleting ? 'Eliminando…' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus } from 'lucide-vue-next'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import ProductsTable from '@/components/tables/products/ProductsTable.vue'

const API = 'http://localhost:3001/api/productos'
const router = useRouter()

const products = ref([])
const loading  = ref(true)
const selected = ref(null)
const deleting = ref(false)

const showViewModal   = ref(false)
const showDeleteModal = ref(false)

const fetchProducts = async () => {
  loading.value = true
  try {
    const res = await fetch(API)
    products.value = await res.json()
  } catch (e) {
    console.error('Error al cargar productos:', e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)

const openView = (product) => {
  selected.value = product
  showViewModal.value = true
}

const goToEdit = (product) => {
  router.push(`/edit-product/${product.id}`)
}

const confirmDelete = (product) => {
  selected.value = product
  showDeleteModal.value = true
}

const deleteProduct = async () => {
  deleting.value = true
  try {
    const res = await fetch(`${API}/${selected.value.id}`, { method: 'DELETE' })
    if (res.ok) {
      products.value = products.value.filter(p => p.id !== selected.value.id)
      showDeleteModal.value = false
    }
  } catch (e) {
    console.error('Error al eliminar producto:', e)
  } finally {
    deleting.value = false
  }
}
</script>
