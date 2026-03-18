<template>
  <div>
    <!-- Backdrop overlay -->
    <div
      class="cart-backdrop"
      :class="{ open: isDrawerOpen }"
      @click="closeDrawer"
    ></div>

    <!-- Drawer -->
    <aside class="cart-drawer" :class="{ open: isDrawerOpen }">
      <div class="cart-header">
        <h2 class="cart-title">Tu Selección</h2>
        <button class="cart-close" @click="closeDrawer" aria-label="Cerrar carrito">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="cart-body">
        <div v-if="cartItems.length === 0" class="cart-empty">
          <p>Tu selección está vacía.</p>
          <button class="btn btn-outline" style="font-size: 10px; padding: 12px 24px" @click="goShop">
            Explorar Colección
          </button>
        </div>

        <ul v-else class="cart-items">
          <li v-for="(item, index) in cartItems" :key="index" class="cart-item">
            <img :src="item.product.img" :alt="item.product.name" class="item-img" />
            <div class="item-info">
              <div class="item-top">
                <span class="item-category">{{ item.product.category }}</span>
                <button class="item-remove" @click="removeItem(index)">Cerrar</button>
              </div>
              <h3 class="item-name">{{ item.product.name }}</h3>
              <p class="item-options" v-if="item.options.material">
                Material: {{ item.options.material }}
              </p>
              <div class="item-bottom">
                <span class="item-qty">Qty: {{ item.quantity }}</span>
                <span class="item-price">{{ formatPrice(item.product.price * item.quantity) }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="cart-footer" v-if="cartItems.length > 0">
        <div class="cart-total">
          <span>Subtotal</span>
          <span class="total-price">{{ formatPrice(cartTotal) }}</span>
        </div>
        <p class="cart-note">Impuestos incluidos. El envío se calcula al finalizar la compra.</p>
        <button class="btn btn-primary cart-checkout" @click="proceedCheckout">
          <span>Proceder al pago</span>
        </button>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { useCart } from '../composables/useCart'
import { useRouter } from 'vue-router'

const { cartItems, isDrawerOpen, closeDrawer, removeItem, cartTotal } = useCart()
const router = useRouter()

const formatPrice = (value) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(value)
}

const proceedCheckout = () => {
  closeDrawer()
  router.push('/checkout')
}

const goShop = () => {
  closeDrawer()
  router.push('/tienda')
}
</script>

<style scoped>
/* Backdrop */
.cart-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(13, 12, 11, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 2000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s var(--ease);
}
.cart-backdrop.open {
  opacity: 1;
  pointer-events: auto;
}

/* Drawer */
.cart-drawer {
  position: fixed;
  top: 0; right: 0; bottom: 0;
  width: 100%;
  max-width: 440px;
  background: var(--c-white);
  z-index: 2001;
  transform: translateX(100%);
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 24px rgba(0,0,0,0.05);
}
.cart-drawer.open {
  transform: translateX(0);
}

/* Header */
.cart-header {
  padding: 32px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--c-border);
}
.cart-title {
  font-family: var(--font-serif);
  font-size: 24px;
  font-weight: 400;
  color: var(--c-dark);
}
.cart-close {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--c-muted);
  transition: color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cart-close:hover {
  color: var(--c-dark);
}

/* Body */
.cart-body {
  flex: 1;
  overflow-y: auto;
  padding: 40px;
}
.cart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 24px;
  color: var(--c-muted);
  text-align: center;
}
.cart-empty p {
  font-size: 15px;
}

/* Items */
.cart-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 20px;
}
.item-img {
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  background: var(--c-light);
  filter: grayscale(15%);
}
.item-info {
  display: flex;
  flex-direction: column;
}
.item-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.item-category {
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--c-brand);
}
.item-remove {
  background: none;
  border: none;
  font-size: 9px;
  color: var(--c-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  padding: 0;
}
.item-remove:hover {
  color: var(--c-dark);
  text-decoration: underline;
}
.item-name {
  font-family: var(--font-serif);
  font-size: 18px;
  font-weight: 400;
  color: var(--c-dark);
  margin-bottom: 8px;
}
.item-options {
  font-size: 11px;
  color: var(--c-mid);
  margin-bottom: 12px;
}
.item-bottom {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}
.item-qty {
  color: var(--c-muted);
}
.item-price {
  color: var(--c-dark);
  font-weight: 500;
}

/* Footer */
.cart-footer {
  padding: 32px 40px;
  border-top: 1px solid var(--c-border);
  background: var(--c-off-white);
}
.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  color: var(--c-dark);
  margin-bottom: 16px;
}
.total-price {
  font-family: var(--font-serif);
  font-size: 22px;
}
.cart-note {
  font-size: 11px;
  color: var(--c-mid);
  margin-bottom: 24px;
  line-height: 1.5;
}
.cart-checkout {
  width: 100%;
  padding: 16px;
  justify-content: center;
}

@media (max-width: 500px) {
  .cart-drawer { max-width: 100%; }
  .cart-header { padding: 24px; }
  .cart-body { padding: 24px; }
  .cart-footer { padding: 24px; }
}
</style>
