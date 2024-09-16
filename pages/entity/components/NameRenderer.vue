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