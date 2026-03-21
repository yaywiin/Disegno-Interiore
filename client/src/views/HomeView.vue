<template>
  <main class="home">

    <!-- ========= HERO SLIDER ========= -->
    <section class="hero" @mouseenter="pauseSlider" @mouseleave="resumeSlider">

      <!-- Slides stack -->
      <div class="slides-wrapper">
        <div
          v-for="(slide, i) in slides"
          :key="slide.id"
          class="slide"
          :class="{ active: current === i, prev: prev === i }"
        >
          <img :src="slide.img" :alt="slide.alt" class="slide-img" />
          <div class="slide-overlay"></div>
        </div>
      </div>

      <!-- Content layer -->
      <div class="hero-content container">
        <!-- Left: text -->
        <div class="hero-text">
          <div class="hero-eyebrow">
            <span class="hero-label">{{ slides[current].label }}</span>
            <span class="hero-divider"></span>
            <span class="slide-counter">
              <em>{{ String(current + 1).padStart(2, '0') }}</em>
              <span class="counter-sep">/</span>
              {{ String(slides.length).padStart(2, '0') }}
            </span>
          </div>

          <transition name="slide-text" mode="out-in">
            <h1 class="hero-title" :key="current">
              {{ slides[current].title }}<br>
              <em>{{ slides[current].subtitle }}</em>
            </h1>
          </transition>

          <transition name="slide-sub" mode="out-in">
            <p class="hero-sub" :key="'sub-' + current">
              {{ slides[current].desc }}
            </p>
          </transition>

          <div class="hero-actions">
            <router-link to="/tienda" class="btn btn-outline-light">
              <span>Explorar colección</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </router-link>
          </div>
        </div>

        <!-- Right: nav -->
        <div class="hero-nav">
          <button class="hero-arrow up" @click="changeSlide(-1)" aria-label="Slide anterior">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
          </button>

          <!-- Progress dots -->
          <div class="hero-dots">
            <button
              v-for="(slide, i) in slides"
              :key="i"
              class="dot"
              :class="{ active: current === i }"
              @click="goTo(i)"
              :aria-label="`Ir a diapositiva ${i + 1}`"
            >
              <span class="dot-fill" :style="current === i ? { width: progressWidth + '%' } : {}"></span>
            </button>
          </div>

          <button class="hero-arrow down" @click="changeSlide(1)" aria-label="Siguiente slide">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
          </button>
        </div>
      </div>

      <!-- Brand watermark -->
      <div class="hero-watermark">DI</div>

      <!-- Scroll indicator -->
      <div class="scroll-indicator">
        <div class="scroll-line"></div>
        <span>Scroll</span>
      </div>
    </section>

    <!-- ========= MARQUEE ========= -->
    <div class="marquee-section">
      <div class="marquee-track">
        <div class="marquee-content" v-for="n in 2" :key="n">
          <span class="marquee-item" v-for="word in marqueeWords" :key="word">{{ word }}</span>
        </div>
      </div>
    </div>

    <!-- ========= FEATURED ========= -->
    <section class="section featured">
      <div class="container">
        <div class="section-header">
          <span class="label reveal">Colecciones destacadas</span>
          <span class="brand-line reveal delay-1"></span>
          <h2 class="section-title reveal delay-2">Diseño que<br>perdura en el tiempo</h2>
        </div>

        <div class="featured-grid">
          <div
            v-for="(item, i) in featured"
            :key="item.id"
            class="featured-card reveal"
            :class="`delay-${i + 1}`"
          >
            <div class="card-img-wrap">
              <img :src="item.img" :alt="item.name" class="card-img" />
              <div class="card-overlay">
                <router-link to="/tienda" class="btn btn-outline-light card-btn">Ver pieza</router-link>
              </div>
              <span class="card-index">0{{ i + 1 }}</span>
            </div>
            <div class="card-info">
              <div class="card-info-top">
                <span class="card-cat label">{{ item.category }}</span>
              </div>
              <h3 class="card-name">{{ item.name }}</h3>
            </div>
          </div>
        </div>

        <div class="featured-cta reveal">
          <router-link to="/tienda" class="btn btn-outline">Ver catálogo completo</router-link>
        </div>
      </div>
    </section>

    <!-- ========= PHILOSOPHY ========= -->
    <section class="section philosophy">
      <div class="container philosophy-inner">
        <div class="philosophy-img-wrap reveal-left">
          <img src="/about_workshop.png" alt="Taller artesanal" class="philosophy-img" />
          <div class="philosophy-accent"></div>
        </div>
        <div class="philosophy-text">
          <span class="label reveal">Nuestra filosofía</span>
          <span class="brand-line reveal delay-1"></span>
          <h2 class="section-title reveal delay-2">Cada pieza,<br>una obra de arte</h2>
          <p class="reveal delay-3">
            En Disegno Interiore creemos que el mobiliario no es solo función — es identidad. Trabajamos con los maestros artesanos más selectos, usando materiales nobles para crear piezas que se convierten en herencia.
          </p>
          <router-link to="/nosotros" class="btn btn-outline reveal delay-4" style="margin-top: 40px; align-self: flex-start;">
            Conocernos más
          </router-link>
        </div>
      </div>
    </section>

    <!-- ========= STATS ========= -->
    <section class="stats-section">
      <div class="container stats-grid">
        <div class="stat reveal" v-for="(stat, i) in stats" :key="stat.label" :class="`delay-${i+1}`">
          <span class="stat-num">{{ stat.num }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </section>

    <!-- ========= CONTACT CTA ========= -->
    <section class="section contact-cta">
      <div class="container cta-inner">
        <span class="label reveal">¿Listo para transformar tu espacio?</span>
        <span class="brand-line reveal delay-1"></span>
        <h2 class="cta-title reveal delay-2">Agenda una visita<br>a nuestra sala de exhibición</h2>
        <p class="reveal delay-3">Nuestros asesores de diseño te acompañarán en cada decisión.</p>
        <router-link to="/contacto" class="btn btn-primary reveal delay-4"><span>Contactar ahora</span></router-link>
      </div>
    </section>

  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRevealAnimation } from '../composables/useRevealAnimation'
useRevealAnimation()

// ─── Slider logic ───────────────────────────────────────────────
const slides = [
  {
    id: 1,
    img: '/hero_furniture.png',
    alt: 'Sala de diseño contemporáneo',
    label: 'Colección Sala',
    title: 'El espacio,',
    subtitle: 'redefinido.',
    desc: 'Piezas concebidas para quienes entienden\nque el hogar es una forma de expresión.',
  },
  {
    id: 2,
    img: '/product_dining.png',
    alt: 'Comedor de alta gama',
    label: 'Colección Comedor',
    title: 'La mesa,',
    subtitle: 'un ritual.',
    desc: 'Maderas nobles que transforman cada comida\nen una experiencia de diseño.',
  },
  {
    id: 3,
    img: '/product_bedroom.png',
    alt: 'Recámara de lujo',
    label: 'Colección Recámara',
    title: 'El descanso,',
    subtitle: 'elevado.',
    desc: 'Ambientes pensados para el reposo absoluto,\ndiseñados con materiales de primera.',
  },
  {
    id: 4,
    img: '/product_office.png',
    alt: 'Oficina de diseño',
    label: 'Colección Oficina',
    title: 'El trabajo,',
    subtitle: 'con estilo.',
    desc: 'Espacios de trabajo que inspiran productividad\nsin sacrificar la elegancia.',
  },
]

const current = ref(0)
const prev = ref(-1)
const progressWidth = ref(0)
const SLIDE_DURATION = 6000
const PROGRESS_INTERVAL = 60

let autoTimer = null
let progressTimer = null
let paused = false

const startProgress = () => {
  progressWidth.value = 0
  clearInterval(progressTimer)
  progressTimer = setInterval(() => {
    if (paused) return
    progressWidth.value += (PROGRESS_INTERVAL / SLIDE_DURATION) * 100
    if (progressWidth.value >= 100) {
      progressWidth.value = 100
    }
  }, PROGRESS_INTERVAL)
}

const startAutoSlide = () => {
  clearTimeout(autoTimer)
  autoTimer = setTimeout(() => {
    if (!paused) changeSlide(1)
    startAutoSlide()
  }, SLIDE_DURATION)
}

const goTo = (index) => {
  prev.value = current.value
  current.value = index
  startProgress()
  clearTimeout(autoTimer)
  startAutoSlide()
}

const changeSlide = (dir) => {
  const next = (current.value + dir + slides.length) % slides.length
  goTo(next)
}

const pauseSlider = () => { paused = true }
const resumeSlider = () => { paused = false }

onMounted(() => {
  startProgress()
  startAutoSlide()
})
onUnmounted(() => {
  clearTimeout(autoTimer)
  clearInterval(progressTimer)
})

// ─── Other data ──────────────────────────────────────────────────
const marqueeWords = [
  '— Sala', '— Comedor', '— Recámara', '— Oficina', '— Exterior',
  '— Artesanal', '— Diseño', '— Interiores', '— Contemporáneo', '— Exclusivo'
]

const featured = [
  { id: 1, name: 'Sofá Onyx', category: 'Sala', img: '/product_living.png' },
  { id: 2, name: 'Comedor Nogal', category: 'Comedor', img: '/product_dining.png' },
  { id: 3, name: 'Suite Serena', category: 'Recámara', img: '/product_bedroom.png' },
  { id: 4, name: 'Escritorio Axis', category: 'Oficina', img: '/product_office.png' },
]

const stats = [
  { num: '2,500+', label: 'Piezas creadas' },
  { num: '15', label: 'Artesanos maestros' },
  { num: '98%', label: 'Clientes satisfechos' },
  { num: '25', label: 'Años de experiencia' },
]
</script>

<style scoped>
/* ================================================================
   HERO SLIDER
================================================================ */
.hero {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 700px;
  overflow: hidden;
  background: var(--c-dark);
}

/* ---- Slides ---- */
.slides-wrapper {
  position: absolute;
  inset: 0;
}
.slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}
.slide.active {
  opacity: 1;
  pointer-events: auto;
  z-index: 2;
}
.slide.prev {
  opacity: 0;
  z-index: 1;
}
.slide-img {
  width: 100%; height: 100%;
  object-fit: cover;
  transform: scale(1.04);
  transition: transform 8s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide.active .slide-img {
  transform: scale(1);
}
.slide-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    rgba(13, 12, 11, 0.78) 0%,
    rgba(13, 12, 11, 0.45) 55%,
    rgba(13, 12, 11, 0.12) 100%
  );
}

/* ---- Content ---- */
.hero-content {
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-bottom: 80px;
  padding-top: 120px;
  gap: 40px;
}

/* ---- Text block ---- */
.hero-text {
  max-width: 660px;
  display: flex;
  flex-direction: column;
}

.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
}
.hero-label {
  font-family: var(--font-sans);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--c-brand-light);
}
.hero-divider {
  display: block;
  width: 40px;
  height: 1px;
  background: rgba(255,255,255,0.2);
  flex-shrink: 0;
}
.slide-counter {
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 300;
  color: rgba(255,255,255,0.3);
  letter-spacing: 0.12em;
}
.slide-counter em {
  font-style: normal;
  color: rgba(255,255,255,0.7);
  font-size: 14px;
}
.counter-sep {
  margin: 0 4px;
  opacity: 0.4;
}

.hero-title {
  font-family: var(--font-serif);
  font-size: clamp(58px, 7.5vw, 110px);
  font-weight: 400;
  color: var(--c-white);
  line-height: 1.0;
  margin-bottom: 28px;
}
.hero-title em {
  font-style: italic;
  color: var(--c-brand-light);
}

.hero-sub {
  font-size: 15px;
  color: rgba(255,255,255,0.55);
  line-height: 1.8;
  margin-bottom: 48px;
  white-space: pre-line;
}

.hero-actions {
  display: flex;
  gap: 16px;
}

/* ---- Text transitions ---- */
.slide-text-enter-active {
  transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-text-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.slide-text-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.slide-text-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}

.slide-sub-enter-active {
  transition: opacity 0.7s ease 0.15s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
}
.slide-sub-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.slide-sub-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.slide-sub-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ---- Nav / dots ---- */
.hero-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
  padding-bottom: 4px;
}

.hero-arrow {
  width: 44px; height: 44px;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.3s, color 0.3s, background 0.3s;
  backdrop-filter: blur(8px);
}
.hero-arrow:hover {
  border-color: var(--c-brand);
  color: var(--c-brand-light);
  background: rgba(155,152,97,0.08);
}

.hero-dots {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.dot {
  width: 2px;
  height: 32px;
  background: rgba(255,255,255,0.15);
  position: relative;
  cursor: pointer;
  border: none;
  padding: 0;
  transition: background 0.3s;
  overflow: hidden;
}
.dot.active {
  background: rgba(255,255,255,0.1);
}
.dot-fill {
  position: absolute;
  top: 0; left: 0;
  height: 100%;
  width: 0%;
  background: var(--c-brand-light);
  transition: width 0.06s linear;
}
.dot.active .dot-fill { display: block; }

/* ---- Brand watermark ---- */
.hero-watermark {
  position: absolute;
  right: -40px;
  bottom: 80px;
  font-family: var(--font-serif);
  font-size: clamp(80px, 12vw, 180px);
  font-weight: 400;
  font-style: italic;
  color: rgba(255,255,255,0.03);
  letter-spacing: -0.02em;
  line-height: 1;
  pointer-events: none;
  z-index: 3;
  user-select: none;
}

/* ---- Scroll indicator ---- */
.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: rgba(255,255,255,0.3);
  font-size: 9px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  animation: fadeInUp 1.2s 2s both;
}
.scroll-line {
  width: 1px;
  height: 48px;
  background: linear-gradient(to bottom, transparent, var(--c-brand));
  animation: scrollPulse 2.5s ease-in-out infinite;
}
@keyframes scrollPulse {
  0%, 100% { opacity: 0.25; transform: scaleY(1); }
  50% { opacity: 1; transform: scaleY(1.1); }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translate(-50%, 14px); }
  to   { opacity: 1; transform: translate(-50%, 0); }
}

/* ================================================================
   MARQUEE
================================================================ */
.marquee-section {
  overflow: hidden;
  border-top: 1px solid var(--c-border);
  border-bottom: 1px solid var(--c-border);
  background: var(--c-off-white);
  padding: 16px 0;
}
.marquee-track {
  display: flex;
  animation: marquee 40s linear infinite;
}
.marquee-content {
  display: flex;
  flex-shrink: 0;
}
.marquee-item {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--c-brand);
  padding: 0 36px;
  white-space: nowrap;
  opacity: 0.65;
}
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* ================================================================
   SECTION SHARED
================================================================ */
.section-header { margin-bottom: 72px; }
.section-title {
  font-family: var(--font-serif);
  font-size: clamp(38px, 4.5vw, 64px);
  font-weight: 400;
  color: var(--c-dark);
  line-height: 1.1;
  margin-top: 0;
}

/* ================================================================
   FEATURED GRID
================================================================ */
.featured-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2px;
}
.featured-card { cursor: pointer; }
.card-img-wrap {
  position: relative;
  overflow: hidden;
  aspect-ratio: 3/4;
  background: var(--c-light);
}
.card-img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.8s var(--ease);
  filter: grayscale(15%);
}
.featured-card:hover .card-img {
  transform: scale(1.05);
  filter: grayscale(0%);
}
.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(13,12,11,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.4s;
}
.featured-card:hover .card-overlay { opacity: 1; }
.card-btn { font-size: 10px; padding: 11px 28px; }
.card-index {
  position: absolute;
  bottom: 16px;
  right: 16px;
  font-family: var(--font-serif);
  font-size: 11px;
  color: rgba(255,255,255,0.3);
  letter-spacing: 0.1em;
}
.card-info { padding: 20px 0 0; background: var(--c-white); }
.card-info-top { margin-bottom: 8px; }
.card-cat { display: block; }
.card-name {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 400;
  color: var(--c-dark);
  line-height: 1.2;
}

.featured-cta {
  margin-top: 64px;
  display: flex;
  justify-content: center;
}

/* ================================================================
   PHILOSOPHY
================================================================ */
.philosophy { background: var(--c-off-white); }
.philosophy-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 100px;
  align-items: center;
}
.philosophy-img-wrap { position: relative; }
.philosophy-img {
  width: 100%;
  aspect-ratio: 4/5;
  object-fit: cover;
  display: block;
}
.philosophy-accent {
  position: absolute;
  bottom: -20px; right: -20px;
  width: 55%; height: 55%;
  border: 1px solid var(--c-brand);
  opacity: 0.25;
  pointer-events: none;
}
.philosophy-text {
  display: flex;
  flex-direction: column;
}
.philosophy-text p { font-size: 15px; color: var(--c-muted); margin-bottom: 0; }

/* ================================================================
   STATS
================================================================ */
.stats-section {
  background: var(--c-dark);
  padding: 80px 0;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  text-align: center;
}
.stat { display: flex; flex-direction: column; gap: 10px; }
.stat-num {
  font-family: var(--font-serif);
  font-size: clamp(40px, 4.5vw, 64px);
  font-weight: 400;
  color: var(--c-brand-light);
  line-height: 1;
}
.stat-label {
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: white;
}

/* ================================================================
   CONTACT CTA
================================================================ */
.contact-cta {
  text-align: center;
  background: var(--c-white);
}
.cta-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.cta-title {
  font-family: var(--font-serif);
  font-size: clamp(38px, 4.5vw, 64px);
  font-weight: 400;
  color: var(--c-dark);
  line-height: 1.1;
  margin-bottom: 20px;
}
.cta-inner p { font-size: 15px; margin-bottom: 44px; }

/* ================================================================
   RESPONSIVE
================================================================ */
@media (max-width: 1100px) {
  .featured-grid { grid-template-columns: repeat(2, 1fr); }
  .hero-nav { display: none; }
}
@media (max-width: 768px) {
  .philosophy-inner { grid-template-columns: 1fr; gap: 60px; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
  .featured-grid { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: 1fr; }
  .philosophy-accent { display: none; }
  .hero-title { font-size: clamp(48px, 12vw, 80px); }
}
</style>
