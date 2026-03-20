<template>
  <footer class="footer">
    <div class="footer-top-bar container">
      <div class="footer-brand">
        <div class="brand-mark"></div>
        <span class="brand-name">Disegno<em>Interiore</em></span>
      </div>
      <p class="brand-tagline">Mobiliario que define espacios.<br>Diseño que perdura en el tiempo.</p>
    </div>

    <div class="footer-divider"></div>

    <div class="container footer-middle">
      <!-- Nav col -->
      <div class="footer-col">
        <p class="footer-title">Navegación</p>
        <router-link to="/" class="footer-link">Inicio</router-link>
        <router-link to="/nosotros" class="footer-link">Nosotros</router-link>
        <router-link to="/tienda" class="footer-link">Tienda</router-link>
        <router-link to="/contacto" class="footer-link">Contacto</router-link>
      </div>

      <!-- Colecciones col -->
      <div class="footer-col">
        <p class="footer-title">Colecciones</p>
        <a class="footer-link">Sala &amp; Comedor</a>
        <a class="footer-link">Recámara</a>
        <a class="footer-link">Oficina</a>
        <a class="footer-link">Exterior</a>
      </div>

      <!-- Contacto col -->
      <div class="footer-col">
        <p class="footer-title">Contacto</p>
        <a class="footer-link">contacto@disegnointeriore.mx</a>
        <a class="footer-link">+52 55 0000 0000</a>
        <a class="footer-link">Ciudad de México</a>
      </div>
    </div>

    <div class="footer-divider"></div>

    <div class="container footer-bottom">
      <p class="footer-copy">© 2025 Disegno Interiore. Todos los derechos reservados.</p>
      <div class="footer-socials">
        <!-- Instagram -->
        <a class="social-icon" aria-label="Instagram">
          <div class="icon-circle"></div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </a>
        <!-- Pinterest -->
        <a class="social-icon" aria-label="Pinterest">
          <div class="icon-circle"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fffafa"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M8 20l4 -9" />
              <path d="M10.7 14c.437 1.263 1.43 2 2.55 2c2.071 0 3.75 -1.554 3.75 -4a5 5 0 1 0 -9.7 1.7" />
              <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
            </svg>
        </a>
        <!-- Facebook -->
        <a class="social-icon" aria-label="Facebook">
           <div class="icon-circle"></div>
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
          </svg>
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup></script>

<style scoped>
.footer {
  background: linear-gradient(180deg, #1A1917 0%, #151412 100%);
  color: var(--c-white);
  margin-top: auto;
  position: relative;
}

/* Optional subtle glow overlay on background */
.footer::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 200px;
  background: radial-gradient(ellipse at top, rgba(155, 152, 97, 0.05) 0%, transparent 70%);
  pointer-events: none;
}

.footer-top-bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 40px;
  padding-top: 80px;
  padding-bottom: 60px;
  flex-wrap: wrap;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 16px;
}
.brand-mark {
  width: 24px;
  height: 24px;
  border: 1.5px solid var(--c-brand);
  transform: rotate(45deg);
  flex-shrink: 0;
}
.brand-name {
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 300;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--c-white);
}
.brand-name em {
  font-style: italic;
  font-family: var(--font-serif);
  font-weight: 400;
  letter-spacing: 0.05em;
  text-transform: none;
  color: var(--c-brand);
  margin-left: 2px;
}
.brand-tagline {
  font-size: 13px;
  line-height: 1.7;
  color: white;
  text-align: right;
}

.footer-divider {
  height: 1px;
  background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 100%);
  margin: 0;
  width: 100%;
}

.footer-middle {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
  padding-top: 60px;
  padding-bottom: 60px;
}

.footer-col { display: flex; flex-direction: column; gap: 12px; }
.footer-title {
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--c-brand);
  margin-bottom: 8px;
}
.footer-link {
  font-size: 13px;
  font-weight: 300;
  color: white;
  cursor: pointer;
  transition: color 0.3s;
}
.footer-link:hover { color: rgba(152, 150, 150, 0.9); }

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 24px;
  padding-bottom: 32px;
  gap: 16px;
  flex-wrap: wrap;
}
.footer-copy {
  font-size: 11px;
  font-weight: 300;
  color: white;
  letter-spacing: 0.08em;
}

.footer-socials { display: flex; gap: 20px; }

.social-icon {
  position: relative;
  color: rgba(255,255,255,0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.icon-circle {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background-color: var(--c-brand);
  opacity: 0;
  transform: scale(0.6);
  transition: opacity 0.4s var(--ease), transform 0.4s var(--ease);
}

.social-icon svg {
  position: relative;
  z-index: 1;
  transition: color 0.4s var(--ease), transform 0.4s var(--ease);
}

.social-icon:hover .icon-circle {
  opacity: 0.15;
  transform: scale(1);
}
.social-icon:hover svg {
  color: var(--c-brand);
  transform: scale(1.1);
}

@media (max-width: 900px) {
  .footer-middle { grid-template-columns: 1fr 1fr; }
  .brand-tagline { text-align: left; }
}
@media (max-width: 560px) {
  .footer-top-bar { flex-direction: column; gap: 24px; }
  .footer-middle { grid-template-columns: 1fr; }
  .footer-bottom { flex-direction: column; gap: 16px; }
}
</style>
