<template>
  <FullScreenLayout>
    <div class="relative min-h-screen flex bg-gray-50 dark:bg-gray-900">
      
      <!-- Panel izquierdo: Formulario -->
      <div class="flex flex-col flex-1 w-full lg:w-1/2 px-6 py-10 sm:px-12 justify-center">
        <!-- Logo -->
        <div class="mb-10">
          <router-link to="/" class="logo">
            <span class="logo-mark"></span>
            <span class="logo-text">Disegno<em>Interiore</em></span>
          </router-link>
        </div>

        <div class="w-full max-w-md mx-auto lg:mx-0">
          <div class="mb-8">
            <h1 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Bienvenido de vuelta
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Ingresa tu correo y contraseña para acceder al panel.
            </p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <!-- Correo -->
            <div>
              <label
                for="email"
                class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
              >
                Correo electrónico <span class="text-error-500">*</span>
              </label>
              <input
                v-model="email"
                type="email"
                id="email"
                name="email"
                required
                placeholder="correo@ejemplo.com"
                class="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>

            <!-- Contraseña -->
            <div>
              <label
                for="password"
                class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400"
              >
                Contraseña <span class="text-error-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  required
                  placeholder="Ingresa tu contraseña"
                  class="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
                <span
                  @click="togglePasswordVisibility"
                  class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400"
                  :title="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                >
                  <svg v-if="!showPassword" class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z" fill="#98A2B3"/>
                  </svg>
                  <svg v-else class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30925 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z" fill="#98A2B3"/>
                  </svg>
                </span>
              </div>
            </div>

            <!-- Opciones -->
            <div class="flex items-center justify-between">
              <label
                for="keepLoggedIn"
                class="flex items-center text-sm font-normal text-gray-700 cursor-pointer select-none dark:text-gray-400"
              >
                <div class="relative mr-3">
                  <input v-model="keepLoggedIn" type="checkbox" id="keepLoggedIn" class="sr-only" />
                  <div
                    :class="keepLoggedIn ? 'border-brand-500 bg-brand-500' : 'bg-transparent border-gray-300 dark:border-gray-700'"
                    class="flex h-5 w-5 items-center justify-center rounded-md border-[1.25px]"
                  >
                    <span :class="keepLoggedIn ? '' : 'opacity-0'">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="white" stroke-width="1.94437" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </span>
                  </div>
                </div>
                Mantenerme conectado
              </label>
              <router-link to="/reset-password" class="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400">
                ¿Olvidaste tu contraseña?
              </router-link>
            </div>

            <!-- Botón -->
            <button
              type="submit"
              class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>

      <!-- Panel derecho: Visual de marca -->
      <div class="relative hidden lg:flex lg:w-1/2 bg-brand-950 flex-col items-center justify-center overflow-hidden shadow-[-10px_0_30px_rgba(0,0,0,0.1)]">
        <!-- Imagen fotográfica premium -->
        <div 
          class="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-105"
          style="background-image: url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1600');"
        ></div>
        
        <!-- Capas de degradado y filtros elegantes -->
        <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/80 to-gray-900/40 mix-blend-multiply"></div>
        <div class="absolute inset-0 bg-brand-950/40 backdrop-blur-[2px]"></div>

        <!-- Decoraciones sutiles tipo marco -->
        <div class="absolute inset-8 border border-white/10 opacity-50 hidden xl:block pointer-events-none"></div>

        <!-- Contenido principal centrado -->
        <div class="relative z-10 w-full h-full flex flex-col items-center justify-center p-12 lg:p-20 text-center">
          
          <!-- Elemento flotante premium (glassmorphism) -->
          <div class="mb-12 relative flex flex-col items-center justify-center p-8 lg:p-10 rounded-2xl border border-white/20 bg-white/5 shadow-2xl backdrop-blur-md">
            <!-- Destello estético arriba -->
            <div class="absolute -top-[1px] left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-brand-400 to-transparent"></div>
            
            <div class="flex items-center justify-center w-14 h-14 border border-brand-500 rotate-45 flex-shrink-0 shadow-[0_0_15px_rgba(155,152,97,0.3)] mb-8">
              <div class="w-10 h-10 border border-brand-400/40"></div>
            </div>
            
            <div class="mt-2 text-center flex flex-col items-center">
              <p class="text-white/80 text-[11px] tracking-[0.35em] uppercase font-light mb-1">Disegno</p>
              <p class="text-brand-400 text-3xl italic" style="font-family: 'Playfair Display', serif; font-weight: 400; letter-spacing: 0.05em;">Interiore</p>
            </div>
            
            <div class="mt-6 flex items-center justify-center gap-3 opacity-60">
              <div class="h-px w-10 bg-brand-500/80"></div>
              <div class="w-1 h-1 bg-brand-500 rotate-45"></div>
              <div class="h-px w-10 bg-brand-500/80"></div>
            </div>
          </div>

          <!-- Textiles y slogan premium -->
          <div>
            <h2 class="text-3xl lg:text-4xl lg:leading-[1.3] font-light text-white mb-5" style="font-family: 'Playfair Display', serif;">
              Diseño de élite,<br />
              <span class="italic text-brand-400">experiencia inolvidable.</span>
            </h2>
            <p class="text-white/60 text-sm font-light tracking-[0.05em] max-w-sm mx-auto leading-relaxed">
              Administra los catálogos y el control de accesos con total seguridad y sofisticación de nivel maestro.
            </p>
          </div>
        </div>
      </div>

    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const keepLoggedIn = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleSubmit = () => {
  console.log('Inicio de sesión', {
    email: email.value,
    password: password.value,
    keepLoggedIn: keepLoggedIn.value,
  })
}
</script>
