<script setup lang="ts">
import startCase from 'lodash/startCase'
import toLower from 'lodash/toLower'
import { defineProps } from "vue";

const { params } = defineProps(["params"]);
const { value, data } = params;

function snakeToStartCase(snakeStr: string): string {
  return startCase(toLower(snakeStr.replace(/_/g, ' ')));
}

const resolveStatus = (statusMsg: string) => {
  if (statusMsg === 'partially_paid')
      return { text: 'Partially Paid', color: 'warning' }
  if (statusMsg === 'paid')
      return { text: 'Paid', color: 'success' }
  if (statusMsg === 'pending')
      return { text: 'Pending', color: 'error' }
}
</script>

<template>
  <div>
    <VChip v-bind="resolveStatus(data.base_document.payment_status)" density="default" label />
  </div>
</template>