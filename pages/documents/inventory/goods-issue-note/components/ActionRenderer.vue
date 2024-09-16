<script setup lang="ts">
import { defineProps } from "vue";

const { params } = defineProps(["params"]);
const { value, data } = params;
</script>

<template>
  <div>
    <!-- <IconBtn>
        <VIcon icon="tabler-eye" />
    </IconBtn> -->

    <IconBtn :to="{ name: 'documents-inventory-goods-issue-note-create-or-update-id', params: { id: data.id } }" >
      <VIcon icon="tabler-edit" />
    </IconBtn>
    
    <IconBtn >
        <VIcon icon="tabler-trash" />
    </IconBtn>
  </div>
</template>