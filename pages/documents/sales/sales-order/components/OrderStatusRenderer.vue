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
  if (statusMsg === 'pending')
      return { text: 'Pending', color: 'warning' }
  if (statusMsg === 'accepted')
      return { text: 'Accepted', color: 'success' }
  if (statusMsg === 'declined')
      return { text: 'Declined', color: 'error' }
}
</script>

<template>
  <div>
    <VChip v-bind="resolveStatus(data.order_status)" density="default" label />
  </div>
</template>