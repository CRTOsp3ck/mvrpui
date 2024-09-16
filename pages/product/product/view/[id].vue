<script setup lang="ts">
import type { SchemaItemItem } from '@/composables/schema'
import ECommerceAddCustomerDrawer from '@/views/apps/ecommerce/ECommerceAddCustomerDrawer.vue'
import ProductDetailPanel from '../../components/ProductDetailPanel.vue'
import CustomerTabAddressAndBilling from '@/views/apps/ecommerce/customer/view/CustomerTabAddressAndBilling.vue'
import CustomerTabNotification from '@/views/apps/ecommerce/customer/view/CustomerTabNotification.vue'
import CustomerTabOverview from '@/views/apps/ecommerce/customer/view/CustomerTabOverview.vue'
import CustomerTabSecurity from '@/views/apps/ecommerce/customer/view/CustomerTabSecurity.vue'
import Toaster from '@/components/toaster/Toaster.vue';

const route = useRoute('product-product-view-id')

const toaster = ref();
const showMultiLineMessage = (msg: string) => {
  toaster.value.addMultiLineMessage(msg, 'bottom middle');
}

const userTab = ref(null)

const tabs = [
    { title: 'Overview' },
    { title: 'Security' },
    { title: 'Billing & Plan' },
    { title: 'Notifications' },
]

const isAddCustomerDrawerOpen = ref(false)

const productData = ref<SchemaItemItem>()

if (parseInt(route.params.id) > 0) {
  const resp = await getItemViewService(parseInt(route.params.id))
  const data: any = resp.data
  if (data && data.payload) {
    productData.value = data.payload
  } else if (resp.message || resp.error) {
    const msg = resp.message || resp.error
    showMultiLineMessage(msg || 'An error occurred while sending the request');
  }
}

const pageTitle = computed(() => {
  return "View Product #" + productData.value?.id
})

const pageTitleDescription = computed(() => {
  const updated_at = productData.value?.updated_at || Date.now()
  return "Updated on " + new Date(updated_at)
})
</script>

<template>
  <div>
    <!-- 👉 Header  -->
    <PageTitleCreateUpdateView
      :title="pageTitle"  
      :description="pageTitleDescription"
      backlink="product-product-list"
    />
    <!-- 👉 Customer Profile  -->
    <VRow v-if="productData">
      <VCol
        cols="12"
        md="5"
        lg="4"
      >
        <ProductDetailPanel :productData="productData" />
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
            <CustomerTabOverview />
          </VWindowItem>
          <VWindowItem>
            <CustomerTabSecurity />
          </VWindowItem>
          <VWindowItem>
            <CustomerTabAddressAndBilling />
          </VWindowItem>
          <VWindowItem>
            <CustomerTabNotification />
          </VWindowItem>
        </VWindow>
      </VCol>
    </VRow>
    <ECommerceAddCustomerDrawer v-model:is-drawer-open="isAddCustomerDrawerOpen" />
  </div>
</template>
