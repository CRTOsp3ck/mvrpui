<script setup lang="ts">
interface PageTitleProps {
  title: string;
  description: string;
  backlink: string;
  params?: Record<string, string>;
}
const props = defineProps<PageTitleProps>();
</script>

<template>
  <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6">
    <div class="d-flex flex-col gap-x-4">
      <IconBtn v-if="params" :to="{ name: props.backlink, params: props.params }">
        <VIcon icon="tabler-chevron-left" />
      </IconBtn>
      <IconBtn v-else :to="{ name: props.backlink }">
        <VIcon icon="tabler-chevron-left" />
      </IconBtn>
      
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 font-weight-medium">
          {{ props.title }}
        </h4>
        <span>{{ props.description }}</span>
      </div>
    </div>
  </div>
</template>