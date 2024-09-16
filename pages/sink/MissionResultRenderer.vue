<template>
  <span style="display: flex; justify-content: center; height: 100%; align-items: center;">
    <img
      :alt="props.params.value"
      :src="'https://www.ag-grid.com/example-assets/icons/' + cellValue + '.png'"
      style="width: auto; height: auto;"
    />
  </span>
</template>

<script setup lang="ts">
  interface Props{
      params: any;
  }
  const props: Props = defineProps();
  const cellValue = props.params.value ? 'tick-in-circle' : 'cross-in-circle';

</script>