<template>
  <v-btn @click="buttonClicked">Click Me!</v-btn>
</template>

<script setup lang="ts">

const buttonClicked = () => alert('Button clicked!');
</script>
