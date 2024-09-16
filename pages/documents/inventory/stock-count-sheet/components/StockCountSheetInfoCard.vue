<script lang="ts" setup>
const navigationTab = ref('Purpose')
const tabItems = ['Purpose', 'Components', 'Usage', 'Associated Processes']
const tabContent = [
  {
    tab: 'Purpose',
    title: 'Purpose',
    content: 'To record actual inventory levels during a physical count, used to reconcile discrepancies between recorded and actual stock levels.',
  },
  {
    tab: 'Components',
    title: 'Components',
    content: 'Item details, recorded quantity, actual counted quantity, discrepancies, and counters\'\ signatures.',
  },
  {
    tab: 'Usage',
    title: 'Usage',
    content: 'Used during periodic inventory counts, helps to maintain accurate inventory records.',
  },
  {
    tab: 'Associated Processes',
    title: 'Associated Processes',
    content: 'Inventory management, auditing, financial reporting.',
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
