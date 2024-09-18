<script lang="ts" setup>
const navigationTab = ref('Purpose')
const tabItems = ['Purpose', 'Components', 'Usage', 'Associated Processes']
const tabContent = [
  {
    tab: 'Purpose',
    title: 'Purpose',
    content: 'To correct errors in a previously issued invoice or to reflect a refund for returned goods or overpayment.',
  },
  {
    tab: 'Components',
    title: 'Components',
    content: 'Reference to the original invoice, reasons for issuing, adjusted amounts, and any applicable taxes.',
  },
  {
    tab: 'Usage',
    title: 'Usage',
    content: 'Issued when a customer returns goods, when an overcharge is identified, or when a discount needs to be applied after the original invoice was issued.',
  },
  {
    tab: 'Associated Processes',
    title: 'Associated Processes',
    content: 'Returns processing, adjustments in accounts receivable.',
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
