<script setup lang="ts">
import { defineProps } from "vue";

const { params } = defineProps(["params"]);
const { value, data } = params;

const getViewEntityPathByType = () => {
  switch (data.type) {
    case 'employee':
      return 'entity-employee-view-id'
    case 'customer':
      return 'entity-customer-view-id'
    case 'supplier':
      return 'entity-vendor-view-id'
    default:
      return null
  }
}

const resolveCategory = (category: string) => {
    if (category === 'Accessories')
        return { color: 'error', icon: 'tabler-device-watch' }
    if (category === 'Home Decor')
        return { color: 'info', icon: 'tabler-home' }
    if (category === 'Electronics')
        return { color: 'primary', icon: 'tabler-device-imac' }
    if (category === 'Shoes')
        return { color: 'success', icon: 'tabler-shoe' }
    if (category === 'Office')
        return { color: 'warning', icon: 'tabler-briefcase' }
    if (category === 'Games')
        return { color: 'primary', icon: 'tabler-device-gamepad-2' }
}
</script>

<template>
  <div>
    <NuxtLink :to="{ name: getViewEntityPathByType(), params: { id: data.id } }">
      {{ data.name }}
    </NuxtLink>
    <!-- <div class="d-flex align-center">
      <div class="d-flex flex-column">
        <span class="text-base">
          <NuxtLink :to="{ name: getViewEntityPathByType(), params: { id: data.id } }" class="font-weight-medium">
            {{ data.name }}
          </NuxtLink>
        </span>
        <span class="text-sm text-medium-emphasis">{{ data.email }}</span>
      </div>
    </div> -->
  </div>
</template>