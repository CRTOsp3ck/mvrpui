<template>
  <div class="d-flex align-center">
    <div v-if="breadcrumbs.length===1" class="d-flex gap-x-4 ml-4">
      <VIcon icon="tabler-home" />
      <VIcon icon="tabler-caret-right-filled" />
    </div>
    <v-breadcrumbs :items="breadcrumbs">
        <template v-slot:divider>
          <VIcon icon="tabler-caret-right-filled" />
        </template>
    </v-breadcrumbs>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';

interface BreadcrumbItem {
  title: string;
  disabled: boolean;
  href: string;
}

const route = useRoute();

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const pathSegments = route.path.split('/').filter(segment => segment);
  const breadcrumbItems: BreadcrumbItem[] = [];

  pathSegments.forEach((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    breadcrumbItems.push({
      title: segment.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase()), // Capitalize each word
      disabled: false,
      href: '#',
      // href: path,
    });
  });

  return breadcrumbItems;
});
</script>