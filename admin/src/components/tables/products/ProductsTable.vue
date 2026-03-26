<template>
  <div
    class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
  >
    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <table class="min-w-full">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th class="px-5 py-3 text-left sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">ID</p>
            </th>
            <th class="px-5 py-3 text-left sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Nombre</p>
            </th>
            <th class="px-5 py-3 text-left sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Precio</p>
            </th>
            <th class="px-5 py-3 text-left sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Descuento</p>
            </th>
            <th class="px-5 py-3 text-left sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Categorías</p>
            </th>
            <th class="px-5 py-3 text-left sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Alta</p>
            </th>
            <th class="px-5 py-3 text-center sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Acciones</p>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-if="loading">
            <td colspan="7" class="px-5 py-8 text-center sm:px-6">
              <p class="text-gray-400 text-theme-sm">Cargando productos…</p>
            </td>
          </tr>
          <tr
            v-else
            v-for="product in paginatedProducts"
            :key="product.id"
            class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.05]"
          >
            <td class="px-5 py-4 sm:px-6">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ product.id }}</p>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <p class="font-medium text-gray-800 text-theme-sm dark:text-white/90">{{ product.nombre }}</p>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <div v-if="product.descuento > 0" class="flex flex-col">
                <span class="text-xs text-gray-400 line-through dark:text-gray-500">${{ Number(product.precio).toFixed(2) }}</span>
                <span class="font-medium text-success-600 dark:text-success-500">${{ (Number(product.precio) * (1 - Number(product.descuento)/100)).toFixed(2) }}</span>
              </div>
              <p v-else class="text-gray-500 text-theme-sm dark:text-gray-400">${{ Number(product.precio).toFixed(2) }}</p>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <span
                v-if="product.descuento > 0"
                class="inline-flex items-center rounded-full bg-error-50 px-2 py-0.5 text-xs font-medium text-error-700 dark:bg-error-500/10 dark:text-error-400"
              >
                -{{ Number(product.descuento) }}%
              </span>
              <span v-else class="text-gray-400 text-xs">—</span>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="cat in (product.categorias || [])"
                  :key="cat"
                  class="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-400"
                >
                  {{ cat }}
                </span>
                <span v-if="!product.categorias || product.categorias.length === 0" class="text-gray-400 text-xs">—</span>
              </div>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ formatDate(product.created_at) }}</p>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <div class="flex items-center justify-center gap-3">
                <button
                  class="text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-500 transition-colors"
                  title="Ver"
                  @click="$emit('view', product)"
                >
                  <Eye class="w-5 h-5" />
                </button>
                <button
                  class="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-500 transition-colors"
                  title="Editar"
                  @click="$emit('edit', product)"
                >
                  <Pencil class="w-5 h-5" />
                </button>
                <button
                  class="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500 transition-colors"
                  title="Borrar"
                  @click="$emit('delete', product)"
                >
                  <Trash2 class="w-5 h-5" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!loading && products.length === 0">
            <td colspan="7" class="px-5 py-8 text-center sm:px-6">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">No hay productos registrados</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Paginación -->
    <div
      v-if="totalPages > 1"
      class="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 px-5 py-4 sm:px-6"
    >
      <span class="text-sm text-gray-500 dark:text-gray-400">
        Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }} a {{ Math.min(currentPage * itemsPerPage, products.length) }} de {{ products.length }}
      </span>
      <div class="flex gap-2">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.05] disabled:opacity-50 transition-colors"
        >
          Anterior
        </button>
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.05] disabled:opacity-50 transition-colors"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Eye, Pencil, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  products: {
    type: Array,
    required: true,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['view', 'edit', 'delete'])

const currentPage = ref(1)
const itemsPerPage = 10

const totalPages = computed(() => Math.ceil(props.products.length / itemsPerPage))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return props.products.slice(start, end)
})

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}
</script>
