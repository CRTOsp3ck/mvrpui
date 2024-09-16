<script setup lang="ts">
import type { SchemaEntityEntity } from '@/composables/schema'
import EntityBioPanel from '@/pages/entity/components/EntityBioPanel.vue'
import UserTabAccount from '@/views/apps/user/view/UserTabAccount.vue'
import UserTabBillingsPlans from '@/views/apps/user/view/UserTabBillingsPlans.vue'
import UserTabConnections from '@/views/apps/user/view/UserTabConnections.vue'
import UserTabNotifications from '@/views/apps/user/view/UserTabNotifications.vue'
import UserTabSecurity from '@/views/apps/user/view/UserTabSecurity.vue'
import { ref, computed, watch } from 'vue'
import Toaster from '@/components/toaster/Toaster.vue';
import PageTitleCreateUpdateView from '@/components/PageTitleCreateUpdateView.vue'

const route = useRoute('entity-customer-view-id')

const toaster = ref();
const showMultiLineMessage = (msg: string) => {
  toaster.value.addMultiLineMessage(msg, 'bottom middle');
}

const userTab = ref(null)
const tabs = [
  { icon: 'tabler-user-check', title: 'Account' },
  { icon: 'tabler-lock', title: 'Security' },
  { icon: 'tabler-currency-dollar', title: 'Billing & Plan' },
  { icon: 'tabler-bell', title: 'Notifications' },
  { icon: 'tabler-link', title: 'Connections' },
]

const entity = ref<SchemaEntityEntity>()
const resp = await getEntityViewService(parseInt(route.params.id))
const data: any = resp.data
if (data && data.payload) {
  entity.value = data.payload
} else {
  const msg = resp.message || resp.error
  showMultiLineMessage(msg || 'An error occurred while sending the request');
}

const pageTitle = computed(() => {
  return "View Customer #" + entity.value?.id
})

const pageTitleDescription = computed(() => {
  const updated_at = entity.value?.updated_at || Date.now()
  return "Updated on " + new Date(updated_at)
})

</script>

<template>
  <div>
    <PageTitleCreateUpdateView
      :title="pageTitle"  
      :description="pageTitleDescription"
      backlink="entity-customer-list"
    />

    <VRow v-if="entity">
      <VCol
        cols="12"
        md="5"
        lg="4"
      >
        <EntityBioPanel :entityData="entity" />
      </VCol>

      <VCol
        cols="12"
        md="7"
        lg="8"
      >
        <VTabs
          v-model="userTab"
          class="v-tabs-pill"
        >
          <VTab
            v-for="tab in tabs"
            :key="tab.icon"
          >
            <VIcon
              :size="18"
              :icon="tab.icon"
              class="me-1"
            />
            <span>{{ tab.title }}</span>
          </VTab>
        </VTabs>

        <VWindow
          v-model="userTab"
          class="mt-6 disable-tab-transition"
          :touch="false"
        >
          <VWindowItem>
            <UserTabAccount />
          </VWindowItem>

          <VWindowItem>
            <UserTabSecurity />
          </VWindowItem>

          <VWindowItem>
            <UserTabBillingsPlans />
          </VWindowItem>

          <VWindowItem>
            <UserTabNotifications />
          </VWindowItem>

          <VWindowItem>
            <UserTabConnections />
          </VWindowItem>
        </VWindow>
      </VCol>
    </VRow>
    <VCard v-else>
      <VCardTitle class="text-center">
        No User Found
      </VCardTitle>
    </VCard>

    <!-- Toaster -->
    <Toaster ref="toaster" />
  </div>
</template>
