import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      redirect: '/signin',
    },
    {
      path: '/products',
      name: 'Products',
      component: () => import('../views/Products/ProductsView.vue'),
      meta: { title: 'Productos', requiresAuth: true },
    },
    {
      path: '/users',
      name: 'Users',
      component: () => import('../views/Users/UsersView.vue'),
      meta: { title: 'Administrador de usuarios', requiresAuth: true },
    },
    {
      path: '/add-product',
      name: 'Add Product',
      component: () => import('../views/Products/AddProductView.vue'),
      meta: { title: 'Añadir Producto', requiresAuth: true },
    },
    {
      path: '/edit-product/:id',
      name: 'Edit Product',
      component: () => import('../views/Products/EditProductView.vue'),
      meta: { title: 'Editar Producto', requiresAuth: true },
    },
    {
      path: '/categorias',
      name: 'Categorias',
      component: () => import('../views/Categorias/CategoriasView.vue'),
      meta: { title: 'Categorías', requiresAuth: true },
    },
    {
      path: '/ecommerce',
      name: 'Ecommerce',
      component: () => import('../views/Ecommerce.vue'),
      meta: { title: 'eCommerce Dashboard', requiresAuth: true },
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/Others/Calendar.vue'),
      meta: { title: 'Calendar', requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: { title: 'Profile', requiresAuth: true },
    },
    {
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: { title: 'Form Elements', requiresAuth: true },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: { title: 'Basic Tables', requiresAuth: true },
    },
    {
      path: '/line-chart',
      name: 'Line Chart',
      component: () => import('../views/Chart/LineChart/LineChart.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/bar-chart',
      name: 'Bar Chart',
      component: () => import('../views/Chart/BarChart/BarChart.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: () => import('../views/UiElements/Alerts.vue'),
      meta: { title: 'Alerts', requiresAuth: true },
    },
    {
      path: '/avatars',
      name: 'Avatars',
      component: () => import('../views/UiElements/Avatars.vue'),
      meta: { title: 'Avatars', requiresAuth: true },
    },
    {
      path: '/badge',
      name: 'Badge',
      component: () => import('../views/UiElements/Badges.vue'),
      meta: { title: 'Badge', requiresAuth: true },
    },
    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/UiElements/Buttons.vue'),
      meta: { title: 'Buttons', requiresAuth: true },
    },
    {
      path: '/images',
      name: 'Images',
      component: () => import('../views/UiElements/Images.vue'),
      meta: { title: 'Images', requiresAuth: true },
    },
    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/UiElements/Videos.vue'),
      meta: { title: 'Videos', requiresAuth: true },
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: { title: 'Blank', requiresAuth: true },
    },
    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: { title: '404 Error' },
    },
    // Rutas públicas (sin autenticación)
    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: { title: 'Iniciar Sesión' },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: { title: 'Registro' },
    },
  ],
})

// Guard de navegación — verifica autenticación JWT
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || 'Panel'} | Disegno Interiore Admin`

  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')

    if (!token) {
      return next('/signin')
    }

    // Verificar expiración del token en el cliente
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.exp <= Date.now() / 1000) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        return next('/signin')
      }
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return next('/signin')
    }
  }

  // Si ya está autenticado y va a /signin, redirigir al panel
  if (to.path === '/signin' && localStorage.getItem('token')) {
    try {
      const payload = JSON.parse(atob(localStorage.getItem('token')!.split('.')[1]))
      if (payload.exp > Date.now() / 1000) {
        return next('/products')
      }
    } catch {
      // token inválido, dejar pasar al signin
    }
  }

  next()
})

export default router
