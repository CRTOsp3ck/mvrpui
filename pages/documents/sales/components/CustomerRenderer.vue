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
          <NuxtLink :to="{ name: 'entity-customer-view-id', params: { id: data.customer_info.id } }">
            #{{ "CUS" + data.customer_info.id + " - " +data.customer_info.name }}
          </NuxtLink>
        <!-- </span> -->
        <!-- <span class="text-sm">{{ data.item.brand }}</span> -->
      </div>
    </div>
  </div>
</template>