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
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Categorías</p>
            </th>
            <th class="px-5 py-3 text-left sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Fecha de Alta</p>
            </th>
            <th class="px-5 py-3 text-center sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Acciones</p>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="product in products"
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
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">${{ product.precio.toFixed(2) }}</p>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="cat in product.categorias"
                  :key="cat"
                  class="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-400"
                >
                  {{ cat }}
                </span>
              </div>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ product.fechaAlta }}</p>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <div class="flex items-center justify-center gap-3">
                <button
                  class="text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-500 transition-colors"
                  title="Ver"
                >
                  <Eye class="w-5 h-5" />
                </button>
                <button
                  class="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-500 transition-colors"
                  title="Editar"
                >
                  <Pencil class="w-5 h-5" />
                </button>
                <button
                  class="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500 transition-colors"
                  title="Borrar"
                >
                  <Trash2 class="w-5 h-5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Eye, Pencil, Trash2 } from 'lucide-vue-next'

const products = ref([
  {
    id: 'PRD-001',
    nombre: 'Silla Ergonómica Pro',
    precio: 250.0,
    categorias: ['Muebles', 'Oficina'],
    fechaAlta: '2025-10-15',
  },
  {
    id: 'PRD-002',
    nombre: 'Escritorio Elevable Automático',
    precio: 450.0,
    categorias: ['Muebles', 'Oficina', 'Premium'],
    fechaAlta: '2025-10-12',
  },
  {
    id: 'PRD-003',
    nombre: 'Monitor 4K 27"',
    precio: 320.5,
    categorias: ['Tecnología', 'Monitores'],
    fechaAlta: '2025-10-10',
  },
  {
    id: 'PRD-004',
    nombre: 'Teclado Mecánico Inalámbrico',
    precio: 120.0,
    categorias: ['Tecnología', 'Accesorios'],
    fechaAlta: '2025-10-09',
  },
  {
    id: 'PRD-005',
    nombre: 'Mouse Vertical Óptico',
    precio: 45.99,
    categorias: ['Tecnología', 'Accesorios'],
    fechaAlta: '2025-10-08',
  },
  {
    id: 'PRD-006',
    nombre: 'Lámpara LED de Escritorio',
    precio: 35.0,
    categorias: ['Iluminación', 'Oficina'],
    fechaAlta: '2025-10-05',
  },
  {
    id: 'PRD-007',
    nombre: 'Archivador Metálico 3 Cajones',
    precio: 150.0,
    categorias: ['Almacenamiento', 'Oficina'],
    fechaAlta: '2025-10-02',
  },
  {
    id: 'PRD-008',
    nombre: 'Soporte Dual para Monitores',
    precio: 65.0,
    categorias: ['Accesorios', 'Ergonomía'],
    fechaAlta: '2025-09-30',
  },
  {
    id: 'PRD-009',
    nombre: 'Audífonos con Cancelación de Ruido',
    precio: 199.99,
    categorias: ['Audio', 'Tecnología'],
    fechaAlta: '2025-09-28',
  },
  {
    id: 'PRD-010',
    nombre: 'Silla de Oficina Básica',
    precio: 85.0,
    categorias: ['Muebles', 'Oficina'],
    fechaAlta: '2025-09-25',
  },
])
</script>

<style scoped>
/* Add any additional styles here if needed */
</style>
