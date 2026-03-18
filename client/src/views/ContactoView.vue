<template>
  <main class="contacto">
    <!-- PAGE HERO -->
    <section class="page-hero">
      <div class="container page-hero-content">
        <span class="label reveal">Estamos para ti</span>
        <span class="brand-line reveal delay-1"></span>
        <h1 class="page-hero-title reveal delay-2">Hablemos de tu<br><em>proyecto</em></h1>
      </div>
    </section>

    <!-- CONTACT LAYOUT -->
    <section class="section contact-layout">
      <div class="container contact-grid">
        <!-- INFO -->
        <div class="contact-info">
          <span class="label reveal">Información de contacto</span>
          <span class="brand-line reveal delay-1"></span>
          <h2 class="info-title reveal delay-2">Visítanos en nuestra<br>sala de exhibición</h2>

          <div class="info-items">
            <div class="info-item reveal" :class="`delay-${i+2}`" v-for="(item, i) in infoItems" :key="item.label">
              <div class="info-icon">
                <span v-html="item.icon"></span>
              </div>
              <div>
                <p class="info-label">{{ item.label }}</p>
                <p class="info-value">{{ item.value }}</p>
              </div>
            </div>
          </div>

          <div class="hours reveal delay-5">
            <p class="hours-title">Horario de atención</p>
            <div class="hours-grid">
              <span>Lun — Vie</span><span>10:00 — 20:00</span>
              <span>Sábado</span><span>10:00 — 18:00</span>
              <span>Domingo</span><span>Cita previa</span>
            </div>
          </div>
        </div>

        <!-- FORM -->
        <div class="contact-form-wrap reveal-right delay-2">
          <form class="contact-form" @submit.prevent="handleSubmit">
            <h3 class="form-title">Envíanos un mensaje</h3>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Nombre completo</label>
                <input v-model="form.name" type="text" class="form-input" placeholder="Tu nombre" required />
              </div>
              <div class="form-group">
                <label class="form-label">Correo electrónico</label>
                <input v-model="form.email" type="email" class="form-input" placeholder="tu@correo.com" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Teléfono (opcional)</label>
              <input v-model="form.phone" type="tel" class="form-input" placeholder="+52 55 0000 0000" />
            </div>

            <div class="form-group">
              <label class="form-label">¿Qué te interesa?</label>
              <select v-model="form.interest" class="form-input form-select">
                <option value="">Selecciona una opción</option>
                <option v-for="opt in interests" :key="opt" :value="opt">{{ opt }}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Mensaje</label>
              <textarea v-model="form.message" class="form-input form-textarea" placeholder="Cuéntanos sobre tu proyecto, espacio y visión..." required></textarea>
            </div>

            <button type="submit" class="btn btn-primary submit-btn" :disabled="submitted">
              <span v-if="!submitted">Enviar mensaje</span>
              <span v-else>✓ &nbsp;Mensaje enviado</span>
            </button>

            <p class="form-note" v-if="submitted">
              Gracias por contactarnos. Uno de nuestros asesores se pondrá en contacto contigo en las próximas 24 horas.
            </p>
          </form>
        </div>
      </div>
    </section>

    <!-- MAP PLACEHOLDER -->
    <div class="map-section">
      <div class="map-placeholder">
        <div class="map-label">
          <span class="map-icon">◇</span>
          <span>Disegno Interiore Studio — Ciudad de México</span>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRevealAnimation } from '../composables/useRevealAnimation'
useRevealAnimation()

const submitted = ref(false)
const form = ref({
  name: '',
  email: '',
  phone: '',
  interest: '',
  message: '',
})

const interests = [
  'Sala y Comedor',
  'Recámara',
  'Oficina',
  'Exterior',
  'Proyecto completo',
  'Pieza personalizada',
]

const infoItems = [
  {
    label: 'Dirección',
    value: 'Av. Presidente Masaryk 300, Polanco, CDMX',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`
  },
  {
    label: 'Teléfono',
    value: '+52 55 0000 0000',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.37 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 3.07 4.18 2 2 0 0 1 5.06 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L9.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`
  },
  {
    label: 'Correo',
    value: 'contacto@disegnointeriore.mx',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`
  },
]

const handleSubmit = () => {
  submitted.value = true
  setTimeout(() => {
    form.value = { name: '', email: '', phone: '', interest: '', message: '' }
    submitted.value = false
  }, 8000)
}
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
}
.page-hero-title em { font-style: italic; color: var(--c-brand-dark); }

/* CONTACT GRID */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 96px;
  align-items: start;
}

/* INFO */
.info-title {
  font-family: var(--font-serif);
  font-size: clamp(24px, 3vw, 38px);
  font-weight: 400;
  color: var(--c-dark);
  line-height: 1.2;
  margin-bottom: 44px;
}
.info-items { display: flex; flex-direction: column; gap: 30px; margin-bottom: 44px; }
.info-item {
  display: flex;
  align-items: flex-start;
  gap: 18px;
}
.info-icon {
  width: 44px; height: 44px;
  border: 1px solid var(--c-border);
  background: var(--c-brand-faint);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--c-brand-dark);
  flex-shrink: 0;
}
.info-label {
  font-size: 9px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--c-brand);
  margin-bottom: 5px;
  font-weight: 500;
}
.info-value {
  font-size: 14px;
  color: var(--c-muted);
  line-height: 1.5;
}
.hours-title {
  font-size: 9px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--c-brand);
  margin-bottom: 16px;
  font-weight: 500;
}
.hours-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 24px;
  font-size: 13px;
  color: var(--c-muted);
}

/* FORM */
.contact-form-wrap {
  background: var(--c-off-white);
  border: 1px solid var(--c-border);
  padding: 52px;
}
.form-title {
  font-family: var(--font-serif);
  font-size: 28px;
  font-weight: 400;
  color: var(--c-dark);
  margin-bottom: 36px;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}
.form-label {
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--c-brand-dark);
}
.form-input {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  color: var(--c-dark);
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 300;
  padding: 14px 18px;
  outline: none;
  transition: border-color 0.3s;
  width: 100%;
}
.form-input:focus { border-color: var(--c-brand); }
.form-input::placeholder { color: var(--c-mid); }
.form-select {
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888580' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-color: var(--c-white);
}
.form-select option { background: var(--c-white); }
.form-textarea {
  min-height: 140px;
  resize: vertical;
}
.submit-btn {
  width: 100%;
  justify-content: center;
  padding: 17px;
  font-size: 11px;
  margin-top: 8px;
}
.submit-btn:disabled {
  background: var(--c-brand);
  border-color: var(--c-brand);
  cursor: not-allowed;
}
.form-note {
  font-size: 13px;
  color: var(--c-brand-dark);
  text-align: center;
  margin-top: 18px;
  line-height: 1.7;
}

/* MAP */
.map-section { height: 300px; }
.map-placeholder {
  width: 100%; height: 100%;
  background: var(--c-light);
  border-top: 1px solid var(--c-border);
  display: flex;
  align-items: center;
  justify-content: center;
}
.map-label {
  display: flex;
  align-items: center;
  gap: 14px;
  color: var(--c-muted);
  font-size: 13px;
  letter-spacing: 0.1em;
}
.map-icon { color: var(--c-brand); font-size: 16px; }

/* RESPONSIVE */
@media (max-width: 900px) {
  .contact-grid { grid-template-columns: 1fr; gap: 60px; }
  .form-row { grid-template-columns: 1fr; }
  .contact-form-wrap { padding: 36px 28px; }
}
</style>
