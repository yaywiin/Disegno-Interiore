<template>
  <main class="checkout-view">
    <div class="container checkout-container">
      <div v-if="cartItems.length > 0" class="checkout-grid">
        
        <!-- Left: Form -->
        <div class="checkout-form-wrap reveal-left">
          <div class="checkout-header">
            <span class="label">Paso 1 de 2</span>
            <span class="brand-line"></span>
            <h1 class="checkout-title">Datos de envío</h1>
          </div>

          <form class="checkout-form" @submit.prevent="submitOrder">
            <div class="form-row">
              <div class="form-group">
                <label>Nombre(s)</label>
                <input v-model="form.nombres" type="text" class="form-input" required placeholder="Ingresa tu nombre" />
              </div>
              <div class="form-group">
                <label>Apellidos</label>
                <input v-model="form.apellidos" type="text" class="form-input" required placeholder="Ingresa tus apellidos" />
              </div>
            </div>

             <div class="form-row">
               <div class="form-group">
                 <label>Correo Electrónico</label>
                 <input v-model="form.correo" type="email" class="form-input" required placeholder="tu@correo.com" />
               </div>
   
               <div class="form-group">
                 <label>Teléfono Movil</label>
                 <input v-model="form.telefono" type="tel" class="form-input" required placeholder="+52 55 0000 0000" />
               </div>
             </div>

            <div class="form-group" style="margin-top: 24px;">
              <span class="sub-label">Dirección de entrega</span>
            </div>

            <div class="form-group">
              <label>Calle y Número</label>
              <input v-model="form.calle" type="text" class="form-input" required placeholder="Ej: Av. Paseo de la Reforma 123" />
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Ciudad</label>
                <input v-model="form.ciudad" type="text" class="form-input" required placeholder="Ciudad" />
              </div>
              <div class="form-group">
                <label>Código Postal</label>
                <input v-model="form.cp" type="text" class="form-input" required placeholder="C.P." />
              </div>
            </div>

            <div class="form-group">
              <label>Estado</label>
              <select v-model="form.estado" class="form-input form-select" required>
                <option value="" disabled>Selecciona tu estado</option>
                <option value="CDMX">Ciudad de México</option>
                <option value="Jalisco">Jalisco</option>
                <option value="Nuevo Leon">Nuevo León</option>
                <option value="Queretaro">Querétaro</option>
                <option value="Otro">Otro (Cotizar envío por separado)</option>
              </select>
            </div>

            <div class="form-group" style="margin-top: 24px;">
              <span class="sub-label">Método de Pago</span>
            </div>

            <div class="form-row" style="margin-bottom: 32px">
              <label class="flex items-center gap-2 cursor-pointer p-4 border rounded-lg hover:border-black transition-colors" :class="{ 'border-black bg-gray-50': form.metodoPago === 'Tarjeta' }">
                <input type="radio" v-model="form.metodoPago" value="Tarjeta" name="metodo_pago" class="accent-black w-4 h-4 cursor-pointer" />
                <span class="text-sm">Pago con Tarjeta</span>
              </label>
              
              <label class="flex items-center gap-2 cursor-pointer p-4 border rounded-lg hover:border-black transition-colors" :class="{ 'border-black bg-gray-50': form.metodoPago === 'Transferencia' }">
                <input type="radio" v-model="form.metodoPago" value="Transferencia" name="metodo_pago" class="accent-black w-4 h-4 cursor-pointer" />
                <span class="text-sm">Transferencia SPEI</span>
              </label>
            </div>

            <button type="submit" class="btn btn-primary submit-btn" :disabled="isSubmitting">
              <span>Continuar con el pago seguro</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </button>
            <p class="secure-note">Tus datos están protegidos y cifrados en nuestro servidor mediante Stripe.</p>
          </form>
        </div>

        <!-- Right: Summary -->
        <aside class="order-summary reveal-right delay-2">
          <div class="summary-box">
            <h2 class="summary-title">Resumen de compra</h2>

            <ul class="summary-items">
              <li v-for="(item, i) in cartItems" :key="i" class="s-item">
                <div class="s-img-wrap">
                  <img :src="item.product.img" :alt="item.product.name" class="s-img" />
                  <span class="s-qty">{{ item.quantity }}</span>
                </div>
                <div class="s-info">
                  <span class="s-name">{{ item.product.name }}</span>
                  <span class="s-opt">{{ item.options.material }}</span>
                </div>
                <div class="s-price">{{ formatPrice(item.product.price * item.quantity) }}</div>
              </li>
            </ul>

            <div class="summary-totals">
              <div class="t-row">
                <span>Subtotal</span>
                <span>{{ formatPrice(cartTotal) }}</span>
              </div>
              <div class="t-row">
                <span>Envío</span>
                <span class="t-light">Calculando en el siguiente paso</span>
              </div>
              <div class="t-row grand-total">
                <span>Total</span>
                <span>{{ formatPrice(cartTotal) }} MXN</span>
              </div>
            </div>
            
            <div class="summary-perks">
              <div class="perk">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span>Garantía de fabricación 5 años</span>
              </div>
              <div class="perk">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                <span>Envío asegurado guante blanco</span>
              </div>
            </div>
          </div>
        </aside>

      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <h2 class="section-title">Tu carrito está vacío</h2>
        <p>No tienes artículos en tu selección por el momento.</p>
        <router-link to="/tienda" class="btn btn-outline" style="margin-top: 24px">Volver al catálogo</router-link>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useCart } from '../composables/useCart'
import { useRouter } from 'vue-router'
import { useRevealAnimation } from '../composables/useRevealAnimation'

useRevealAnimation()

const { cartItems, cartTotal, clearCart } = useCart()
const router = useRouter()
const isSubmitting = ref(false)

const form = ref({
  nombres: '',
  apellidos: '',
  correo: '',
  telefono: '',
  calle: '',
  ciudad: '',
  cp: '',
  estado: '',
  metodoPago: 'Tarjeta'
})

const formatPrice = (value) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(value)
}

const submitOrder = async () => {
  if (cartItems.value.length === 0) {
    alert('Tu carrito está vacío')
    return
  }
  
  isSubmitting.value = true
  
  const payload = {
    nombre_cliente: form.value.nombres,
    apellidos: form.value.apellidos,
    correo: form.value.correo,
    telefono: form.value.telefono,
    calle_numero: form.value.calle,
    ciudad: form.value.ciudad,
    codigo_postal: form.value.cp,
    estado_republica: form.value.estado,
    total: cartTotal.value,
    metodo_pago: form.value.metodoPago,
    productos: cartItems.value
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/public/pedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    
    if (response.ok) {
      alert('¡Pedido simulado con éxito! Tus datos y productos han sido capturados para el administrador.')
      clearCart()
      router.push('/')
    } else {
      alert('Hubo un error al procesar el pedido.')
    }
  } catch(e) {
    console.error('Error enviando orden:', e)
    alert('Fallo de conexión')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.checkout-view {
  padding: 160px 0 100px;
  background: var(--c-off-white);
  min-height: 100vh;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 480px;
  gap: 80px;
  align-items: start;
}

/* Form */
.checkout-header {
  margin-bottom: 40px;
}
.checkout-title {
  font-family: var(--font-serif);
  font-size: 42px;
  font-weight: 400;
  color: var(--c-dark);
  margin-top: 16px;
}

.checkout-form {
  background: var(--c-white);
  padding: 48px;
  border: 1px solid var(--c-border);
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.form-group {
  margin-bottom: 24px;
}
.form-group label {
  display: block;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--c-muted);
  margin-bottom: 8px;
}
.sub-label {
  font-family: var(--font-serif);
  font-size: 20px;
  color: var(--c-dark);
}
.form-input {
  width: 100%;
  padding: 14px 18px;
  border: 1px solid var(--c-border);
  background: var(--c-white);
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--c-dark);
  transition: border-color 0.3s;
  outline: none;
}
.form-input:focus { border-color: var(--c-brand); }
.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888580' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 18px center;
}

.submit-btn {
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
}
.submit-btn svg { opacity: 0.8; }
.secure-note {
  font-size: 11px;
  color: var(--c-mid);
  text-align: center;
  margin-top: 16px;
  line-height: 1.6;
}

/* Summary */
.summary-box {
  position: sticky;
  top: 120px;
}
.summary-title {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--c-brand-dark);
  margin-bottom: 32px;
}

.summary-items {
  list-style: none;
  padding: 0; margin: 0 0 32px 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.s-item {
  display: flex;
  align-items: center;
  gap: 20px;
}
.s-img-wrap {
  position: relative;
  width: 72px; height: 72px;
  border: 1px solid var(--c-border);
  background: var(--c-white);
}
.s-img {
  width: 100%; height: 100%;
  object-fit: cover;
  filter: grayscale(10%);
}
.s-qty {
  position: absolute;
  top: -8px; right: -8px;
  background: var(--c-brand-dark);
  color: var(--c-white);
  font-size: 10px;
  font-weight: 500;
  width: 20px; height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.s-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.s-name {
  font-family: var(--font-serif);
  font-size: 16px;
  color: var(--c-dark);
}
.s-opt {
  font-size: 11px;
  color: var(--c-mid);
}
.s-price {
  font-size: 14px;
  font-weight: 500;
  color: var(--c-dark);
}

.summary-totals {
  border-top: 1px solid var(--c-border);
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-size: 14px;
  color: var(--c-muted);
}
.t-row { display: flex; justify-content: space-between; align-items: center; }
.t-light { font-size: 11px; color: var(--c-mid); font-style: italic; }
.grand-total {
  font-family: var(--font-serif);
  font-size: 24px;
  color: var(--c-dark);
  margin-top: 8px;
  align-items: flex-end;
}

.summary-perks {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: rgba(155, 152, 97, 0.05); /* very light brand */
}
.perk {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  color: var(--c-brand-dark);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.empty-state { text-align: center; padding: 100px 0; }

@media (max-width: 1024px) {
  .checkout-grid { grid-template-columns: 1fr; gap: 60px; }
  .summary-box { position: static; }
}
@media (max-width: 600px) {
  .form-row { grid-template-columns: 1fr; }
  .checkout-form { padding: 32px 24px; }
}
</style>
