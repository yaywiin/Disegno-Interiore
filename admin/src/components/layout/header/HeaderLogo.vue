<template>
  <router-link to="/products" class="lg:hidden">
    <AdminLogo size="small" />
  </router-link>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import AdminLogo from '@/components/common/AdminLogo.vue'
</script>
