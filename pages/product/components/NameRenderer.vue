<script setup lang="ts">
import { defineProps } from "vue";

const { params } = defineProps(["params"]);
const { value, data } = params;

const getViewItemPathByType = () => {
  switch (data.type) {
    case 'product':
      return 'product-product-view-id'
    case 'service':
      return 'product-service-view-id'
    default:
      return null
  }
}
</script>

<template>
  <div>
    <div class="d-flex align-center">
      <div class="d-flex flex-column">
        <span class="text-base">
          <NuxtLink :to="{ name: getViewItemPathByType(), params: { id: data.id } }">
            {{ data.name }}
          </NuxtLink>
        </span>
        <span class="text-sm">{{ data.brand }}</span>
      </div>
    </div>
  </div>
</template>