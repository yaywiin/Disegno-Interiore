<template>
  <main class="tienda">
    <!-- PAGE HERO -->
    <section class="page-hero">
      <div class="container page-hero-content">
        <span class="label reveal">Colecciones</span>
        <span class="brand-line reveal delay-1"></span>
        <h1 class="page-hero-title reveal delay-2">Nuestra tienda</h1>
        <p class="reveal delay-3">Cada pieza, una expresión de arte y funcionalidad.</p>
      </div>
    </section>

    <!-- FILTERS & SEARCH -->
    <section class="filters-bar">
      <div class="container filters-inner">
        <div class="filter-pills">
          <button
            v-for="cat in categories"
            :key="cat"
            class="pill"
            :class="{ active: activeCategory === cat }"
            @click="activeCategory = cat"
          >
            {{ cat }}
          </button>
        </div>
        <div class="search-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar pieza..."
            class="search-input"
          />
        </div>
      </div>
    </section>

    <!-- PRODUCT GRID -->
    <section class="store-grid-section">
      <div class="container">
        <p class="results-count">{{ filteredProducts.length }} piezas encontradas</p>
        <div class="products-grid" v-if="filteredProducts.length">
          <router-link
            class="product-card reveal"
            :class="`delay-${(i % 4) + 1}`"
            v-for="(p, i) in filteredProducts"
            :key="p.id"
            :to="`/tienda/${p.id}`"
          >
            <div class="product-img-wrap">
              <img :src="p.img" :alt="p.name" class="product-img" />
              <div class="product-overlay">
                <span class="btn btn-outline-light product-btn">Ver detalles</span>
              </div>
              <div class="product-badge" v-if="p.badge">{{ p.badge }}</div>
            </div>
            <div class="product-info">
              <div class="product-header">
                <span class="card-cat label">{{ p.category }}</span>
              </div>
              <h3 class="product-name">{{ p.name }}</h3>
              <p class="product-desc">{{ p.desc }}</p>
              <div class="product-footer">
                <div class="material-tag" v-for="m in p.materials" :key="m">{{ m }}</div>
              </div>
              <p class="product-price" style="margin-top:16px; font-weight:500; font-size:14px; color:var(--c-dark);">
                {{ formatPrice(p.price) }}
              </p>
            </div>
          </router-link>
        </div>
        <div class="empty-state" v-else>
          <span class="empty-icon">◇</span>
          <p>No se encontraron piezas con ese criterio.</p>
        </div>
      </div>
    </section>

    <!-- CTA BANNER -->
    <section class="custom-cta">
      <div class="container custom-cta-inner">
        <div class="custom-cta-text">
          <span class="label reveal">¿No encuentras lo que buscas?</span>
          <span class="brand-line reveal delay-1"></span>
          <h2 class="reveal delay-2">Diseñamos a tu medida</h2>
          <p class="reveal delay-3">Cuéntanos tu visión y nuestros artesanos la harán realidad.</p>
        </div>
        <router-link to="/contacto" class="btn btn-primary reveal delay-4"><span>Solicitar pieza custom</span></router-link>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRevealAnimation } from '../composables/useRevealAnimation'
import { useProducts } from '../composables/useProducts'

useRevealAnimation()
const { products } = useProducts()

const activeCategory = ref('Todos')
const searchQuery = ref('')

const categories = ['Todos', 'Sala', 'Comedor', 'Recámara', 'Oficina', 'Exterior']

const formatPrice = (value) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(value)
}

const filteredProducts = computed(() => {
  let result = products.value
  if (activeCategory.value !== 'Todos') {
    result = result.filter(p => p.category === activeCategory.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.materials.some(m => m.toLowerCase().includes(q))
    )
  }
  return result
})
</script>

<style scoped>
/* PAGE HERO */
.page-hero {
  padding: 172px 0 80px;
  background: var(--c-off-white);
  border-bottom: 1px solid var(--c-border);
}
.page-hero-title {
  font-family: var(--font-serif);
  font-size: clamp(46px, 6vw, 80px);
  font-weight: 400;
  color: var(--c-dark);
  line-height: 1.05;
  margin-bottom: 20px;
}
.page-hero p { font-size: 16px; color: var(--c-muted); }

/* FILTERS */
.filters-bar {
  position: sticky;
  top: 72px;
  z-index: 100;
  background: rgba(255,255,255,0.97);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--c-border);
  padding: 16px 0;
}
.filters-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}
.filter-pills { display: flex; gap: 6px; flex-wrap: wrap; }
.pill {
  padding: 8px 20px;
  border: 1px solid var(--c-border);
  background: transparent;
  color: var(--c-muted);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
}
.pill:hover { border-color: var(--c-brand); color: var(--c-dark); }
.pill.active {
  background: var(--c-dark);
  border-color: var(--c-dark);
  color: var(--c-white);
}

/* SEARCH */
.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--c-off-white);
  border: 1px solid var(--c-border);
  padding: 10px 16px;
  min-width: 240px;
}
.search-box svg { color: var(--c-muted); flex-shrink: 0; }
.search-input {
  background: none;
  border: none;
  outline: none;
  color: var(--c-dark);
  font-size: 13px;
  font-family: var(--font-sans);
  width: 100%;
}
.search-input::placeholder { color: var(--c-mid); }

/* RESULTS */
.store-grid-section {
  padding: clamp(56px, 8vw, 96px) 0;
}
.results-count {
  font-size: 11px;
  color: var(--c-mid);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 40px;
}

/* PRODUCTS GRID */
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}
.product-card { 
  cursor: pointer; 
  display: block;
  text-decoration: none;
  color: inherit;
}
.product-img-wrap {
  position: relative;
  overflow: hidden;
  aspect-ratio: 3/4;
  background: var(--c-light);
}
.product-img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.8s var(--ease);
  filter: grayscale(15%);
}
.product-card:hover .product-img {
  transform: scale(1.05);
  filter: grayscale(0%);
}
.product-overlay {
  position: absolute;
  inset: 0;
  background: rgba(13,12,11,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.4s;
}
.product-card:hover .product-overlay { opacity: 1; }
.product-btn { font-size: 10px; padding: 11px 24px; border: 1px solid var(--c-white); color: var(--c-white); }

@media (max-width: 1024px) {
  .product-overlay {
    opacity: 1;
    background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%);
    align-items: flex-end;
    padding-bottom: 20px;
  }
  .product-btn {
    display: none; /* Hide button on mobile, card is clickable */
  }
}

.product-badge {
  position: absolute;
  top: 16px; left: 16px;
  background: var(--c-brand);
  color: var(--c-white);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 5px 12px;
}
.product-info { padding: 20px 0 8px; }
.product-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.product-name {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 400;
  color: var(--c-dark);
  margin-bottom: 8px;
}
.product-desc {
  font-size: 13px;
  color: var(--c-muted);
  margin-bottom: 14px;
  line-height: 1.6;
}
.product-footer { display: flex; gap: 8px; flex-wrap: wrap; }
.material-tag {
  font-size: 9px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--c-muted);
  border: 1px solid var(--c-border);
  padding: 4px 11px;
}

/* EMPTY */
.empty-state {
  text-align: center;
  padding: 96px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.empty-icon {
  font-size: 44px;
  color: var(--c-mid);
}
.empty-state p { color: var(--c-muted); }

/* CUSTOM CTA */
.custom-cta {
  background: var(--c-dark);
  padding: 96px 0;
}
.custom-cta-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
  flex-wrap: wrap;
}
.custom-cta .label { color: var(--c-brand); }
.custom-cta-text h2 {
  font-family: var(--font-serif);
  font-size: clamp(30px, 3.5vw, 48px);
  font-weight: 400;
  color: var(--c-white);
  margin-bottom: 12px;
  line-height: 1.15;
}
.custom-cta-text p { font-size: 15px; max-width: 400px; color: rgba(255,255,255,0.4); }

/* RESPONSIVE */
@media (max-width: 1100px) {
  .products-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 768px) {
  .products-grid { grid-template-columns: repeat(2, 1fr); }
  .custom-cta-inner { flex-direction: column; }
}
@media (max-width: 480px) {
  .products-grid { grid-template-columns: 1fr; }
  .filters-inner { flex-direction: column; align-items: stretch; }
  .search-box { min-width: auto; }
}
</style>
