<template>
  <div :class="['app-logo', theme, size]">
    <img src="../assets/logo.png" alt="Disegno Interiore" class="logo-image" />
  </div>
</template>

<script setup>
defineProps({
  theme: {
    type: String,
    default: 'light' // 'light' or 'dark'
  },
  size: {
    type: String,
    default: 'medium' // 'small', 'medium', 'large'
  }
})
</script>

<style scoped>
.app-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.app-logo:hover {
  transform: scale(1.02);
}

.logo-image {
  height: 100%;
  width: auto;
  display: block;
}

/* Sizes */
.small {
  height: 32px;
}

.medium {
  height: 48px;
}

.large {
  height: 64px;
}

/* Themes */
.dark .logo-image {
  /* Respecting original colors as requested */
  /* filter: brightness(0) invert(1); */
}
</style>
