<template>
  <AdminLayout>
    <div class="space-y-5 sm:space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <router-link
            to="/"
            class="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-brand-500 hover:border-brand-500 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-brand-500 dark:hover:border-brand-500"
          >
            <ArrowLeft class="w-5 h-5" />
          </router-link>
          <h2 class="text-xl font-bold text-gray-800 dark:text-white/90">Añadir Nuevo Producto</h2>
        </div>
        
        <!-- Top Actions -->
        <div class="flex items-center gap-3">
          <router-link
            to="/"
            class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700/50"
          >
            Cancelar
          </router-link>
          <button
            type="button"
            @click="handleSubmit"
            class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
          >
            Guardar Producto
          </button>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        <!-- Left Column: 80% (span 9 / 12) -->
        <div class="xl:col-span-9 space-y-6">
          
          <!-- Información General -->
          <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 class="text-base font-semibold text-gray-800 dark:text-white/90 mb-5">Información General</h3>
            
            <div class="space-y-6">
              <!-- Fila 1: Nombre -->
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre del Producto <span class="text-error-500">*</span></label>
                <input
                  type="text"
                  v-model="form.nombre"
                  required
                  pattern="[A-Za-z0-9\s\u00C0-\u024F\u1E00-\u1EFF]+"
                  placeholder="Ej. Silla Ergonómica"
                  class="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-3 text-gray-800 outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90"
                />
              </div>

              <!-- Fila 2: Descripción -->
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                <textarea
                  v-model="form.descripcion"
                  rows="5"
                  placeholder="Descripción detallada del producto..."
                  class="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-3 text-gray-800 outline-none transition-colors resize-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90"
                ></textarea>
              </div>

              <!-- Fila 3: Categoria & Precio -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <!-- Categoría -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Categoría <span class="text-error-500">*</span></label>
                  <div class="relative">
                    <select
                      v-model="form.categoria"
                      required
                      class="w-full appearance-none rounded-lg border border-gray-200 bg-transparent px-4 py-3 pr-10 text-gray-800 outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90"
                    >
                      <option value="muebles">Muebles</option>
                      <option value="iluminacion">Iluminación</option>
                      <option value="decoracion">Decoración</option>
                      <option value="textiles">Textiles</option>
                      <option value="accesorios">Accesorios</option>
                    </select>
                    <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <ChevronDown class="w-4 h-4" />
                    </span>
                  </div>
                </div>

                <!-- Precio -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Precio base <span class="text-error-500">*</span></label>
                  <div class="relative">
                    <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      v-model="form.precio"
                      required
                      placeholder="0.00"
                      @blur="formatPrecio"
                      class="w-full rounded-lg border border-gray-200 bg-transparent pl-8 pr-4 py-3 text-gray-800 outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90"
                    />
                  </div>
                </div>
              </div>

              <!-- Fila 4: Tipo de producto (Switch) -->
              <div class="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/30">
                <div>
                  <h4 class="text-sm font-medium text-gray-800 dark:text-gray-200">Producto Variable</h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Activa esta opción si el producto tiene diferentes tallas, colores o versiones.</p>
                </div>
                <label class="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" v-model="form.isVariable" class="peer sr-only">
                  <div class="peer h-6 w-11 rounded-full bg-gray-200 outline-none duration-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-gray-700 dark:border-gray-600 dark:peer-checked:bg-brand-500"></div>
                </label>
              </div>

            </div>
          </div>

          <!-- Variaciones (conditionally rendered) -->
          <div v-show="form.isVariable" class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <div class="flex items-center justify-between mb-5">
              <div>
                <h3 class="text-base font-semibold text-gray-800 dark:text-white/90">Variaciones</h3>
                <p class="text-xs text-gray-500 mt-1">Configura las opciones (ej. Color, Tamaño) para este producto.</p>
              </div>
              <button
                type="button"
                @click="addGroup"
                class="inline-flex items-center gap-1.5 rounded-lg border border-brand-500 px-3 py-1.5 text-sm font-medium text-brand-500 hover:bg-brand-50 transition-colors dark:hover:bg-brand-500/10"
              >
                <Plus class="w-4 h-4" />
                Añadir Grupo
              </button>
            </div>

            <div v-if="variationGroups.length === 0" class="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center dark:border-gray-700">
              <p class="text-sm text-gray-400">Aún no hay variaciones. Haz clic en el botón superior para empezar.</p>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="(group, gi) in variationGroups"
                :key="group.id"
                class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <!-- Group Header -->
                <div class="flex items-center gap-3 bg-gray-50 px-4 py-3 dark:bg-gray-800/60">
                  <input
                    v-if="group.editing"
                    v-model="group.name"
                    @keydown.enter.prevent="group.editing = false"
                    @blur="group.editing = false"
                    class="flex-1 rounded-md border border-brand-400 bg-white px-3 py-1.5 text-sm font-semibold text-gray-800 outline-none focus:ring-1 focus:ring-brand-500 dark:bg-gray-900 dark:text-white/90"
                    placeholder="Nombre del grupo (ej. Color, Talla)"
                    autofocus
                  />
                  <span
                    v-else
                    class="flex-1 text-sm font-semibold text-gray-700 dark:text-gray-200 cursor-pointer hover:text-brand-500"
                    @click="group.editing = true"
                  >
                    {{ group.name || 'Sin nombre (haz clic para editar)' }}
                  </span>
                  
                  <!-- Edit Icon -->
                  <button
                    type="button"
                    @click="group.editing = !group.editing"
                    class="p-1 text-gray-400 hover:text-brand-500 transition-colors"
                    :title="group.editing ? 'Confirmar' : 'Editar nombre'"
                  >
                    <Pencil v-if="!group.editing" class="w-4 h-4" />
                    <Check v-else class="w-4 h-4 text-brand-500" />
                  </button>
                  
                  <!-- Color Checkbox Toggle -->
                  <div class="flex items-center gap-1.5 ml-2 mr-2">
                    <input
                      type="checkbox"
                      :id="'color-toggle-' + gi"
                      v-model="group.hasColor"
                      class="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                    />
                    <label :for="'color-toggle-' + gi" class="text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer">Colores</label>
                  </div>
                  
                  <!-- Trash Icon -->
                  <button
                    type="button"
                    @click="removeGroup(gi)"
                    class="p-1 text-gray-400 hover:text-error-500 transition-colors"
                    title="Eliminar grupo"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>

                <!-- Variations List -->
                <div class="p-4 space-y-2">
                  <div
                    v-for="(variation, vi) in group.variations"
                    :key="variation.id"
                    class="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2 dark:border-gray-700/60 dark:bg-gray-900/30"
                  >
                    <!-- Color swatch + picker -->
                    <div v-if="group.hasColor" class="relative shrink-0">
                      <div
                        class="h-8 w-8 rounded-md border-2 border-white shadow cursor-pointer ring-1 ring-gray-200 dark:ring-gray-700"
                        :style="{ backgroundColor: variation.color }"
                        @click="openColorPicker(gi, vi)"
                        :title="variation.color"
                      />
                      <input
                        type="color"
                        v-model="variation.color"
                        class="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </div>

                    <!-- Name -->
                    <input
                      v-model="variation.name"
                      type="text"
                      class="flex-1 rounded-md border border-transparent bg-transparent px-2 py-1 text-sm text-gray-800 outline-none transition-colors focus:border-brand-400 focus:bg-white focus:ring-1 focus:ring-brand-500 dark:text-white/90 dark:focus:bg-gray-800"
                      placeholder="Nombre de la variación (ej. Rojo, XL)"
                    />

                    <!-- Hex label -->
                    <span v-if="group.hasColor" class="hidden sm:block shrink-0 font-mono text-xs text-gray-400 dark:text-gray-500 uppercase">{{ variation.color }}</span>

                    <!-- Remove -->
                    <button
                      type="button"
                      @click="removeVariation(gi, vi)"
                      class="shrink-0 p-1 text-gray-300 hover:text-error-500 transition-colors"
                      title="Eliminar variación"
                    >
                      <X class="w-4 h-4" />
                    </button>
                  </div>

                  <!-- Add variation -->
                  <button
                    type="button"
                    @click="addVariation(gi)"
                    class="mt-1 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-300 py-2 text-sm text-gray-500 hover:border-brand-400 hover:text-brand-500 transition-colors dark:border-gray-700 dark:hover:border-brand-500"
                  >
                    <Plus class="w-4 h-4" />
                    Añadir variación
                  </button>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        <!-- Right Column: 20% / Sidebar (span 3 / 12) -->
        <div class="xl:col-span-3 space-y-6">
          
          <!-- Inventario / Config extra -->
          <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 class="text-base font-semibold text-gray-800 dark:text-white/90 mb-5">Inventario</h3>
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Stock actual</label>
              <input
                type="number"
                min="0"
                v-model="form.stock"
                placeholder="0"
                class="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-3 text-gray-800 outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90"
              />
            </div>
          </div>

          <!-- Images Section -->
          <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 class="text-base font-semibold text-gray-800 dark:text-white/90 mb-5">Media</h3>
            <div class="space-y-6">
              <!-- Imagen Principal -->
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Principal</label>
                <div
                  class="relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-4 text-center transition-colors hover:border-brand-400 hover:bg-brand-50/30 cursor-pointer dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-brand-500"
                  @click="triggerMainImageInput"
                  @dragover.prevent
                  @drop.prevent="onDropMainImage"
                >
                  <input
                    ref="mainImageInput"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    class="hidden"
                    @change="onMainImageChange"
                  />
                  <template v-if="mainImagePreview">
                    <img :src="mainImagePreview" alt="Principal" class="w-full rounded-lg object-contain bg-white dark:bg-gray-900" style="max-height: 120px;" />
                    <button type="button" @click.stop="clearMainImage" class="mt-2 text-xs text-error-500 hover:underline">Quitar imagen</button>
                  </template>
                  <template v-else>
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                      <ImageIcon class="w-5 h-5 text-gray-400" />
                    </div>
                    <p class="text-xs text-gray-500 mt-1 dark:text-gray-400">Clic para subir</p>
                  </template>
                </div>
              </div>

              <!-- Galería -->
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Galería</label>
                <div
                  class="relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-4 text-center transition-colors hover:border-brand-400 hover:bg-brand-50/30 cursor-pointer dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-brand-500"
                  @click="triggerGalleryInput"
                  @dragover.prevent
                  @drop.prevent="onDropGallery"
                >
                  <input
                    ref="galleryInput"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    multiple
                    class="hidden"
                    @change="onGalleryChange"
                  />
                  <template v-if="galleryPreviews.length > 0">
                    <div class="flex flex-wrap gap-2 justify-center">
                      <div v-for="(src, i) in galleryPreviews" :key="i" class="relative">
                        <img :src="src" class="h-12 w-12 rounded-md object-cover ring-1 ring-gray-200 dark:ring-gray-700" />
                        <button
                          type="button"
                          @click.stop="removeGalleryImage(i)"
                          class="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-error-500 text-white text-[10px] leading-none"
                        >✕</button>
                      </div>
                    </div>
                    <button type="button" @click.stop="clearGallery" class="mt-3 text-xs text-error-500 hover:underline">Limpiar galería</button>
                  </template>
                  <template v-else>
                    <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                      <Images class="w-5 h-5 text-gray-400" />
                    </div>
                    <p class="text-xs text-gray-500 mt-1 dark:text-gray-400">Clic para añadir</p>
                  </template>
                </div>
              </div>
            </div>
          </div>

        </div>

      </form>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, ChevronDown, ImageIcon, Images, Plus, Pencil, Trash2, Check, X } from 'lucide-vue-next'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const router = useRouter()

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

/** Generate a random 8-digit numeric ID */
function generateId() {
  return String(Math.floor(10000000 + Math.random() * 90000000))
}

/** Return today's date as dd/mm/yyyy */
function todayFormatted() {
  const now = new Date()
  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const yyyy = now.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

// ──────────────────────────────────────────────
// Form state
// ──────────────────────────────────────────────

const form = ref({
  // Hidden from UI but sent to backend
  id: generateId(),
  fechaAlta: todayFormatted(),
  
  // UI Fields
  nombre: '',
  descripcion: '',
  categoria: 'muebles',
  precio: '',
  stock: '',
  isVariable: false, // Switch logic
})

function formatPrecio() {
  const val = parseFloat(form.value.precio)
  if (!isNaN(val)) {
    form.value.precio = val.toFixed(2)
  }
}

// ──────────────────────────────────────────────
// Image – main
// ──────────────────────────────────────────────

const mainImageInput = ref(null)
const mainImageFile = ref(null)
const mainImagePreview = ref(null)

function triggerMainImageInput() {
  mainImageInput.value?.click()
}

function onMainImageChange(event) {
  const file = event.target.files?.[0]
  if (file) setMainImage(file)
}

function onDropMainImage(event) {
  const file = event.dataTransfer.files?.[0]
  if (file) setMainImage(file)
}

function setMainImage(file) {
  mainImageFile.value = file
  mainImagePreview.value = URL.createObjectURL(file)
}

function clearMainImage() {
  mainImageFile.value = null
  mainImagePreview.value = null
  if (mainImageInput.value) mainImageInput.value.value = ''
}

// ──────────────────────────────────────────────
// Image – gallery
// ──────────────────────────────────────────────

const galleryInput = ref(null)
const galleryFiles = ref([])
const galleryPreviews = ref([])

function triggerGalleryInput() {
  galleryInput.value?.click()
}

function onGalleryChange(event) {
  addGalleryFiles(Array.from(event.target.files || []))
}

function onDropGallery(event) {
  addGalleryFiles(Array.from(event.dataTransfer.files || []))
}

function addGalleryFiles(files) {
  files.forEach(file => {
    galleryFiles.value.push(file)
    galleryPreviews.value.push(URL.createObjectURL(file))
  })
}

function removeGalleryImage(index) {
  galleryFiles.value.splice(index, 1)
  galleryPreviews.value.splice(index, 1)
}

function clearGallery() {
  galleryFiles.value = []
  galleryPreviews.value = []
  if (galleryInput.value) galleryInput.value.value = ''
}

// ──────────────────────────────────────────────
// Variaciones
// ──────────────────────────────────────────────

let _gid = 0
let _vid = 0

const variationGroups = ref([])

function addGroup() {
  variationGroups.value.push({
    id: _gid++,
    name: '',
    editing: true,
    hasColor: false,
    variations: [],
  })
}

function removeGroup(gi) {
  variationGroups.value.splice(gi, 1)
}

function addVariation(gi) {
  variationGroups.value[gi].variations.push({
    id: _vid++,
    name: '',
    color: '#C9B99A',
  })
}

function removeVariation(gi, vi) {
  variationGroups.value[gi].variations.splice(vi, 1)
}

function openColorPicker(gi, vi) {
  // The color input is overlaid on the swatch; native click propagates.
}

// ──────────────────────────────────────────────
// Submit
// ──────────────────────────────────────────────

function handleSubmit() {
  // Validate basic form before submitting
  if(!form.value.nombre || !form.value.precio) {
    alert('Por favor rellena los campos requeridos (*)');
    return;
  }
  
  const payload = {
    ...form.value,
    imagenPrincipal: mainImageFile.value,
    galeria: galleryFiles.value,
    variaciones: form.value.isVariable ? variationGroups.value : [],
  }
  console.log('Producto a guardar:', payload)
  router.push('/')
}
</script>
