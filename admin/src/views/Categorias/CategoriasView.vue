<template>
  <AdminLayout>
    <div class="space-y-5 sm:space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 class="text-xl font-bold text-gray-800 dark:text-white/90">Categorías</h2>
        <button
          @click="openAdd"
          class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
        >
          <Plus class="w-4 h-4" />
          Agregar Nuevo
        </button>
      </div>

      <!-- Table -->
      <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="p-0 sm:p-0">
          <CategoriasTable
            :categorias="categorias"
            @view="openView"
            @edit="openEdit"
            @delete="confirmDelete"
          />
        </div>
      </div>
    </div>

    <!-- ───── Modal Agregar / Editar ───── -->
    <div
      v-if="showFormModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      @click.self="closeModal"
    >
      <div class="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
          {{ isEditing ? 'Editar Categoría' : 'Agregar Categoría' }}
        </h3>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre
          </label>
          <input
            v-model="form.nombre"
            type="text"
            placeholder="Ej: Muebles, Iluminación…"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-brand-500"
            @keyup.enter="submitForm"
          />
          <p v-if="formError" class="mt-1 text-xs text-red-500">{{ formError }}</p>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="closeModal"
            class="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="submitForm"
            :disabled="submitting"
            class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors disabled:opacity-50"
          >
            {{ submitting ? 'Guardando…' : (isEditing ? 'Guardar cambios' : 'Agregar') }}
          </button>
        </div>
      </div>
    </div>

    <!-- ───── Modal Ver ───── -->
    <div
      v-if="showViewModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      @click.self="closeModal"
    >
      <div class="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">Detalle de Categoría</h3>
        <dl class="space-y-3">
          <div>
            <dt class="text-xs text-gray-500 dark:text-gray-400">ID</dt>
            <dd class="text-sm font-medium text-gray-800 dark:text-white/90">{{ selected?.id }}</dd>
          </div>
          <div>
            <dt class="text-xs text-gray-500 dark:text-gray-400">Nombre</dt>
            <dd class="text-sm font-medium text-gray-800 dark:text-white/90">{{ selected?.nombre }}</dd>
          </div>
          <div>
            <dt class="text-xs text-gray-500 dark:text-gray-400">Alta</dt>
            <dd class="text-sm font-medium text-gray-800 dark:text-white/90">{{ formatDate(selected?.fecha_de_alta) }}</dd>
          </div>
        </dl>
        <div class="flex justify-end mt-6">
          <button
            @click="closeModal"
            class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- ───── Modal Confirmar Borrar ───── -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      @click.self="closeModal"
    >
      <div class="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">Eliminar Categoría</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
          ¿Estás seguro de eliminar la categoría
          <span class="font-semibold text-gray-800 dark:text-white/90">"{{ selected?.nombre }}"</span>?
          Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="closeModal"
            class="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors"
          >
            Cancelar
          </button>
          <button
            @click="deleteCategoria"
            :disabled="submitting"
            class="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {{ submitting ? 'Eliminando…' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus } from 'lucide-vue-next'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import CategoriasTable from '@/components/tables/categorias/CategoriasTable.vue'

const API = 'http://localhost:3001/api/categorias'

const categorias  = ref([])
const selected    = ref(null)
const submitting  = ref(false)
const formError   = ref('')

const showFormModal   = ref(false)
const showViewModal   = ref(false)
const showDeleteModal = ref(false)
const isEditing       = ref(false)

const form = ref({ nombre: '' })

// ── Fetch ──
const fetchCategorias = async () => {
  try {
    const res = await fetch(API)
    categorias.value = await res.json()
  } catch (e) {
    console.error('Error al cargar categorías:', e)
  }
}

onMounted(fetchCategorias)

// ── Open modals ──
const openAdd = () => {
  isEditing.value = false
  form.value = { nombre: '' }
  formError.value = ''
  showFormModal.value = true
}

const openEdit = (cat) => {
  isEditing.value = true
  selected.value = cat
  form.value = { nombre: cat.nombre }
  formError.value = ''
  showFormModal.value = true
}

const openView = (cat) => {
  selected.value = cat
  showViewModal.value = true
}

const confirmDelete = (cat) => {
  selected.value = cat
  showDeleteModal.value = true
}

const closeModal = () => {
  showFormModal.value = false
  showViewModal.value = false
  showDeleteModal.value = false
  submitting.value = false
  formError.value = ''
}

// ── Submit (add / edit) ──
const submitForm = async () => {
  if (!form.value.nombre.trim()) {
    formError.value = 'El nombre es requerido'
    return
  }
  formError.value = ''
  submitting.value = true

  try {
    const url    = isEditing.value ? `${API}/${selected.value.id}` : API
    const method = isEditing.value ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: form.value.nombre.trim() })
    })

    const data = await res.json()

    if (!res.ok) {
      formError.value = data.error || 'Error al guardar'
      return
    }

    if (isEditing.value) {
      const idx = categorias.value.findIndex(c => c.id === selected.value.id)
      if (idx !== -1) categorias.value[idx] = data
    } else {
      categorias.value.push(data)
    }

    closeModal()
  } catch (e) {
    formError.value = 'Error de conexión con el servidor'
  } finally {
    submitting.value = false
  }
}

// ── Delete ──
const deleteCategoria = async () => {
  submitting.value = true
  try {
    const res = await fetch(`${API}/${selected.value.id}`, { method: 'DELETE' })
    if (res.ok) {
      categorias.value = categorias.value.filter(c => c.id !== selected.value.id)
      closeModal()
    }
  } catch (e) {
    console.error('Error al eliminar categoría:', e)
  } finally {
    submitting.value = false
  }
}

// ── Helpers ──
const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-MX', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}
</script>
