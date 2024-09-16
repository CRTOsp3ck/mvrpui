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

    <IconBtn>
      <VIcon icon="tabler-edit" />
    </IconBtn>
    
    <IconBtn >
        <VIcon icon="tabler-trash" />
    </IconBtn>
  </div>
</template>