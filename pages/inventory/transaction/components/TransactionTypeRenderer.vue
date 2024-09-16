<script setup lang="ts">
import startCase from 'lodash/startCase'
import toLower from 'lodash/toLower'
import { defineProps } from "vue";

const { params } = defineProps(["params"]);
const { value, data } = params;

function snakeToStartCase(snakeStr: string): string {
  return startCase(toLower(snakeStr.replace(/_/g, ' ')));
}
</script>

<template>
  <div>
    <VChip label :color="'info'">
          {{ snakeToStartCase(data.transaction_type) }}
        </VChip>
  </div>
</template>