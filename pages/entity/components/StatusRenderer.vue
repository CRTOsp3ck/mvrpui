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
  if (statusMsg === 'inactive')
      return { text: 'Inactive', color: 'warning' }
  if (statusMsg === 'active')
      return { text: 'Active', color: 'success' }
}
</script>

<template>
  <div>
    <VChip v-bind="resolveStatus(data.status)" density="default" label />
  </div>
</template>