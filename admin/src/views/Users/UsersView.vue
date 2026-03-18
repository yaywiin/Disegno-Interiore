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
      
      <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="p-0 sm:p-0">
          <UsersTable 
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
import { ref } from "vue";
import { Plus, Eye, EyeOff } from "lucide-vue-next";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import UsersTable from "@/components/tables/users/UsersTable.vue";
import Modal from "@/components/ui/Modal.vue";

const users = ref([
  {
    id: "USR-001",
    nombre: "Elmer Mendoza",
    usuario: "elmermndz",
    correo: "elmer@example.com",
    rol: "Administrador",
    fechaAlta: new Date().toISOString().split('T')[0]
  }
]);

const isModalOpen = ref(false);
const modalMode = ref('add'); // 'add', 'edit', 'view'
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

const openAddModal = () => {
  modalMode.value = 'add';
  form.value = {
    id: '',
    nombre: '',
    usuario: '',
    correo: '',
    contrasena: '',
    rol: 'Asistente',
    fechaAlta: ''
  };
  showPassword.value = true;
  isModalOpen.value = true;
};

const openEditModal = (user) => {
  modalMode.value = 'edit';
  form.value = { ...user };
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

const deleteUser = (userToDelete) => {
  if (confirm(`¿Estás seguro de que deseas borrar a ${userToDelete.nombre}?`)) {
    users.value = users.value.filter(u => u.id !== userToDelete.id);
  }
};

const saveUser = () => {
  if (modalMode.value === 'add') {
    // Generar un id simple y la fecha de alta
    const newId = `USR-00${users.value.length + 1}`;
    users.value.push({
      ...form.value,
      id: newId,
      fechaAlta: new Date().toISOString().split('T')[0]
    });
  } else if (modalMode.value === 'edit') {
    const index = users.value.findIndex(u => u.id === form.value.id);
    if (index !== -1) {
      users.value[index] = { ...form.value };
    }
  }
  closeModal();
};

</script>
