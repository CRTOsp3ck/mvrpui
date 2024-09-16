<script setup lang="ts">
import { defineProps } from "vue";

const { params } = defineProps(["params"]);
const { value, data } = params;

const resolveStatus = (statusMsg: string) => {
    if (statusMsg === 'testing')
        return { text: 'Testing', color: 'warning' }
    if (statusMsg === 'active')
        return { text: 'Active', color: 'success' }
    if (statusMsg === 'inactive')
        return { text: 'Inactive', color: 'error' }
    if (statusMsg === 'discontinued')
        return { text: 'Discontinued', color: 'error' }
}
</script>

<template>
  <div>
    <VChip v-bind="resolveStatus(value)" density="default" label />
  </div>
</template>