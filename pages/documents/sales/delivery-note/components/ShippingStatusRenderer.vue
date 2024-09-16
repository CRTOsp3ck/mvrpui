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
    if (statusMsg === 'in_transit')
        return { text: 'In Transit', color: 'warning' }
    if (statusMsg === 'shipped')
        return { text: 'Shipped', color: 'success' }
    if (statusMsg === 'ready_for_pickup')
        return { text: 'Ready For Pickup', color: 'error' }
}
</script>

<template>
  <div>
    <VChip v-bind="resolveStatus(data.shipping_status)" density="default" label />
  </div>
</template>