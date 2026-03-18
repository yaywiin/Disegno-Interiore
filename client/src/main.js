import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

import HomeView from './views/HomeView.vue'
import NosotrosView from './views/NosotrosView.vue'
import TiendaView from './views/TiendaView.vue'
import ProductView from './views/ProductView.vue'
import CheckoutView from './views/CheckoutView.vue'
import ContactoView from './views/ContactoView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/nosotros', component: NosotrosView },
    { path: '/tienda', component: TiendaView },
    { path: '/tienda/:id', component: ProductView, name: 'Product' },
    { path: '/checkout', component: CheckoutView, name: 'Checkout' },
    { path: '/contacto', component: ContactoView },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  }
})

createApp(App).use(router).mount('#app')
