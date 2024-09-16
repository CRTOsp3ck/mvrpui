<script setup lang="ts">
import { defineProps } from "vue";

const { params } = defineProps(["params"]);
const { value, data } = params;
</script>

<template>
  <div>
    <div class="d-flex align-center">
      <div class="d-flex flex-column">
        <!-- <span class="text-base"> -->
          <NuxtLink :to="{ name: 'inventory-inventory-view-id', params: { id: data.inventory_id } }">
            #{{ "INV" + data.inventory_id }}
          </NuxtLink>
        <!-- </span> -->
        <!-- <span class="text-sm">{{ data.item.brand }}</span> -->
      </div>
    </div>
  </div>
</template>