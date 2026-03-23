<template>
  <AdminLayout>
    <div class="space-y-5 sm:space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <router-link
            to="/products"
            class="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-brand-500 hover:border-brand-500 transition-colors dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-brand-500 dark:hover:border-brand-500"
          >
            <ArrowLeft class="w-5 h-5" />
          </router-link>
          <h2 class="text-xl font-bold text-gray-800 dark:text-white/90">Añadir Nuevo Producto</h2>
        </div>
        
        <!-- Top Actions -->
        <div class="flex items-center gap-3">
          <router-link
            to="/products"
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

              <!-- Fila 3: Categoria, Precio & Descuento -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <!-- Categoría -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Categoría <span class="text-error-500">*</span></label>
                  <div class="relative">
                    <select
                      v-model="form.categoria"
                      required
                      class="w-full appearance-none rounded-lg border border-gray-200 bg-transparent px-4 py-3 pr-10 text-gray-800 outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90"
                    >
                      <option value="" disabled>Selecciona una categoría</option>
                      <option v-for="cat in categoriasOpts" :key="cat.id" :value="cat.id">
                        {{ cat.nombre }}
                      </option>
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

                <!-- Descuento -->
                <div>
                  <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Descuento</label>
                  <div class="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      v-model="form.descuento"
                      placeholder="0"
                      class="w-full rounded-lg border border-gray-200 bg-transparent pl-4 pr-10 py-3 text-gray-800 outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90"
                    />
                    <span class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">%</span>
                  </div>
                  <p v-if="form.descuento > 0" class="mt-1 text-xs text-green-600 dark:text-green-400">
                    Precio final: ${{ precioConDescuento }}
                  </p>
                </div>
              </div>
              <!-- Fila 4: Productos Relacionados -->
              <div>
                <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Productos Relacionados</label>
                <div class="relative" ref="relDropdownRef">
                  <!-- Chips + input -->
                  <div
                    class="flex flex-wrap gap-1.5 min-h-[46px] w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-gray-800 transition-colors focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 dark:border-gray-700 dark:text-white/90"
                    @click="relInputRef?.focus()"
                  >
                    <span
                      v-for="rel in productosRelacionadosSelected"
                      :key="rel.id"
                      class="inline-flex items-center gap-1 rounded-md bg-brand-50 pl-2 pr-1 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-400"
                    >
                      {{ rel.nombre }}
                      <button type="button" @click.stop="removeRelacionado(rel.id)" class="hover:text-brand-900 dark:hover:text-brand-200">
                        <X class="w-3 h-3" />
                      </button>
                    </span>
                    <input
                      ref="relInputRef"
                      v-model="relSearch"
                      @focus="relOpen = true"
                      @input="relOpen = true"
                      @keydown.escape="relOpen = false"
                      @keydown.enter.prevent="selectFirstRelacionado"
                      type="text"
                      placeholder="Buscar producto…"
                      class="flex-1 min-w-[120px] bg-transparent outline-none text-sm py-0.5 placeholder-gray-400 dark:placeholder-gray-500"
                    />
                  </div>
                  <!-- Dropdown -->
                  <ul
                    v-if="relOpen && relFiltered.length > 0"
                    class="absolute z-50 mt-1 w-full max-h-52 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
                  >
                    <li
                      v-for="p in relFiltered"
                      :key="p.id"
                      @mousedown.prevent="addRelacionado(p)"
                      class="flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-500/10 text-gray-700 dark:text-gray-200"
                    >
                      <span>{{ p.nombre }}</span>
                      <span class="text-xs text-gray-400">#{{ p.id }}</span>
                    </li>
                  </ul>
                  <p v-if="relOpen && relFiltered.length === 0 && relSearch" class="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-400 shadow-lg dark:border-gray-700 dark:bg-gray-900">Sin resultados</p>
                </div>
              </div>

              <!-- Fila 5: Tipo de producto (Switch) -->
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
                <p class="text-xs text-gray-500 mt-1">Agrega grupos de Color, Tamaño o Material para este producto.</p>
              </div>
              <!-- Type picker -->
              <div class="relative" ref="addGroupRef">
                <button
                  type="button"
                  @click="showTypePicker = !showTypePicker"
                  class="inline-flex items-center gap-1.5 rounded-lg border border-brand-500 px-3 py-1.5 text-sm font-medium text-brand-500 hover:bg-brand-50 transition-colors dark:hover:bg-brand-500/10"
                >
                  <Plus class="w-4 h-4" />
                  Añadir Grupo
                </button>
                <ul v-if="showTypePicker" class="absolute right-0 z-50 mt-1 w-40 rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                  <li @click.stop="addTypedGroup('color')"    class="flex items-center gap-2 px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-500/10 text-gray-700 dark:text-gray-200 rounded-t-xl">🎨 Color</li>
                  <li @click.stop="addTypedGroup('material')" class="flex items-center gap-2 px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-500/10 text-gray-700 dark:text-gray-200">🪵 Material</li>
                  <li @click.stop="addTypedGroup('tamanio')"  class="flex items-center gap-2 px-4 py-2.5 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-500/10 text-gray-700 dark:text-gray-200 rounded-b-xl">📐 Tamaño</li>
                </ul>
              </div>
            </div>

            <div v-if="variationGroups.length === 0" class="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center dark:border-gray-700">
              <p class="text-sm text-gray-400">Aún no hay grupos. Haz clic en "Añadir Grupo" para empezar.</p>
            </div>

            <div v-else class="space-y-4">
              <div v-for="(group, gi) in variationGroups" :key="group.id" class="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">

                <!-- Group Header -->
                <div class="flex items-center gap-3 bg-gray-50 px-4 py-3 dark:bg-gray-800/60">
                  <span class="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                    <span>{{ group.type === 'color' ? '🎨' : group.type === 'material' ? '🪵' : '📐' }}</span>
                    {{ group.type === 'color' ? 'Color' : group.type === 'material' ? 'Material' : 'Tamaño' }}
                  </span>
                  <span class="ml-auto flex items-center gap-1 text-xs text-gray-400">({{ group.items.length }} seleccionados)</span>
                  <button type="button" @click="removeGroup(gi)" class="p-1 text-gray-400 hover:text-error-500 transition-colors" title="Eliminar grupo">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>

                <!-- Group Body -->
                <div class="p-4 space-y-3">

                  <!-- Selected chips -->
                  <div v-if="group.items.length > 0" class="flex flex-wrap gap-2">
                    <span
                      v-for="item in group.items" :key="item.key"
                      class="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium"
                      :class="group.type === 'color' ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200' : 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400'"
                    >
                      <span v-if="group.type === 'color'" class="inline-block w-3 h-3 rounded-full border border-white shadow-sm" :style="{ backgroundColor: item.codigo_hex }"></span>
                      {{ item.label }}
                      <button type="button" @click="removeItemFromGroup(gi, item.key)" class="hover:opacity-70"><X class="w-3 h-3" /></button>
                    </span>
                  </div>

                  <!-- ── COLOR ── -->
                  <div v-if="group.type === 'color'" class="space-y-2">

                    <!-- Selector: buscar y elegir un color registrado -->
                    <div class="relative">
                      <label class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Seleccionar color</label>
                      <div class="relative">
                        <!-- swatch preview of currently typed/selected -->
                        <span v-if="group.search" class="absolute left-3 top-1/2 -translate-y-1/2 inline-block w-4 h-4 rounded-full border border-gray-200 shadow-sm pointer-events-none"
                          :style="{ backgroundColor: colorPreviewHex(gi) }"></span>
                        <input
                          v-model="group.search"
                          @focus="group.open = true" @input="group.open = true" @keydown.escape="group.open = false"
                          @keydown.enter.prevent="selectFirstItem(gi)"
                          type="text" placeholder="Escribe para buscar…"
                          :class="['w-full rounded-lg border border-gray-200 py-2 pr-3 text-sm text-gray-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90', group.search ? 'pl-9' : 'pl-3']"
                        />
                        <ul v-if="group.open && filteredItems(gi).length > 0"
                          class="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                          <li v-for="c in filteredItems(gi)" :key="c.id"
                            @mousedown.prevent="addItemToGroup(gi, { key: c.id, label: c.nombre, codigo_hex: c.codigo_hex }); group.search = ''"
                            class="flex items-center gap-3 px-3 py-2 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-500/10 text-gray-700 dark:text-gray-200">
                            <span class="inline-block w-4 h-4 rounded-full border border-gray-200 shadow-sm flex-shrink-0" :style="{ backgroundColor: c.codigo_hex }"></span>
                            <span class="flex-1">{{ c.nombre }}</span>
                            <span class="font-mono text-xs text-gray-400 uppercase">{{ c.codigo_hex }}</span>
                          </li>
                        </ul>
                        <p v-if="group.open && filteredItems(gi).length === 0 && group.search"
                          class="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-400 shadow dark:border-gray-700 dark:bg-gray-900">
                          Sin resultados. Agrega un color nuevo abajo.
                        </p>
                      </div>
                    </div>

                    <!-- Agregar color nuevo -->
                    <div class="flex items-start justify-between pt-1">
                      <span></span><!-- spacer -->
                      <button v-if="!group.showNewForm" type="button" @click="group.showNewForm = true"
                        class="text-xs text-brand-500 hover:underline">+ Agregar color</button>
                    </div>

                    <!-- Formulario inline: nuevo color -->
                    <div v-if="group.showNewForm"
                      class="rounded-lg border border-dashed border-brand-300 bg-brand-50/30 p-3 space-y-3 dark:border-brand-700 dark:bg-brand-500/5">
                      <p class="text-xs font-semibold text-gray-600 dark:text-gray-300">Nuevo color</p>

                      <!-- Hex picker + code -->
                      <div class="flex items-center gap-3">
                        <div class="relative shrink-0 w-9 h-9 rounded-full border-2 border-white shadow ring-1 ring-gray-200 dark:ring-gray-600 overflow-hidden cursor-pointer"
                          :style="{ backgroundColor: group.newItem.codigo_hex }">
                          <input type="color" v-model="group.newItem.codigo_hex"
                            class="absolute inset-0 opacity-0 w-full h-full cursor-pointer" title="Elegir color" />
                        </div>
                        <div class="flex items-center gap-1">
                          <span class="text-sm font-mono text-gray-400">#</span>
                          <input type="text"
                            :value="group.newItem.codigo_hex.replace('#','')"
                            @input="e => { const v = e.target.value.trim(); if(/^[0-9a-fA-F]{6}$/.test(v)) group.newItem.codigo_hex = '#'+v }"
                            maxlength="6" placeholder="RRGGBB"
                            class="w-20 font-mono text-sm rounded-md border border-gray-200 px-2 py-1.5 uppercase outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90" />
                        </div>
                      </div>

                      <!-- Nombre -->
                      <input v-model="group.newItem.nombre" type="text" placeholder="Nombre del color (ej. Azul marino)"
                        class="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90" />

                      <!-- Acciones -->
                      <div class="flex gap-2 justify-end">
                        <button type="button" @click="group.showNewForm = false; group.newItem = makeNewItem('color')"
                          class="text-xs text-gray-500 hover:underline">Cancelar</button>
                        <button type="button" @click="addOrSaveColor(gi)" :disabled="group.saving || !group.newItem.nombre"
                          class="rounded-md bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600 disabled:opacity-40 transition-colors">
                          {{ group.saving ? 'Guardando…' : 'Guardar y agregar' }}
                        </button>
                      </div>
                    </div>

                  </div>

                  <!-- ── MATERIAL autocomplete ── -->
                  <div v-if="group.type === 'material'" class="space-y-2">
                    <div class="relative">
                      <input
                        v-model="group.search"
                        @focus="group.open = true" @input="group.open = true" @keydown.escape="group.open = false"
                        @keydown.enter.prevent="selectFirstItem(gi)"
                        type="text" placeholder="Buscar material…"
                        class="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90"
                      />
                      <ul v-if="group.open && filteredItems(gi).length > 0"
                        class="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                        <li v-for="m in filteredItems(gi)" :key="m.nombre"
                          @mousedown.prevent="addItemToGroup(gi, { key: m.nombre, label: m.nombre + (m.tipo ? ' · ' + m.tipo : '') })"
                          class="flex items-center justify-between px-4 py-2 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-500/10 text-gray-700 dark:text-gray-200">
                          <span>{{ m.nombre }}</span>
                          <span v-if="m.tipo" class="text-xs text-gray-400">{{ m.tipo }}</span>
                        </li>
                      </ul>
                    </div>
                    <div v-if="!group.showNewForm" class="text-right">
                      <button type="button" @click="group.showNewForm = true" class="text-xs text-brand-500 hover:underline">+ Nuevo material</button>
                    </div>
                    <div v-else class="rounded-lg border border-dashed border-brand-300 p-3 space-y-2 dark:border-brand-600">
                      <p class="text-xs font-medium text-gray-600 dark:text-gray-300">Nuevo material</p>
                      <div class="flex gap-2">
                        <input v-model="group.newItem.nombre" type="text" placeholder="Nombre (ej. Madera de pino)" class="flex-1 rounded-md border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90" />
                        <input v-model="group.newItem.tipo" type="text" placeholder="Tipo (ej. Natural)" class="flex-1 rounded-md border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90" />
                      </div>
                      <div class="flex gap-2 justify-end">
                        <button type="button" @click="group.showNewForm = false" class="text-xs text-gray-500 hover:underline">Cancelar</button>
                        <button type="button" @click="saveNewMaterial(gi)" :disabled="group.saving" class="rounded-md bg-brand-500 px-3 py-1 text-xs font-medium text-white hover:bg-brand-600 disabled:opacity-50">
                          {{ group.saving ? 'Guardando…' : 'Guardar' }}
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- ── TAMAÑO ── -->
                  <div v-if="group.type === 'tamanio'" class="space-y-2">

                    <!-- Selector: buscar tamaño registrado -->
                    <div class="relative">
                      <label class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Seleccionar tamaño</label>
                      <input
                        v-model="group.search"
                        @focus="group.open = true" @input="group.open = true" @keydown.escape="group.open = false"
                        @keydown.enter.prevent="selectFirstItem(gi)"
                        type="text" placeholder="Escribe para buscar…"
                        class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90"
                      />
                      <ul v-if="group.open && filteredItems(gi).length > 0"
                        class="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                        <li v-for="t in filteredItems(gi)" :key="t.id"
                          @mousedown.prevent="addItemToGroup(gi, { key: t.id, label: t.nombre + (t.ancho_cm ? ` ${t.ancho_cm}×${t.altura_cm}×${t.profundidad_cm}cm` : '') }); group.search = ''"
                          class="flex items-center justify-between px-4 py-2 text-sm cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-500/10 text-gray-700 dark:text-gray-200">
                          <span class="font-medium">{{ t.nombre }}</span>
                          <span class="text-xs text-gray-400 font-mono">{{ t.ancho_cm }}×{{ t.altura_cm }}×{{ t.profundidad_cm }} cm</span>
                        </li>
                      </ul>
                      <p v-if="group.open && filteredItems(gi).length === 0 && group.search"
                        class="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-400 shadow dark:border-gray-700 dark:bg-gray-900">
                        Sin resultados. Agrega un tamaño nuevo abajo.
                      </p>
                    </div>

                    <!-- Link agregar -->
                    <div class="flex justify-end pt-1">
                      <button v-if="!group.showNewForm" type="button" @click="group.showNewForm = true"
                        class="text-xs text-brand-500 hover:underline">+ Agregar tamaño</button>
                    </div>

                    <!-- Formulario inline: nuevo tamaño -->
                    <div v-if="group.showNewForm"
                      class="rounded-lg border border-dashed border-brand-300 bg-brand-50/30 p-3 space-y-3 dark:border-brand-700 dark:bg-brand-500/5">
                      <p class="text-xs font-semibold text-gray-600 dark:text-gray-300">Nuevo tamaño</p>

                      <!-- Nombre -->
                      <input v-model="group.newItem.nombre" type="text" placeholder="Nombre (ej. Grande, XL, 120×90…)"
                        class="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90" />

                      <!-- Dimensiones -->
                      <div class="grid grid-cols-3 gap-2">
                        <div>
                          <label class="text-xs text-gray-500 mb-1 block">Alto (cm)</label>
                          <input v-model="group.newItem.altura_cm" type="number" min="0" step="0.01" placeholder="0"
                            class="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90" />
                        </div>
                        <div>
                          <label class="text-xs text-gray-500 mb-1 block">Ancho (cm)</label>
                          <input v-model="group.newItem.ancho_cm" type="number" min="0" step="0.01" placeholder="0"
                            class="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90" />
                        </div>
                        <div>
                          <label class="text-xs text-gray-500 mb-1 block">Profundidad (cm)</label>
                          <input v-model="group.newItem.profundidad_cm" type="number" min="0" step="0.01" placeholder="0"
                            class="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90" />
                        </div>
                      </div>

                      <!-- Acciones -->
                      <div class="flex gap-2 justify-end">
                        <button type="button" @click="group.showNewForm = false; group.newItem = makeNewItem('tamanio')"
                          class="text-xs text-gray-500 hover:underline">Cancelar</button>
                        <button type="button" @click="saveNewTamanio(gi)" :disabled="group.saving || !group.newItem.nombre"
                          class="rounded-md bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600 disabled:opacity-40 transition-colors">
                          {{ group.saving ? 'Guardando…' : 'Guardar y agregar' }}
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </div>

        </div><!-- end xl:col-span-9 -->

        <!-- Right Column: 20% / Sidebar (span 3 / 12) -->
        <div class="xl:col-span-3 space-y-6">

          <!-- Dimensiones -->
          <div class="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 class="text-base font-semibold text-gray-800 dark:text-white/90 mb-5">Dimensiones</h3>
            <div class="space-y-4">
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Ancho (cm)</label>
                <input type="number" step="0.01" min="0" v-model="form.ancho" placeholder="0"
                  class="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-gray-800 outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90" />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Alto (cm)</label>
                <input type="number" step="0.01" min="0" v-model="form.alto" placeholder="0"
                  class="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-gray-800 outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90" />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Profundidad (cm)</label>
                <input type="number" step="0.01" min="0" v-model="form.profundidad" placeholder="0"
                  class="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-2.5 text-gray-800 outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:text-white/90" />
              </div>
            </div>
          </div>


          <!-- Inventario -->
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
import { ref, onMounted, computed } from 'vue'
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
  id: generateId(),
  fechaAlta: todayFormatted(),
  nombre: '',
  descripcion: '',
  categoria: '',
  precio: '',
  descuento: '',
  stock: '',
  ancho: '',
  alto: '',
  profundidad: '',
  isVariable: false,
})

function formatPrecio() {
  const val = parseFloat(form.value.precio)
  if (!isNaN(val)) {
    form.value.precio = val.toFixed(2)
  }
}

const precioConDescuento = computed(() => {
  const precio = parseFloat(form.value.precio) || 0
  const descuento = parseFloat(form.value.descuento) || 0
  const final = precio - (precio * descuento / 100)
  return final.toFixed(2)
})

// ──────────────────────────────────────────────
// Categorías desde la API
// ──────────────────────────────────────────────

const categoriasOpts = ref([])

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3001/api/categorias')
    categoriasOpts.value = await res.json()
  } catch (e) {
    console.error('Error al cargar categorías:', e)
  }
})

// ──────────────────────────────────────────────
// Productos Relacionados (autocomplete)
// ──────────────────────────────────────────────

const todosLosProductos          = ref([])
const productosRelacionadosSelected = ref([])  // { id, nombre }
const relSearch  = ref('')
const relOpen    = ref(false)
const relInputRef   = ref(null)
const relDropdownRef = ref(null)

onMounted(async () => {
  // Cargar lista para el autocomplete de relacionados
  try {
    const res = await fetch('http://localhost:3001/api/productos')
    todosLosProductos.value = await res.json()
  } catch (e) {
    console.error('Error al cargar productos relacionados:', e)
  }

  // Cerrar dropdown al hacer click fuera
  document.addEventListener('click', (e) => {
    if (relDropdownRef.value && !relDropdownRef.value.contains(e.target)) {
      relOpen.value = false
    }
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
  relSearch.value = ''
  relOpen.value = false
}

function removeRelacionado(id) {
  productosRelacionadosSelected.value = productosRelacionadosSelected.value.filter(p => p.id !== id)
}

function selectFirstRelacionado() {
  if (relFiltered.value.length > 0) addRelacionado(relFiltered.value[0])
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
// Variaciones (typed groups)
// ──────────────────────────────────────────────

let _gid = 0
const variationGroups = ref([])
const showTypePicker  = ref(false)
const addGroupRef     = ref(null)
const dbColores    = ref([])
const dbMateriales = ref([])
const dbTamanios   = ref([])

onMounted(async () => {
  // Cargar datos para los grupos de variaciones
  const [resC, resM, resT] = await Promise.allSettled([
    fetch('http://localhost:3001/api/colores').then(r => r.json()),
    fetch('http://localhost:3001/api/materiales').then(r => r.json()),
    fetch('http://localhost:3001/api/tamanios').then(r => r.json()),
  ])
  if (resC.status === 'fulfilled') dbColores.value    = resC.value
  if (resM.status === 'fulfilled') dbMateriales.value = resM.value
  if (resT.status === 'fulfilled') dbTamanios.value   = resT.value

  // Cerrar type picker al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (addGroupRef.value && !addGroupRef.value.contains(e.target)) {
      showTypePicker.value = false
    }
  })
})

function makeNewItem(type) {
  if (type === 'color')    return { nombre: '', codigo_hex: '#C9B99A' }
  if (type === 'material') return { nombre: '', tipo: '' }
  if (type === 'tamanio')  return { nombre: '', altura_cm: '', ancho_cm: '', profundidad_cm: '' }
}

function addTypedGroup(type) {
  variationGroups.value.push({
    id: _gid++,
    type,
    items: [],
    search: '',
    open: false,
    showNewForm: false,
    saving: false,
    newItem: makeNewItem(type),
  })
  showTypePicker.value = false
}

function removeGroup(gi) {
  variationGroups.value.splice(gi, 1)
}

function filteredItems(gi) {
  const group = variationGroups.value[gi]
  const q = group.search.trim().toLowerCase()
  const selectedKeys = group.items.map(i => i.key)
  let source = []
  if (group.type === 'color')    source = dbColores.value
  if (group.type === 'material') source = dbMateriales.value
  if (group.type === 'tamanio')  source = dbTamanios.value
  return source
    .filter(i => {
      const key = group.type === 'material' ? i.nombre : i.id
      return !selectedKeys.includes(key)
    })
    .filter(i => !q || i.nombre.toLowerCase().includes(q))
    .slice(0, 8)
}

function addItemToGroup(gi, item) {
  const group = variationGroups.value[gi]
  if (!group.items.find(i => i.key === item.key)) {
    group.items.push(item)
  }
  group.search = ''
  group.open = false
}

function removeItemFromGroup(gi, key) {
  variationGroups.value[gi].items = variationGroups.value[gi].items.filter(i => i.key !== key)
}

function selectFirstItem(gi) {
  const items = filteredItems(gi)
  if (items.length > 0) {
    const g = variationGroups.value[gi]
    const first = items[0]
    if (g.type === 'color')    addItemToGroup(gi, { key: first.id, label: first.nombre, codigo_hex: first.codigo_hex })
    if (g.type === 'material') addItemToGroup(gi, { key: first.nombre, label: first.nombre + (first.tipo ? ' · ' + first.tipo : '') })
    if (g.type === 'tamanio')  addItemToGroup(gi, { key: first.id, label: first.nombre })
  }
}

async function saveNewColor(gi) {
  const group = variationGroups.value[gi]
  if (!group.newItem.nombre) return
  group.saving = true
  try {
    const res = await fetch('http://localhost:3001/api/colores', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: group.newItem.nombre, codigo_hex: group.newItem.codigo_hex }),
    })
    const data = await res.json()
    if (res.ok) {
      dbColores.value.push(data)
      addItemToGroup(gi, { key: data.id, label: data.nombre, codigo_hex: data.codigo_hex })
      group.showNewForm = false
      group.newItem = makeNewItem('color')
    } else { alert(data.error || 'Error al guardar color') }
  } catch { alert('Error de conexión') }
  finally { group.saving = false }
}

// Filters DB colors by the name the user is typing
function colorAutocomplete(gi) {
  const group = variationGroups.value[gi]
  const q = (group.newItem.nombre || '').trim().toLowerCase()
  const selectedKeys = group.items.map(i => i.key)
  return dbColores.value
    .filter(c => !selectedKeys.includes(c.id))
    .filter(c => !q || c.nombre.toLowerCase().includes(q))
    .slice(0, 8)
}

// Returns the hex of the first DB color that matches the current search term (for swatch preview)
function colorPreviewHex(gi) {
  const group = variationGroups.value[gi]
  const q = (group.search || '').trim().toLowerCase()
  const match = dbColores.value.find(c => c.nombre.toLowerCase().includes(q))
  return match ? match.codigo_hex : '#e5e7eb'
}


function applyColorSuggestion(gi, c) {
  const group = variationGroups.value[gi]
  group.newItem.nombre    = c.nombre
  group.newItem.codigo_hex = c.codigo_hex
  group.open = false
  addItemToGroup(gi, { key: c.id, label: c.nombre, codigo_hex: c.codigo_hex })
  group.newItem = makeNewItem('color')
}

// Adds the color: reuses existing if name matches, otherwise saves a new one to DB
async function addOrSaveColor(gi) {
  const group = variationGroups.value[gi]
  if (!group.newItem.nombre) return

  // Check if an exact match already exists in DB
  const existing = dbColores.value.find(
    c => c.nombre.toLowerCase() === group.newItem.nombre.toLowerCase()
  )
  if (existing) {
    addItemToGroup(gi, { key: existing.id, label: existing.nombre, codigo_hex: existing.codigo_hex })
    group.newItem = makeNewItem('color')
    group.open = false
    return
  }

  // Save new color to DB
  await saveNewColor(gi)
}


async function saveNewMaterial(gi) {
  const group = variationGroups.value[gi]
  if (!group.newItem.nombre) return
  group.saving = true
  try {
    const res = await fetch('http://localhost:3001/api/materiales', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: group.newItem.nombre, tipo: group.newItem.tipo }),
    })
    const data = await res.json()
    if (res.ok) {
      dbMateriales.value.push(data)
      addItemToGroup(gi, { key: data.nombre, label: data.nombre + (data.tipo ? ' · ' + data.tipo : '') })
      group.showNewForm = false
      group.newItem = makeNewItem('material')
    } else { alert(data.error || 'Error al guardar material') }
  } catch { alert('Error de conexión') }
  finally { group.saving = false }
}

async function saveNewTamanio(gi) {
  const group = variationGroups.value[gi]
  if (!group.newItem.nombre) return
  group.saving = true
  try {
    const res = await fetch('http://localhost:3001/api/tamanios', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(group.newItem),
    })
    const data = await res.json()
    if (res.ok) {
      dbTamanios.value.push(data)
      const dims = data.ancho_cm ? ` ${data.ancho_cm}×${data.altura_cm}×${data.profundidad_cm}cm` : ''
      addItemToGroup(gi, { key: data.id, label: data.nombre + dims })
      group.showNewForm = false
      group.newItem = makeNewItem('tamanio')
    } else { alert(data.error || 'Error al guardar tamaño') }
  } catch { alert('Error de conexión') }
  finally { group.saving = false }
}

// ──────────────────────────────────────────────
// Submit
// ──────────────────────────────────────────────

const submitting = ref(false)

async function handleSubmit() {
  if (!form.value.nombre || !form.value.precio) {
    alert('Por favor rellena los campos requeridos (*)')
    return
  }

  submitting.value = true

  try {
    // Categorías: el select devuelve el ID de la categoría;
    // guardamos el nombre para el array de texto en la DB
    const catSeleccionada = categoriasOpts.value.find(c => c.id === form.value.categoria)
    const categoriasArr = catSeleccionada ? [catSeleccionada.nombre] : []

    // Variaciones → colores / tamaños / materiales desde grupos tipados
    const colores    = variationGroups.value.filter(g => g.type === 'color')   .flatMap(g => g.items.map(i => i.label))
    const materiales = variationGroups.value.filter(g => g.type === 'material').flatMap(g => g.items.map(i => i.key.toString()))
    const tamanios   = variationGroups.value.filter(g => g.type === 'tamanio') .flatMap(g => g.items.map(i => i.label))

    const payload = {
      nombre:            form.value.nombre.trim(),
      precio:            parseFloat(form.value.precio) || 0,
      descripcion:       form.value.descripcion || '',
      stock:             parseInt(form.value.stock) || 0,
      categorias:        categoriasArr,
      es_variable:       form.value.isVariable,
      colores,
      tamanios,
      materiales,
      imagen_principal:  '',
      galeria:           [],
      descuento:         parseFloat(form.value.descuento) || 0,
      ancho:             parseFloat(form.value.ancho) || 0,
      alto:              parseFloat(form.value.alto) || 0,
      profundidad:       parseFloat(form.value.profundidad) || 0,
      productos_relacionados: productosRelacionadosSelected.value.map(p => p.id),
    }

    const res = await fetch('http://localhost:3001/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.error || 'Error al guardar el producto')
      return
    }

    router.push('/products')
  } catch (e) {
    console.error('Error al guardar producto:', e)
    alert('Error de conexión con el servidor')
  } finally {
    submitting.value = false
  }
}
</script>
