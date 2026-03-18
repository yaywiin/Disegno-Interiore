<template>
  <main class="about">
    <!-- PAGE HERO -->
    <section class="page-hero">
      <div class="page-hero-bg">
        <img src="/about_workshop.png" alt="Taller Disegno Interiore" />
        <div class="page-hero-overlay"></div>
      </div>
      <div class="container page-hero-content">
        <span class="label reveal">Nuestra historia</span>
        <span class="brand-line reveal delay-1"></span>
        <h1 class="page-hero-title reveal delay-2">Artesanía,<br><em>tradición e identidad</em></h1>
      </div>
    </section>

    <!-- INTRO -->
    <section class="section intro">
      <div class="container intro-grid">
        <div class="intro-text">
          <span class="label reveal">Desde 2000</span>
          <span class="brand-line reveal delay-1"></span>
          <h2 class="section-title reveal delay-2">Creados para durar,<br>diseñados para asombrar</h2>
          <p class="reveal delay-3">
            Disegno Interiore nació de la convicción de que el hogar merece ser un santuario. Nos especializamos en muebles de autor, creados con materiales nobles y técnicas artesanales que abrazan la estética contemporánea.
          </p>
          <p class="reveal delay-4" style="margin-top: 18px">
            Cada pieza es concebida por nuestro equipo de diseñadores y elaborada a mano por maestros artesanos con décadas de oficio. No producimos en serie; creamos con intención.
          </p>
        </div>
        <div class="intro-visual reveal-right delay-2">
          <img src="/product_dining.png" alt="Comedor de diseño" class="intro-img" />
          <div class="intro-accent"></div>
        </div>
      </div>
    </section>

    <!-- VALUES -->
    <section class="section values">
      <div class="container">
        <div class="section-header">
          <span class="label reveal">Lo que nos define</span>
          <span class="brand-line reveal delay-1"></span>
          <h2 class="section-title reveal delay-2">Nuestros valores</h2>
        </div>
        <div class="values-grid">
          <div class="value-card reveal" :class="`delay-${i+1}`" v-for="(v, i) in values" :key="v.title">
            <div class="value-icon">{{ v.icon }}</div>
            <h3>{{ v.title }}</h3>
            <p>{{ v.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- TEAM -->
    <section class="section team">
      <div class="container">
        <div class="section-header centered">
          <span class="label reveal">Detrás de cada pieza</span>
          <span class="brand-line reveal delay-1" style="margin: 14px auto 22px"></span>
          <h2 class="section-title reveal delay-2">Nuestro equipo</h2>
        </div>
        <div class="team-grid">
          <div class="team-card reveal" :class="`delay-${i+1}`" v-for="(member, i) in team" :key="member.name">
            <div class="team-avatar">{{ member.initials }}</div>
            <h3 class="team-name">{{ member.name }}</h3>
            <p class="team-role">{{ member.role }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- PROCESS -->
    <section class="section process">
      <div class="container">
        <div class="section-header">
          <span class="label reveal">Cómo lo hacemos</span>
          <span class="brand-line reveal delay-1"></span>
          <h2 class="section-title reveal delay-2">Nuestro proceso</h2>
        </div>
        <div class="process-steps">
          <div class="step reveal" :class="`delay-${i+1}`" v-for="(step, i) in process" :key="step.num">
            <div class="step-num">{{ step.num }}</div>
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-desc">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useRevealAnimation } from '../composables/useRevealAnimation'
useRevealAnimation()

const values = [
  { icon: '◇', title: 'Excelencia artesanal', desc: 'Cada unión, cada acabado, cada detalle es ejecutado con precisión absoluta por manos expertas.' },
  { icon: '◈', title: 'Materiales nobles', desc: 'Solo trabajamos con maderas certificadas, cueros naturales y metales de calidad que garantizan durabilidad.' },
  { icon: '◉', title: 'Diseño atemporal', desc: 'Nuestras piezas trascienden tendencias. Apostamos por formas limpias que conviven con cualquier época.' },
  { icon: '◆', title: 'Servicio personalizado', desc: 'Acompañamos a cada cliente desde la primera consulta hasta la instalación final en su hogar.' },
]

const team = [
  { name: 'Carlos Mendoza', role: 'Director Creativo', initials: 'CM' },
  { name: 'Sofía Torres', role: 'Diseñadora de Interiores', initials: 'ST' },
  { name: 'Andrés Rivera', role: 'Maestro Carpintero', initials: 'AR' },
  { name: 'Isabel Guzmán', role: 'Asesora de Diseño', initials: 'IG' },
]

const process = [
  { num: '01', title: 'Consulta', desc: 'Escuchamos tus necesidades, medidas del espacio y preferencias estéticas.' },
  { num: '02', title: 'Diseño', desc: 'Nuestros diseñadores elaboran propuestas a medida con renders fotorrealistas.' },
  { num: '03', title: 'Fabricación', desc: 'Tus maestros artesanos dan vida a la pieza con los materiales elegidos.' },
  { num: '04', title: 'Entrega', desc: 'Instalamos y acondicionamos cada pieza en tu espacio con cuidado extremo.' },
]
</script>

<style scoped>
/* PAGE HERO */
.page-hero {
  position: relative;
  height: 65vh;
  min-height: 520px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}
.page-hero-bg {
  position: absolute;
  inset: 0;
}
.page-hero-bg img {
  width: 100%; height: 100%;
  object-fit: cover;
  filter: grayscale(20%);
}
.page-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(13,12,11,0.97) 0%, rgba(13,12,11,0.3) 100%);
}
.page-hero-content {
  position: relative;
  z-index: 2;
  padding-bottom: 88px;
  padding-top: 120px;
}
.page-hero-title {
  font-family: var(--font-serif);
  font-size: clamp(46px, 6.5vw, 84px);
  font-weight: 400;
  color: var(--c-white);
  line-height: 1.1;
  margin-top: 8px;
}
.page-hero-title em { color: var(--c-brand-light); font-style: italic; }

/* INTRO */
.intro-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 96px;
  align-items: center;
}
.intro-text p { font-size: 15px; color: var(--c-muted); }
.intro-visual { position: relative; }
.intro-img {
  width: 100%;
  aspect-ratio: 4/5;
  object-fit: cover;
  filter: grayscale(10%);
}
.intro-accent {
  position: absolute;
  bottom: -18px; right: -18px;
  width: 55%; height: 55%;
  border: 1px solid var(--c-brand);
  opacity: 0.25;
  pointer-events: none;
}
.section-title {
  font-family: var(--font-serif);
  font-size: clamp(34px, 4vw, 54px);
  font-weight: 400;
  color: var(--c-dark);
  line-height: 1.1;
  margin-top: 0;
  margin-bottom: 28px;
}

/* VALUES */
.values { background: var(--c-off-white); }
.section-header { margin-bottom: 64px; }
.section-header.centered { text-align: center; display: flex; flex-direction: column; align-items: center; }
.values-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--c-border);
  border: 1px solid var(--c-border);
}
.value-card {
  background: var(--c-white);
  padding: 44px 32px;
  transition: background 0.4s, transform 0.4s var(--ease);
}
.value-card:hover {
  background: var(--c-off-white);
  transform: translateY(-4px);
}
.value-icon {
  font-size: 20px;
  color: var(--c-brand);
  margin-bottom: 24px;
}
.value-card h3 {
  font-family: var(--font-serif);
  font-size: 19px;
  font-weight: 400;
  color: var(--c-dark);
  margin-bottom: 14px;
}
.value-card p { font-size: 14px; color: var(--c-muted); }

/* TEAM */
.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  text-align: center;
}
.team-card { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.team-avatar {
  width: 84px; height: 84px;
  border: 1px solid var(--c-brand);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-serif);
  font-size: 22px;
  color: var(--c-brand);
  margin-bottom: 4px;
  background: var(--c-brand-faint);
}
.team-name {
  font-family: var(--font-serif);
  font-size: 18px;
  font-weight: 400;
  color: var(--c-dark);
}
.team-role { font-size: 11px; color: var(--c-muted); letter-spacing: 0.14em; text-transform: uppercase; }

/* PROCESS */
.process { background: var(--c-dark); }
.process .section-header .label { color: var(--c-brand); }
.process .section-title { color: var(--c-white); }
.process-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  border-top: 1px solid rgba(255,255,255,0.1);
}
.step {
  padding: 48px 36px 48px;
  border-right: 1px solid rgba(255,255,255,0.08);
}
.step:last-child { border-right: none; }
.step-num {
  font-family: var(--font-serif);
  font-size: 52px;
  font-weight: 400;
  color: var(--c-brand);
  opacity: 0.3;
  line-height: 1;
  margin-bottom: 24px;
}
.step-title {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 400;
  color: var(--c-white);
  margin-bottom: 14px;
}
.step-desc { font-size: 14px; color: rgba(255,255,255,0.4); line-height: 1.7; }

/* RESPONSIVE */
@media (max-width: 1000px) {
  .values-grid, .team-grid, .process-steps { grid-template-columns: repeat(2, 1fr); }
  .intro-grid { grid-template-columns: 1fr; gap: 60px; }
}
@media (max-width: 560px) {
  .values-grid { grid-template-columns: 1fr; }
  .team-grid { grid-template-columns: repeat(2, 1fr); }
  .process-steps { grid-template-columns: 1fr; }
  .step { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.08); }
}
</style>
