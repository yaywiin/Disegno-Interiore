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
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Usuario</p>
            </th>
            <th class="px-5 py-3 text-left sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Correo</p>
            </th>
            <th class="px-5 py-3 text-left sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Rol</p>
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
            v-for="user in users"
            :key="user.id"
            class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.05]"
          >
            <td class="px-5 py-4 sm:px-6">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ user.id }}</p>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <p class="font-medium text-gray-800 text-theme-sm dark:text-white/90">{{ user.nombre }}</p>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ user.usuario }}</p>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ user.correo }}</p>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <span
                :class="[
                  'rounded-md px-2 py-0.5 text-xs font-medium',
                  user.rol === 'Administrador' 
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400'
                    : 'bg-gray-50 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400'
                ]"
              >
                {{ user.rol }}
              </span>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ user.fechaAlta }}</p>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <div class="flex items-center justify-center gap-3">
                <button
                  class="text-gray-500 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-500 transition-colors"
                  title="Ver"
                  @click="$emit('view', user)"
                >
                  <Eye class="w-5 h-5" />
                </button>
                <button
                  class="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-500 transition-colors"
                  title="Editar"
                  @click="$emit('edit', user)"
                >
                  <Pencil class="w-5 h-5" />
                </button>
                <button
                  class="text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-500 transition-colors"
                  title="Borrar"
                  @click="$emit('delete', user)"
                >
                  <Trash2 class="w-5 h-5" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="7" class="px-5 py-8 text-center sm:px-6">
              <p class="text-gray-500 text-theme-sm dark:text-gray-400">No hay usuarios registrados</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { Eye, Pencil, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  users: {
    type: Array,
    required: true,
    default: () => []
  }
})

defineEmits(['view', 'edit', 'delete'])
</script>

<style scoped>
/* Add any additional styles here if needed */
</style>
