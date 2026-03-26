<template>
  <main class="product-view">
    <div v-if="product" class="product-container">
      
      <!-- Back Link -->
      <div class="breadcrumb">
        <router-link to="/tienda" class="back-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver a tienda
        </router-link>
      </div>

      <div class="product-grid">
        <!-- Image Section -->
        <div class="product-imagery reveal-left">
          <div class="main-image">
            <span v-if="product.badge" class="badge">{{ product.badge }}</span>
            <img :src="selectedImage || product.img" :alt="product.name" class="img-fluid" />
          </div>
          <div v-if="product.gallery && product.gallery.length > 1" class="thumbnail-gallery">
            <button 
              v-for="img in product.gallery" 
              :key="img" 
              class="thumbnail-btn" 
              :class="{ active: selectedImage === img }"
              @click="selectedImage = img"
            >
              <img :src="img" :alt="product.name" class="thumb-img" />
            </button>
          </div>
        </div>

        <!-- Info Section -->
        <div class="product-info reveal-right delay-2">
          <span class="product-category">{{ product.category }}</span>
          <h1 class="product-title">{{ product.name }}</h1>
          <div class="product-pricing">
            <span v-if="product.originalPrice" class="product-price-original" style="font-size:14px; color:var(--c-muted); text-decoration:line-through; margin-right: 8px;">
              {{ formatPrice(product.originalPrice) }}
            </span>
            <span class="product-price">{{ formatPrice(product.price) }}</span>
          </div>

          <p class="product-desc">{{ product.desc }}</p>

          <!-- Divider -->
          <div class="divider"></div>

          <!-- Options -->
          <div class="product-options">
            <div class="option-row">
              <div v-if="product.sizes && product.sizes.length" class="option-group">
                <label class="option-label">Tamaño</label>
                <div class="material-pills">
                  <button
                    v-for="size in product.sizes"
                    :key="size"
                    class="pill"
                    :class="{ active: selectedSize === size }"
                    @click="selectedSize = size"
                  >
                    {{ size }}
                  </button>
                </div>
              </div>

              <div v-if="product.colors && product.colors.length" class="option-group">
                <label class="option-label">Color</label>
                <div class="color-swatches">
                  <button
                    v-for="color in product.colors"
                    :key="color.name"
                    class="swatch-btn"
                    :class="{ active: selectedColor?.name === color.name }"
                    :title="color.name"
                    @click="selectedColor = color"
                  >
                    <span class="swatch-color" :style="{ backgroundColor: color.hex }"></span>
                  </button>
                </div>
              </div>
            </div>

            <div class="option-group">
              <label class="option-label">Materiales disponibles</label>
              <div class="material-pills">
                <button
                  v-for="mat in product.materials"
                  :key="mat"
                  class="pill"
                  :class="{ active: selectedMaterial === mat }"
                  @click="selectedMaterial = mat"
                >
                  {{ mat }}
                </button>
              </div>
            </div>

            <div class="option-group">
              <label class="option-label">Cantidad (Disponibles: {{ product.stock }})</label>
              <div class="qty-selector">
                 <button @click="quantity > 1 ? quantity-- : null" :disabled="quantity <= 1">−</button>
                <span>{{ quantity }}</span>
                <button @click="quantity < product.stock ? quantity++ : null" :disabled="quantity >= product.stock">+</button>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="product-actions">
            <button class="btn btn-primary add-to-cart agregar-al-carrito" @click="handleAddToCart">
              Añadir a selección
            </button>
            <p class="shipping-note">Tiempo de entrega estimado: 4 a 6 semanas. Piezas hechas a mano bajo pedido.</p>
          </div>

          <!-- Details Accordion -->
          <div class="details-section">
            <div class="detail-item">
              <span class="detail-title">Dimensiones</span>
              <p class="detail-text">Diseño hecho a medida. Consulta con un asesor para los detalles exactos del espacio que requiere.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="container not-found">
      <h2 class="section-title">Pieza no encontrada</h2>
      <router-link to="/tienda" class="btn btn-outline">Volver a catálogo</router-link>
    </div>
  </main>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useProducts } from '../composables/useProducts'
import { useCart } from '../composables/useCart'
import { useRevealAnimation } from '../composables/useRevealAnimation'

useRevealAnimation()

const route = useRoute()
const { getProductById, loading } = useProducts()
const { addItemToCart, openDrawer } = useCart()

const product          = ref(null)
const selectedMaterial = ref('')
const quantity         = ref(1)
const selectedImage    = ref('')
const selectedSize     = ref('')
const selectedColor    = ref(null)

const API = 'http://localhost:3001/api/public'

const formatPrice = (value) => {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value)
}

function mapRaw(raw) {
  return {
    id: raw.id, name: raw.nombre,
    category: raw.categorias?.[0] || 'Sin categoría',
    img:  raw.imagen_principal || '/product_living.png',
    gallery: raw.galeria?.length > 0 ? raw.galeria : (raw.imagen_principal ? [raw.imagen_principal] : ['/product_living.png']),
    badge:    raw.descuento > 0 ? `-${raw.descuento}%` : null,
    desc:     raw.descripcion || '',
    materials: raw.materiales || [],
    sizes:    raw.tamanios || [],
    colors:   (raw.colores || []).map(c => {
      const str = String(c)
      const hexMatch = str.match(/#([0-9a-fA-F]{3,6})/)
      return { name: str.replace(/·?\s*#[0-9a-fA-F]{3,6}/, '').trim() || str, hex: hexMatch ? hexMatch[0] : '#888888' }
    }),
    price: raw.descuento > 0 ? (raw.precio - (raw.precio * raw.descuento / 100)) : parseFloat(raw.precio) || 0,
    originalPrice: raw.descuento > 0 ? parseFloat(raw.precio) : null,
    stock: raw.stock || 0,
    ancho: raw.ancho || 0, alto: raw.alto || 0, profundidad: raw.profundidad || 0,
  }
}

async function loadProduct() {
  const id = route.params.id
  let found = getProductById(id)

  if (!found) {
    try {
      const res = await fetch(`${API}/productos/${id}`)
      if (res.ok) found = mapRaw(await res.json())
    } catch (e) { console.error('Error al cargar producto:', e) }
  }

  product.value = found || null
  if (product.value) {
    selectedMaterial.value = product.value.materials[0] || ''
    selectedImage.value    = product.value.gallery?.[0] || product.value.img
    selectedSize.value     = product.value.sizes?.[0] || ''
    selectedColor.value    = product.value.colors?.[0] || null
    quantity.value = 1
    await nextTick()
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => el.classList.add('visible'))
  }
}

watch(() => route.params.id, loadProduct)
watch(loading, isLoading => { if (!isLoading) loadProduct() })
onMounted(loadProduct)

const handleAddToCart = () => {
  if (!product.value) return
  addItemToCart(product.value, quantity.value, {
    material: selectedMaterial.value, size: selectedSize.value, color: selectedColor.value?.name
  })
  openDrawer()
}
</script>

<style scoped>
.product-view {
  padding: 180px 0 100px;
  background: var(--c-white);
  min-height: 100vh;
}

.product-container {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 clamp(24px, 5vw, 88px);
}

.breadcrumb {
  margin-bottom: 40px;
}
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--c-mid);
  transition: color 0.3s;
}
.back-link:hover { color: var(--c-dark); }

.product-grid {
  display: grid;
  grid-template-columns: 1fr 440px;
  gap: 120px;
  align-items: start;
}

/* Imagery */
.main-image {
  position: relative;
  background: var(--c-light);
  overflow: hidden;
  aspect-ratio: 4/5;
}
.img-fluid {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(12%);
  transition: transform 1s var(--ease), filter 0.5s;
}
.main-image:hover .img-fluid {
  transform: scale(1.02);
  filter: grayscale(0%);
}
.thumbnail-gallery {
  display: flex;
  gap: 16px;
  margin-top: 16px;
  overflow-x: auto;
  padding-bottom: 8px; /* For scrollbar if many */
}
.thumbnail-btn {
  width: 80px;
  height: 80px;
  border: 1px solid var(--c-border);
  background: var(--c-light);
  cursor: pointer;
  padding: 0;
  transition: all 0.3s;
  opacity: 0.6;
}
.thumbnail-btn:hover {
  opacity: 1;
}
.thumbnail-btn.active {
  border-color: var(--c-dark);
  opacity: 1;
}
.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(12%);
}
.badge {
  position: absolute;
  top: 24px; left: 24px;
  background: var(--c-white);
  color: var(--c-dark);
  padding: 6px 16px;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  z-index: 10;
}

/* Info */
.product-category {
  display: block;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--c-brand);
  margin-bottom: 24px;
}
.product-title {
  font-family: var(--font-serif);
  font-size: clamp(38px, 4vw, 56px);
  font-weight: 400;
  color: var(--c-dark);
  line-height: 1.1;
  margin-bottom: 16px;
}
.product-price {
  font-size: 20px;
  color: var(--c-dark);
  margin-bottom: 32px;
}
.product-desc {
  font-size: 15px;
  color: var(--c-muted);
  line-height: 1.7;
  margin-bottom: 40px;
}

.divider {
  height: 1px;
  background: var(--c-border);
  margin: 40px 0;
}

.option-group {
  margin-bottom: 36px;
}
.option-label {
  display: block;
  font-size: 11px;
  color: var(--c-dark);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 16px;
}

/* Pills */
.material-pills {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.pill {
  background: none;
  border: 1px solid var(--c-border);
  padding: 14px 24px;
  font-size: 12px;
  color: var(--c-muted);
  cursor: pointer;
  transition: all 0.3s;
}
.pill:hover { border-color: var(--c-mid); color: var(--c-dark); }
.pill.active {
  border-color: var(--c-brand-dark);
  background: var(--c-brand-faint);
  color: var(--c-brand-dark);
}

.option-row {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  margin-bottom: 36px;
}
.option-row .option-group {
  margin-bottom: 0;
}

/* Color Swatches */
.color-swatches {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.swatch-btn {
  background: none;
  border: 1px solid transparent;
  padding: 4px;
  border-radius: 50%;
  cursor: pointer;
  transition: border-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.swatch-btn:hover {
  border-color: var(--c-mid);
}
.swatch-btn.active {
  border-color: var(--c-dark);
}
.swatch-color {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: block;
  border: 1px solid rgba(0,0,0,0.1);
}

/* Qty */
.qty-selector {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--c-border);
  height: 48px;
}
.qty-selector button {
  background: none;
  border: none;
  width: 48px; height: 100%;
  font-size: 18px;
  cursor: pointer;
  color: var(--c-mid);
  transition: color 0.3s;
}
.qty-selector button:hover { color: var(--c-dark); }
.qty-selector span {
  width: 32px;
  text-align: center;
  font-size: 14px;
  color: var(--c-dark);
}

.add-to-cart {
  width: 100%;
  padding: 20px;
  justify-content: center;
  margin-bottom: 24px;
}
.shipping-note {
  font-size: 12px;
  color: var(--c-mid);
  line-height: 1.6;
}

.details-section {
  margin-top: 60px;
  border-top: 1px solid var(--c-border);
}
.detail-item {
  padding: 24px 0;
  border-bottom: 1px solid var(--c-border);
}
.detail-title {
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--c-dark);
  margin-bottom: 12px;
}
.detail-text {
  font-size: 14px;
  color: var(--c-muted);
  line-height: 1.6;
}

/* Not found */
.not-found {
  text-align: center;
  padding: 100px 0;
}

@media (max-width: 1100px) {
  .product-grid { gap: 60px; }
}
@media (max-width: 900px) {
  .product-grid { grid-template-columns: 1fr; }
  .product-imagery { max-width: 600px; margin: 0 auto; }
}
</style>
