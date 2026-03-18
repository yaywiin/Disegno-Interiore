import { ref, computed } from 'vue'

const cartItems = ref([])
const isDrawerOpen = ref(false)

export function useCart() {
  const toggleDrawer = () => {
    isDrawerOpen.value = !isDrawerOpen.value
  }

  const openDrawer = () => {
    isDrawerOpen.value = true
  }

  const closeDrawer = () => {
    isDrawerOpen.value = false
  }

  const addItemToCart = (product, quantity = 1, options = {}) => {
    // Check if item exists
    const existingIndex = cartItems.value.findIndex(item => item.product.id === product.id && JSON.stringify(item.options) === JSON.stringify(options))
    if (existingIndex > -1) {
      cartItems.value[existingIndex].quantity += quantity
    } else {
      cartItems.value.push({ product, quantity, options })
    }
  }

  const removeItem = (index) => {
    cartItems.value.splice(index, 1)
  }

  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  })

  const cartItemCount = computed(() => {
    return cartItems.value.reduce((count, item) => count + item.quantity, 0)
  })

  const clearCart = () => {
    cartItems.value = []
  }

  return {
    cartItems,
    isDrawerOpen,
    toggleDrawer,
    openDrawer,
    closeDrawer,
    addItemToCart,
    removeItem,
    cartTotal,
    cartItemCount,
    clearCart
  }
}
