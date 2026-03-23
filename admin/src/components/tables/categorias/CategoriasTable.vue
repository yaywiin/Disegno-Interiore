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
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Alta</p>
            </th>
            <th class="px-5 py-3 text-center sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Acciones</p>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="categoria in categorias"
            :key="categoria.id"
            class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.05]"
          >
            <td class="px-5 py-4 sm:px-6">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ categoria.id }}</p>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <p class="font-medium text-gray-800 text-theme-sm dark:text-white/90">{{ categoria.nombre }}</p>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                {{ formatDate(categoria.fecha_de_alta) }}
              </p>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <div class="flex items-center justify-center gap-3">
                <button
                  class="text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-500 transition-colors"
                  title="Ver"
                  @click="$emit('view', categoria)"
                >
                  <Eye class="w-5 h-5" />
                </button>
                <button
                  class="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-500 transition-colors"
                  title="Editar"
                  @click="$emit('edit', categoria)"
                >
                  <Pencil class="w-5 h-5" />
                </button>
                <button
                  class="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500 transition-colors"
                  title="Borrar"
                  @click="$emit('delete', categoria)"
                >
                  <Trash2 class="w-5 h-5" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="categorias.length === 0">
            <td colspan="4" class="px-5 py-8 text-center sm:px-6">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">No hay categorías registradas</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { Eye, Pencil, Trash2 } from 'lucide-vue-next'

defineProps({
  categorias: {
    type: Array,
    required: true,
    default: () => []
  }
})

defineEmits(['view', 'edit', 'delete'])

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}
</script>
