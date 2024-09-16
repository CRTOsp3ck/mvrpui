<script setup lang="ts">
interface PageTitleProps {
  title: string;
  description: string;
}
const props = defineProps<PageTitleProps>();

</script>

<template>
  <VCard class="mb-6">
    <VCardText>
      <p class="text-h4">
        {{ props.title }}
      </p>
      <p class="text-medium-emphasis">
        {{ props.description }}
      </p>
    </VCardText>
  </VCard>
</template>