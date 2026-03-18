<template>
  <header :class="['navbar', { scrolled: isScrolled, 'menu-open': menuOpen, 'theme-dark-bg': needsLightText }]">
    <div class="nav-inner container">
      <!-- Logo -->
      <router-link to="/" class="logo" @click="menuOpen = false">
        <span class="logo-mark"></span>
        <span class="logo-text">Disegno<em>Interiore</em></span>
      </router-link>

      <!-- Desktop Nav -->
      <nav class="nav-links">
        <router-link v-for="link in links" :key="link.path" :to="link.path" class="nav-link">
          {{ link.label }}
        </router-link>
      </nav>

      <!-- CTA & Cart -->
      <div class="nav-actions">
        <button class="cart-btn" @click="toggleDrawer" aria-label="Abrir carrito">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <span class="cart-badge" v-if="cartItemCount > 0">{{ cartItemCount }}</span>
        </button>
        <router-link to="/contacto" class="nav-cta btn btn-outline" @click="menuOpen = false">
          Contacto
        </router-link>
      </div>

      <!-- Burger -->
      <button class="burger" :class="{ active: menuOpen }" @click="menuOpen = !menuOpen" aria-label="Menú">
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div class="mobile-menu" :class="{ open: menuOpen }">
      <router-link
        v-for="link in links"
        :key="link.path"
        :to="link.path"
        class="mobile-link"
        @click="menuOpen = false"
      >
        {{ link.label }}
      </router-link>
      <div class="mobile-actions">
        <button class="cart-btn mobile-cart-btn" @click="() => { toggleDrawer(); menuOpen=false; }">
          Mi Selección <span v-if="cartItemCount > 0">({{ cartItemCount }})</span>
        </button>
        <router-link to="/contacto" class="btn btn-primary mobile-cta" @click="menuOpen = false">
          Contacto
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCart } from '../composables/useCart'

const { cartItemCount, toggleDrawer } = useCart()
const route = useRoute()
const isScrolled = ref(false)
const menuOpen = ref(false)

const isHome = computed(() => route.path === '/')
const needsLightText = computed(() => isHome.value && !isScrolled.value && !menuOpen.value)

const links = [
  { path: '/', label: 'Inicio' },
  { path: '/nosotros', label: 'Nosotros' },
  { path: '/tienda', label: 'Tienda' },
]

const onScroll = () => { isScrolled.value = window.scrollY > 60 }

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  padding: 32px 0;
  transition: padding 0.5s ease, background 0.5s ease, border-bottom 0.5s ease, box-shadow 0.5s ease;
  border-bottom: 1px solid transparent;
}
.navbar.scrolled {
  padding: 18px 0;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--c-border);
  box-shadow: 0 1px 0 var(--c-border);
}

.nav-inner {
  display: flex;
  align-items: center;
  gap: 40px;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  margin-right: auto;
}
.logo-mark {
  width: 22px;
  height: 22px;
  border: 1.5px solid var(--c-brand);
  transform: rotate(45deg);
  flex-shrink: 0;
  transition: background 0.3s;
}
.logo:hover .logo-mark {
  background: var(--c-brand);
}
.logo-text {
  font-family: var(--font-sans);
  font-size: 15px;
  font-weight: 300;
  letter-spacing: 0.12em;
  color: var(--c-dark);
  text-transform: uppercase;
}
.logo-text em {
  font-style: italic;
  font-family: var(--font-serif);
  font-weight: 400;
  letter-spacing: 0.05em;
  text-transform: none;
  color: var(--c-brand);
  margin-left: 2px;
}

/* Nav Links */
.nav-links {
  display: flex;
  gap: 40px;
  align-items: center;
}
.nav-link {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--c-muted);
  position: relative;
  padding-bottom: 3px;
  transition: color 0.3s;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  width: 0; height: 1px;
  background: var(--c-brand);
  transition: width 0.35s var(--ease);
}
.nav-link:hover,
.nav-link.router-link-active {
  color: var(--c-dark);
}
.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

/* Actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 24px;
}
.cart-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--c-dark);
  transition: color 0.3s;
  display: flex;
  align-items: center;
  position: relative;
}
.cart-btn:hover { color: var(--c-brand); }
.cart-badge {
  position: absolute;
  top: 0; right: -2px;
  background: var(--c-brand);
  color: var(--c-white);
  font-size: 9px;
  font-weight: 500;
  width: 16px; height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-cta {
  padding: 10px 26px;
  font-size: 10px;
}

/* Burger */
.burger {
  display: none;
  flex-direction: column;
  gap: 7px;
  width: 28px;
  padding: 4px;
}
.burger span {
  display: block;
  width: 100%;
  height: 1px;
  background: var(--c-dark);
  transition: all 0.35s ease;
  transform-origin: center;
}
.burger.active span:nth-child(1) {
  transform: translateY(4px) rotate(45deg);
}
.burger.active span:nth-child(2) {
  transform: translateY(-4px) rotate(-45deg);
}

/* Mobile Menu */
.mobile-menu {
  display: none;
  flex-direction: column;
  padding: 0 clamp(24px, 5vw, 88px);
  gap: 0;
  background: transparent;
  border-top: 1px solid transparent;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s var(--ease-out), border-top-color 0.3s, padding 0.4s;
}
.mobile-menu.open {
  max-height: 500px;
  padding-bottom: 40px;
}
.mobile-link {
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--c-muted);
  padding: 18px 0;
  border-bottom: 1px solid var(--c-border);
  transition: color 0.3s;
}
.mobile-link.router-link-active,
.mobile-link:hover { color: var(--c-dark); }
.mobile-actions { margin-top: 24px; display: flex; flex-direction: column; gap: 16px; align-items: flex-start; }
.mobile-cart-btn { font-size: 12px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--c-dark); padding: 0; }
.mobile-cta { margin-top: 8px; }

@media (max-width: 900px) {
  .nav-links, .nav-cta, .nav-actions { display: none; }
  .burger { display: flex; }
  .mobile-menu { display: flex; }
}

/* ================================================================
   DYNAMIC LIGHT TEXT (When over dark Home hero)
================================================================ */
.navbar.theme-dark-bg .logo-text { color: var(--c-white); }
.navbar.theme-dark-bg .logo-text em { color: var(--c-brand-light); }
.navbar.theme-dark-bg .logo-mark { border-color: var(--c-brand-light); }
.navbar.theme-dark-bg .logo:hover .logo-mark { background: var(--c-brand-light); }

.navbar.theme-dark-bg .cart-btn { color: var(--c-white); }
.navbar.theme-dark-bg .cart-btn:hover { color: var(--c-brand-light); }
.navbar.theme-dark-bg .cart-badge { background: var(--c-brand-light); color: var(--c-dark); }

.navbar.theme-dark-bg .nav-link { color: rgba(255,255,255,0.7); }
.navbar.theme-dark-bg .nav-link:hover,
.navbar.theme-dark-bg .nav-link.router-link-active { color: var(--c-white); }
.navbar.theme-dark-bg .nav-link::after { background: var(--c-brand-light); }

.navbar.theme-dark-bg .nav-cta {
  color: var(--c-white);
  border-color: rgba(255,255,255,0.3);
}
.navbar.theme-dark-bg .nav-cta:hover {
  background: var(--c-white);
  color: var(--c-dark);
  border-color: var(--c-white);
}

.navbar.theme-dark-bg .burger span { background: var(--c-white); }
</style>
