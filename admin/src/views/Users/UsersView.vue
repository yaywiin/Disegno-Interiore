<template>
  <AdminLayout>
    <div class="space-y-5 sm:space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 class="text-xl font-bold text-gray-800 dark:text-white/90">Administrador de Usuarios</h2>
        <button
          @click="openAddModal"
          class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
        >
          <Plus class="w-4 h-4" />
          Añadir Nuevo
        </button>
      </div>
      
      <!-- Error global -->
      <div v-if="error && !isModalOpen" class="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400">
        ⚠️ {{ error }}
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="p-0 sm:p-0">
          <!-- Cargando -->
          <div v-if="loading" class="flex items-center justify-center py-12">
            <svg class="animate-spin h-6 w-6 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <span class="ml-2 text-sm text-gray-500">Cargando usuarios...</span>
          </div>
          <UsersTable 
            v-else
            :users="users" 
            @view="openViewModal"
            @edit="openEditModal"
            @delete="deleteUser"
          />
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <Modal v-if="isModalOpen" :fullScreenBackdrop="true" @close="closeModal">
      <template #body>
        <div class="relative w-full max-w-md bg-white rounded-xl shadow-lg dark:bg-gray-800 p-6 z-[100000]">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4">
            {{ modalMode === 'add' ? 'Añadir Usuario' : (modalMode === 'edit' ? 'Editar Usuario' : 'Detalles de Usuario') }}
          </h3>
          
          <form @submit.prevent="saveUser">
            <div class="space-y-4">
              <!-- Nombre -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                <input 
                  type="text" 
                  v-model="form.nombre" 
                  :disabled="modalMode === 'view'"
                  required
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  placeholder="Juan Perez"
                />
              </div>

              <!-- Usuario -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Usuario</label>
                <input 
                  type="text" 
                  v-model="form.usuario" 
                  :disabled="modalMode === 'view'"
                  required
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  placeholder="juanp"
                />
              </div>

              <!-- Correo -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo</label>
                <input 
                  type="email" 
                  v-model="form.correo" 
                  :disabled="modalMode === 'view'"
                  required
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  placeholder="juan@ejemplo.com"
                />
              </div>

              <!-- Contraseña -->
              <div v-if="modalMode !== 'view'">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
                <div class="relative">
                  <input 
                    :type="showPassword ? 'text' : 'password'" 
                    v-model="form.contrasena" 
                    :required="modalMode === 'add'"
                    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    placeholder="Escribe la contraseña"
                  />
                  <button
                    v-if="modalMode === 'edit'"
                    type="button"
                    @mousedown="showPassword = true"
                    @mouseup="showPassword = false"
                    @mouseleave="showPassword = false"
                    @touchstart="showPassword = true"
                    @touchend="showPassword = false"
                    class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    title="Mantén presionado para ver la contraseña"
                  >
                    <Eye v-if="!showPassword" class="w-5 h-5" />
                    <EyeOff v-else class="w-5 h-5" />
                  </button>
                </div>
              </div>

              <!-- Rol -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rol</label>
                <select 
                  v-if="modalMode !== 'view'"
                  v-model="form.rol" 
                  required
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option value="Administrador">Administrador</option>
                  <option value="Asistente">Asistente</option>
                </select>
                <input 
                  v-else
                  type="text" 
                  :value="form.rol" 
                  disabled
                  class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>
              
              <!-- Fecha de Alta (Solo vista) -->
              <div v-if="modalMode === 'view'">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de Alta</label>
                <input 
                  type="text" 
                  :value="form.fechaAlta" 
                  disabled
                  class="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                />
              </div>
            </div>

            <!-- Error en modal -->
            <div v-if="error" class="mt-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400">
              ⚠️ {{ error }}
            </div>

            <div class="mt-6 flex justify-end gap-3">
              <button
                type="button"
                @click="closeModal"
                class="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition"
              >
                {{ modalMode === 'view' ? 'Cerrar' : 'Cancelar' }}
              </button>
              <button
                v-if="modalMode !== 'view'"
                type="submit"
                class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </template>
    </Modal>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Plus, Eye, EyeOff } from "lucide-vue-next";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import UsersTable from "@/components/tables/users/UsersTable.vue";
import Modal from "@/components/ui/Modal.vue";

const API_URL = 'http://localhost:3001/api/users'

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
})

const users = ref([]);
const loading = ref(false);
const error = ref('');

const isModalOpen = ref(false);
const modalMode = ref('add');
const showPassword = ref(true);
const form = ref({
  id: '',
  nombre: '',
  usuario: '',
  correo: '',
  contrasena: '',
  rol: 'Asistente',
  fechaAlta: ''
});

// ── Cargar usuarios desde la API ──────────────────────────────────────────────
const fetchUsers = async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await fetch(API_URL, { headers: authHeaders() });
    if (!res.ok) throw new Error('Error al obtener usuarios');
    const data = await res.json();
    users.value = data.map(u => ({
      ...u,
      fechaAlta: u.fecha_alta ? new Date(u.fecha_alta).toLocaleDateString('es-MX') : ''
    }));
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchUsers);

// ── Modales ───────────────────────────────────────────────────────────────────
const openAddModal = () => {
  modalMode.value = 'add';
  form.value = { id: '', nombre: '', usuario: '', correo: '', contrasena: '', rol: 'Asistente', fechaAlta: '' };
  showPassword.value = true;
  isModalOpen.value = true;
};

const openEditModal = (user) => {
  modalMode.value = 'edit';
  form.value = { ...user, contrasena: '' };
  showPassword.value = false;
  isModalOpen.value = true;
};

const openViewModal = (user) => {
  modalMode.value = 'view';
  form.value = { ...user };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

// ── Guardar (crear o editar) ──────────────────────────────────────────────────
const saveUser = async () => {
  error.value = '';
  try {
    const payload = {
      nombre: form.value.nombre,
      usuario: form.value.usuario,
      correo: form.value.correo,
      rol: form.value.rol,
      ...(form.value.contrasena ? { contrasena: form.value.contrasena } : {})
    };

    let res;
    if (modalMode.value === 'add') {
      if (!form.value.contrasena) { error.value = 'La contraseña es requerida'; return; }
      res = await fetch(API_URL, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload)
      });
    } else {
      res = await fetch(`${API_URL}/${form.value.id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(payload)
      });
    }

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Error al guardar usuario');
    }

    await fetchUsers();
    closeModal();
  } catch (err) {
    error.value = err.message;
  }
};

// ── Eliminar ──────────────────────────────────────────────────────────────────
const deleteUser = async (userToDelete) => {
  if (!confirm(`¿Estás seguro de que deseas borrar a ${userToDelete.nombre}?`)) return;
  try {
    const res = await fetch(`${API_URL}/${userToDelete.id}`, { method: 'DELETE', headers: authHeaders() });
    if (!res.ok) throw new Error('Error al eliminar usuario');
    await fetchUsers();
  } catch (err) {
    error.value = err.message;
  }
};
</script>
