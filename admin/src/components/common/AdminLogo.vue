<template>
  <div :class="['admin-logo', theme, size]">
    <img src="@/assets/logo.png" alt="Disegno Interiore" class="logo-image" />
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
.admin-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.logo-image {
  height: 100%;
  width: auto;
  display: block;
}

/* Sizes */
.small {
  height: 24px;
}

.medium {
  height: 32px;
}

.large {
  height: 48px;
}

.xl {
  height: 64px;
}

/* Themes */
.dark .logo-image {
  /* filter: brightness(0) invert(1); */ /* Same as client, respecting color for now */
}
</style>
