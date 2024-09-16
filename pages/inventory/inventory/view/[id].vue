<script setup lang="ts">
import ECommerceAddCustomerDrawer from '@/views/apps/ecommerce/ECommerceAddCustomerDrawer.vue'
import InventoryDetailPanel from '@/pages/inventory/inventory/components/InventoryDetailPanel.vue'
import InventoryTabOverview from '@/pages/inventory/inventory/components/InventoryTabOverview.vue'
import InventoryTabReordering from '@/pages/inventory/inventory/components/InventoryTabReordering.vue'
import InventoryTabIssuance from '@/pages/inventory/inventory/components/InventoryTabIssuance.vue'
import InventoryTabReconciliation from '@/pages/inventory/inventory/components/InventoryTabReconciliation.vue'
import InventoryTabReturns from '@/pages/inventory/inventory/components/InventoryTabReturns.vue'
import CustomerTabOverview from '@/views/apps/ecommerce/customer/view/CustomerTabOverview.vue'
import CustomerTabAddressAndBilling from '@/views/apps/ecommerce/customer/view/CustomerTabAddressAndBilling.vue'
import CustomerTabNotification from '@/views/apps/ecommerce/customer/view/CustomerTabNotification.vue'
import CustomerTabSecurity from '@/views/apps/ecommerce/customer/view/CustomerTabSecurity.vue'
import Toaster from '@/components/toaster/Toaster.vue';
import type { SchemaInventoryInventoryView } from '@/composables/ext-schema'

const route = useRoute('inventory-inventory-view-id')

const toaster = ref();
const showMultiLineMessage = (msg: string) => {
  toaster.value.addMultiLineMessage(msg, 'bottom middle');
}

const userTab = ref(null)
const tabs = [
    { title: 'Overview' },
    { title: 'Reordering' },
    { title: 'Issuance' },
    { title: 'Reconciliation' },
    { title: 'Returns' },
]

const isAddCustomerDrawerOpen = ref(false)

const inventoryData = ref<SchemaInventoryInventoryView>()
const inventoryId = ref(parseInt(route.params.id))

if (inventoryId.value > 0) {
  const resp = await getInventoryViewService(inventoryId.value)
  if (resp.status === 200 || resp.status === 201) {
      const data: any = resp.data
      inventoryData.value = data.payload
  } else if (resp.message || resp.error) {
      const msg = resp.message || resp.error
      showMultiLineMessage(msg || 'An error occurred while sending the request');
  }
}

const pageTitle = computed(() => {
  return "View Inventory #" + inventoryData.value?.id
})

const pageTitleDescription = computed(() => {
  const updated_at = inventoryData.value?.updated_at || Date.now()
  return "Updated on " + new Date(updated_at)
})

</script>

<template>
  <div>
    <!-- 👉 Header  -->
    <PageTitleCreateUpdateView
      :title="pageTitle"  
      :description="pageTitleDescription"
      backlink="inventory-inventory-list"
    />
    <!-- 👉 Customer Profile  -->
    <VRow v-if="inventoryData">
      <VCol
        cols="12"
        md="5"
        lg="4"
      >
        <InventoryDetailPanel :inventoryData="inventoryData" />
      </VCol>
      <VCol
        cols="12"
        md="7"
        lg="8"
      >
        <VTabs
          v-model="userTab"
          class="v-tabs-pill mb-3 disable-tab-transition"
        >
          <VTab
            v-for="tab in tabs"
            :key="tab.title"
          >
            <span>{{ tab.title }}</span>
          </VTab>
        </VTabs>
        <VWindow
          v-model="userTab"
          class="disable-tab-transition"
          :touch="false"
        >
          <VWindowItem>
            <InventoryTabOverview :inventoryData="inventoryData" />
          </VWindowItem>
          <VWindowItem>
            <InventoryTabReordering />
          </VWindowItem>
          <VWindowItem>
            <InventoryTabIssuance />
          </VWindowItem>
          <VWindowItem>
            <InventoryTabReconciliation />
          </VWindowItem>
          <VWindowItem>
            <InventoryTabReturns />
          </VWindowItem>
        </VWindow>
      </VCol>
    </VRow>
    <ECommerceAddCustomerDrawer v-model:is-drawer-open="isAddCustomerDrawerOpen" />
  </div>

  <!-- Toaster -->
  <Toaster ref="toaster" />
</template>
