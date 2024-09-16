<script lang="ts" setup>
const navigationTab = ref('Purpose')
const tabItems = ['Purpose', 'Components', 'Usage', 'Associated Processes']
const tabContent = [
  {
    tab: 'Purpose',
    title: 'Purpose',
    content: 'To authorize and document the return of goods by a customer, often preceding a refund or replacement.',
  },
  {
    tab: 'Components',
    title: 'Components',
    content: 'RMA number, customer details, item details, reason for return, and return instructions.',
  },
  {
    tab: 'Usage',
    title: 'Usage',
    content: 'Issued by the seller to the customer, used to manage returns efficiently and track returned goods.',
  },
  {
    tab: 'Associated Processes',
    title: 'Associated Processes',
    content: 'Return management, customer service, inventory adjustment.',
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
