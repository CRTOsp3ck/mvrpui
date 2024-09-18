<script lang="ts" setup>
const navigationTab = ref('Purpose')
const tabItems = ['Purpose', 'Components', 'Usage', 'Associated Processes']
const tabContent = [
  {
    tab: 'Purpose',
    title: 'Purpose',
    content: 'To request payment from a buyer for goods or services provided.',
  },
  {
    tab: 'Components',
    title: 'Components',
    content: 'Seller and buyer information, invoice number, date of issue, description of goods/services, quantities, unit prices, total amount due, payment terms, due date, applicable taxes, and payment instructions.',
  },
  {
    tab: 'Usage',
    title: 'Usage',
    content: 'Issued after goods are delivered or services are rendered, often used to track sales and manage accounts receivable.',
  },
  {
    tab: 'Associated Processes',
    title: 'Associated Processes',
    content: 'Billing, revenue recognition, accounts receivable management.',
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
