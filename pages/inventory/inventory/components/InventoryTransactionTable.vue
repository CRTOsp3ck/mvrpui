<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { paginationMeta } from '@api-utils/paginationMeta'
import { ref, computed, watch } from 'vue'
import Toaster from '@/components/toaster/Toaster.vue';
import startCase from 'lodash/startCase'
import toLower from 'lodash/toLower'

interface Props{
  inventoryId: number,
}
const props = defineProps<Props>()

const orders = ref([])
const totalOrder = ref(0)

const searchQuery = ref('')

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const updateOptions = (options: any) => {
  page.value = options.page
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const getOrders = async () => {
    isFetching.value = true
    const req = {
        inventory_id: props.inventoryId.toString(),
        items_per_page: itemsPerPage.value,
        keyword: searchQuery.value,
        order_by: orderBy.value || 'created_at',
        page: page.value,
        sort_by: sortBy.value,
    }
    const resp = await searchInventoryTransactionService(req)
    if (resp.status === 200 || resp.status === 201) {
        const data: any = resp.data
        orders.value = data.payload;
        totalOrder.value = data.pagination.total_items;
    } else if (resp.message || resp.error) {
        const msg = resp.message || resp.error;
        showMultiLineMessage(msg || 'An error occurred while sending the request');
    }
    isFetching.value = false
}

const isFetching = ref(false)
getOrders()

const deleteOrder = async (id: number) => {}

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Type', key: 'type' },
  { title: 'Quantity', key: 'quantity' },
  { title: 'Date', key: 'date' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const resolveStatus = (status: string) => {
  if (status === 'Delivered')
    return { color: 'success' }
  if (status === 'Out for Delivery')
    return { color: 'primary' }
  if (status === 'Ready to Pickup')
    return { color: 'info' }
  if (status === 'Dispatched')
    return { color: 'warning' }
}

const toaster = ref();
const showMessage = (msg: string) => {
  toaster.value.addMessage(msg, 'bottom middle');
}
const showMultiLineMessage = (msg: string) => {
  toaster.value.addMultiLineMessage(msg, 'bottom middle');
}

function snakeToStartCase(snakeStr: string): string {
  return startCase(toLower(snakeStr.replace(/_/g, ' ')));
}
</script>

<template>
  <VCard>
    <VCardText>
      <div class="d-flex justify-sm-space-between justify-start flex-wrap gap-4 align-center">
        <h5 class="text-h5">
          Transaction history
        </h5>
        <VTextField
          v-model="searchQuery"
          density="compact"
          placeholder="Serach Order"
          style=" max-inline-size: 200px; min-inline-size: 200px;"
        />
      </div>
    </VCardText>
    <VDataTableServer
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      :headers="headers"
      show-select
      :items="orders"
      :items-length="totalOrder"
      class="text-no-wrap"
      @update:options="updateOptions"
    >
      <!-- Order ID -->
      <template #item.id="{ item }">
        <NuxtLink :to="{ name: 'apps-ecommerce-order-details-id', params: { id: item.id } }">
          #{{ item.id }}
        </NuxtLink>
      </template>

      <!-- Date -->
      <template #item.date="{ item }">
        {{ new Date(item.transaction_date).toDateString() }}
      </template>

      <!-- Type -->
      <template #item.type="{ item }">
        <VChip
          label
          :color="resolveStatus(item.transaction_type)?.color"
        >
          {{ snakeToStartCase(item.transaction_type) }}
        </VChip>
      </template>

      <!-- Quantity -->
      <template #item.quantity="{ item }">
        {{ parseFloat(item.quantity) }} Unit(s)
      </template>

      <!-- Actions -->
      <template #item.actions="{ item }">
        <IconBtn>
          <VIcon icon="tabler-dots-vertical" />
          <VMenu activator="parent">
            <VList>
              <VListItem
                value="view"
                :to="{ name: 'apps-ecommerce-order-details-id', params: { id: item.order } }"
              >
                View
              </VListItem>
              <VListItem
                value="delete"
                @click="deleteOrder(item.id)"
              >
                Delete
              </VListItem>
            </VList>
          </VMenu>
        </IconBtn>
      </template>

      <!-- pagination -->
      <template #bottom>
        <VDivider />

        <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-6">
          <p class="text-sm text-disabled mb-0">
            {{ paginationMeta({ page, itemsPerPage }, totalOrder) }}
          </p>

          <VPagination v-model="page" :length="Math.ceil(Math.min(totalOrder / itemsPerPage))"
            :total-visible="$vuetify.display.xs ? 1 : Math.min(Math.ceil(totalOrder / itemsPerPage), 5)">
            <template #prev="slotProps">
              <VBtn
                variant="tonal"
                color="default"
                v-bind="slotProps"
                :icon="false"
              >
                Previous
              </VBtn>
            </template>

            <template #next="slotProps">
              <VBtn
                variant="tonal"
                color="default"
                v-bind="slotProps"
                :icon="false"
              >
                Next
              </VBtn>
            </template>
          </VPagination>
        </div>
      </template>
    </VDataTableServer>
  </VCard>

  <!-- Toaster -->
  <Toaster ref="toaster" />
</template>
