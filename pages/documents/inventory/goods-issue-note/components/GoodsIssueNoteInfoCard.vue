<script lang="ts" setup>
const navigationTab = ref('Purpose')
const tabItems = ['Purpose', 'Components', 'Usage', 'Associated Processes']
const tabContent = [
  {
    tab: 'Purpose',
    title: 'Purpose',
    content: 'To authorize and document the removal of goods from inventory for delivery to a customer or for internal use in production.',
  },
  {
    tab: 'Components',
    title: 'Components',
    content: 'Goods issue number, date, item details, quantities, purpose of the issue, and authorization.',
  },
  {
    tab: 'Usage',
    title: 'Usage',
    content: 'Used to record the dispatch of goods from inventory, triggering updates in inventory records.',
  },
  {
    tab: 'Associated Processes',
    title: 'Associated Processes',
    content: 'Inventory management, shipping, production planning.',
  },
]

const getTabTitle = (tab: string) => {
  return tabContent.find((item) => item.tab === tab)?.title
}

const getTabContent = (tab: string) => {
  return tabContent.find((item) => item.tab === tab)?.content
}
</script>

<template>
  <VCard title="Document type information" class="mb-6">
    <VTabs v-model="navigationTab">
      <VTab
        v-for="item in tabItems"
        :key="item"
      >
        {{ item }}
      </VTab>
    </VTabs>

    <!-- tabs content -->
    <VWindow v-model="navigationTab">
      <VWindowItem
        v-for="item in tabItems"
        :key="item"
        :value="item"
      >
        <!-- <VCardItem>
          <VCardTitle>{{ getTabTitle(item) }}</VCardTitle>
        </VCardItem> -->

        <VCardText>
          {{ getTabContent(item) }}
        </VCardText>

        <!-- <VCardText>
          <VBtn>Learn More</VBtn>
        </VCardText> -->
      </VWindowItem>
    </VWindow>
  </VCard>
</template>
