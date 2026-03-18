<template>
  <AdminLayout>
    <div class="space-y-5 sm:space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 class="text-xl font-bold text-gray-800 dark:text-white/90">Productos</h2>
        <router-link
          to="/add-product"
          class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
        >
          <Plus class="w-4 h-4" />
          Añadir Nuevo
        </router-link>
      </div>
      
      <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="p-0 sm:p-0">
          <ProductsTable />
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from "vue";
import { Plus } from "lucide-vue-next";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ProductsTable from "@/components/tables/products/ProductsTable.vue";

</script>
