<script setup lang="ts">
import { defineProps } from "vue";

const { params } = defineProps(["params"]);
const { value, data } = params;

const getEditItemPathByType = () => {
  switch (data.type) {
    case 'product':
      return 'product-product-create-or-update-id'
    case 'service':
      return 'product-service-create-or-update-id'
    default:
      return null
  }
}
</script>

<template>
  <div>
    <!-- <IconBtn>
        <VIcon icon="tabler-eye" />
    </IconBtn> -->

    <IconBtn :to="{ name: getEditItemPathByType(), params: { id: data.id } }" >
      <VIcon icon="tabler-edit" />
    </IconBtn>
    
    <IconBtn >
        <VIcon icon="tabler-trash" />
    </IconBtn>
  </div>
</template>