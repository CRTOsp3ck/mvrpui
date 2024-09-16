<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { paginationMeta } from '@api-utils/paginationMeta'
import SalesOrderInfoCard from '@/pages/documents/sales/sales-order/components/SalesOrderInfoCard.vue'
import type { SchemaSaleSalesOrderView } from '@/composables/ext-schema';
import Toaster from '@/components/toaster/Toaster.vue';

type invoiceStatus = 'Downloaded' | 'Draft' | 'Paid' | 'Sent' | 'Partial Payment' | 'Past Due' | null

const searchQuery = ref('')
const dateRange = ref('')
const selectedStatus = ref<invoiceStatus>(null)
const selectedRows = ref<string[]>([])

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

// Update data table options
const updateOptions = (options: any) => {
  page.value = options.page
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const widgetData = ref([
  { title: 'Clients', value: 24, icon: 'tabler-user' },
  { title: 'Invoices', value: 165, icon: 'tabler-file-invoice' },
  { title: 'Paid', value: '$2.46k', icon: 'tabler-checks' },
  { title: 'Unpaid', value: '$876', icon: 'tabler-currency-dollar-off' },
])

// 👉 headers
const headers = [
  { title: '#ID', key: 'id' },
  { title: 'Customer', key: 'customer' },
  { title: 'Total Value', key: 'total_value' },
  { title: 'Due Date', key: 'due_date' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const selectedDateRange = computed(() => {
  const [start, end] = dateRange.value ? dateRange.value.split('to') : ''

  return {
    start,
    end,
  }
})

// 👉 Fetch SalesOrder
const fetchSalesOrders = async () => {
    isFetching.value = true
    const req = {
        items_per_page: itemsPerPage.value,
        keyword: searchQuery.value,
        order_by: orderBy.value || 'created_at',
        page: page.value,
        sort_by: sortBy.value,
    }
    const resp = await searchSalesOrderViewService(req)
    if (resp.status === 200 || resp.status === 201) {
        const data: any = resp.data
        salesOrders.value = data.payload;
        totalSalesOrders.value = data.pagination.total_items;
    } else if (resp.message || resp.error) {
        const msg = resp.message || resp.error
        showMultiLineMessage(msg || 'An error occurred while sending the request');
    }
    isFetching.value = false
}

// 👉 Delete SalesOrder
const deleteSalesOrder = async (soId: number) => {
    salesOrders.value = salesOrders.value.filter((so) => so.id !== soId)
    const resp = await deleteInventoryService(soId)
    if (resp.message || resp.error) {
        const msg = resp.message || resp.error
        showMultiLineMessage(msg || 'An error occurred while sending the request');
    }
    if (salesOrders.value.length === 0 && page.value > 1) {
        // If no more salesOrders on current page and it's not the first page, go back to the previous page
        page.value -= 1;
    }
    if (!isFetching.value) {
        fetchSalesOrders();
    }
}

// Initial fetch
const isFetching = ref(false)
fetchSalesOrders()

// Watchers to refetch entities on pagination options change
watch([page, itemsPerPage, sortBy, orderBy], fetchSalesOrders)

const salesOrders = ref<SchemaSaleSalesOrderView[]>([])
const totalSalesOrders = ref(0)

const computedMoreList = computed(() => {
  return (paramId: number) => ([
    { title: 'Download', value: 'download', prependIcon: 'tabler-download' },
    {
      title: 'Edit',
      value: 'edit',
      prependIcon: 'tabler-pencil',
      to: { name: 'documents-inventory-goods-issue-note-create-or-update-id', params: { id: paramId } },
    },
    { title: 'Duplicate', value: 'duplicate', prependIcon: 'tabler-layers-intersect' },
  ])
})

// 👉 Toaster
const toaster = ref();
const showMultiLineMessage = (msg: string) => {
  toaster.value.addMultiLineMessage(msg, 'bottom middle');
}

// 👉 Invoice status variant resolver
const resolveInvoiceStatusVariantAndIcon = (status: string) => {
  if (status === 'Partial Payment')
    return { variant: 'success', icon: 'tabler-circle-half-2' }
  if (status === 'Paid')
    return { variant: 'warning', icon: 'tabler-chart-pie' }
  if (status === 'Downloaded')
    return { variant: 'info', icon: 'tabler-arrow-down-circle' }
  if (status === 'Draft')
    return { variant: 'primary', icon: 'tabler-device-floppy' }
  if (status === 'Sent')
    return { variant: 'secondary', icon: 'tabler-circle-check' }
  if (status === 'Past Due')
    return { variant: 'error', icon: 'tabler-alert-circle' }

  return { variant: 'secondary', icon: 'tabler-x' }
}

const resolveStatus = (statusMsg: string) => {
    if (statusMsg === 'pending')
        return { text: 'Pending', color: 'warning' }
    if (statusMsg === 'accepted')
        return { text: 'Accepted', color: 'success' }
    if (statusMsg === 'declined')
        return { text: 'Declined', color: 'error' }
}
</script>

<template>
  <!-- 👉 Page title -->
  <VCard class="mb-6">
    <VCardText>
      <p class="text-h4">
        Sales Orders (SOs) Management
      </p>
      <p class="text-medium-emphasis">
        View all sales orders created over the course of selected period.
      </p>
    </VCardText>
  </VCard>
  
  <SalesOrderInfoCard />

  <section v-if="salesOrders">
    <!-- 👉 Invoice Widgets -->
    <VCard class="mb-6">
      <VCardText>
        <VRow>
          <template
            v-for="(data, id) in widgetData"
            :key="id"
          >
            <VCol
              cols="12"
              sm="6"
              md="3"
              class="px-6"
            >
              <div class="d-flex justify-space-between">
                <div class="d-flex flex-column gap-y-1">
                  <h4 class="text-h4 text-high-emphasis">
                    {{ data.value }}
                  </h4>
                  <div class="text-body-1 text-capitalize">
                    {{ data.title }}
                  </div>
                </div>

                <VAvatar
                  color="rgba(var(--v-theme-on-background), var(--v-hover-opacity))"
                  rounded
                  class="text-high-emphasis"
                  size="38"
                >
                  <VIcon
                    :icon="data.icon"
                    size="26"
                  />
                </VAvatar>
              </div>
            </VCol>
            <VDivider
              v-if="$vuetify.display.mdAndUp ? id !== widgetData.length - 1
                : $vuetify.display.smAndUp ? id % 2 === 0
                  : false"
              vertical
              inset
            />
          </template>
        </VRow>
      </VCardText>
    </VCard>
    <!-- 👉 Invoice Filters  -->
    <VCard
      title="Filters"
      class="mb-6"
    >
      <VCardText>
        <VRow>
          <!-- 👉 Status filter -->
          <VCol
            cols="12"
            md="6"
          >
            <AppSelect
              v-model="selectedStatus"
              label="Select Status"
              placeholder="Select Status"
              clearable
              clear-icon="tabler-x"
              :items="['Downloaded', 'Draft', 'Sent', 'Paid', 'Partial Payment', 'Past Due']"
            />
          </VCol>

          <!-- 👉 DateRange filter -->
          <VCol
            cols="12"
            md="6"
          >
            <AppDateTimePicker
              v-model="dateRange"
              label="Invoice Date"
              clear-icon="tabler-x"
              clearable
              :config="{ mode: 'range' }"
              placeholder="Select Date"
            />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <VCard id="invoice-list">
      <VCardText class="d-flex align-center flex-wrap gap-4">
        <div class="me-3 d-flex gap-3 align-center">
          <AppSelect
            :model-value="itemsPerPage"
            :items="[
              { value: 10, title: '10' },
              { value: 25, title: '25' },
              { value: 50, title: '50' },
              { value: 100, title: '100' },
              { value: -1, title: 'All' },
            ]"
            style="inline-size: 6.25rem;"
            @update:model-value="itemsPerPage = parseInt($event, 10)"
          />
          <!-- 👉 Create invoice -->
          <VBtn
            prepend-icon="tabler-plus"
            :to="{ name: 'documents-sales-sales-order-create-or-update-id', params: { id: '-1' } }"
          >
            Create Sales Order
          </VBtn>
        </div>

        <VSpacer />

        <div class="d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <div class="invoice-list-filter">
            <AppTextField
              v-model="searchQuery"
              placeholder="Search Sales Order"
              density="compact"
            />
          </div>

          <!-- 👉 Select status -->
          <div class="invoice-list-filter">
            <AppSelect
              v-model="selectedStatus"
              placeholder="Select Status"
              clearable
              clear-icon="tabler-x"
              single-line
              :items="['Downloaded', 'Draft', 'Sent', 'Paid', 'Partial Payment', 'Past Due']"
            />
          </div>
        </div>
      </VCardText>
      <VDivider />

      <!-- SECTION Datatable -->
      <VDataTableServer
        v-model="selectedRows"
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        show-select
        :items-length="totalSalesOrders"
        :headers="headers"
        :items="salesOrders"
        class="text-no-wrap"
        @update:options="updateOptions"
      >
        <!-- Trending Header -->
        <template #column.trending>
          <VIcon
            size="22"
            icon="tabler-trending-up"
          />
        </template>

        <!-- id -->
        <template #item.id="{ item }">
          <NuxtLink :to="{ name: 'documents-sales-sales-order-view-id', params: { id: item.id } }">
            #{{ item.id }}
          </NuxtLink>
        </template>

        <!-- client -->
        <template #item.customer="{ item }">
          <div class="d-flex align-center">
            <VAvatar
              size="38"
              :variant="'tonal'"
              class="me-3"
            >
              <VImg
                v-if="item.avatar && item.avatar.length"
                :src="item.avatar"
              />
              <span v-else>{{ avatarText(item.customer_info.name) }}</span>
            </VAvatar>
            <div class="d-flex flex-column">
              <NuxtLink
                :to="{ name: 'entity-customer-view-id', params: { id: item.customer_id } }"
                class="text-link font-weight-medium"
              >
                {{ item.customer_info.name ? item.customer_info.name : 'N/A' }}
              </NuxtLink>
              <span class="text-sm text-disabled">{{ item.customer_info.email }}</span>
            </div>
          </div>
        </template>

        <!-- Total Value -->
        <template #item.total_value="{ item }">
          ${{ item.base_document.net_amount_gen.toFixed(2) }}
        </template>

        <!-- Due Date -->
        <template #item.due_date="{ item }">
          {{ new Date(item.payment_due_date).toDateString() }}
        </template>

        <!-- Order Status -->
        <template #item.status="{ item }">
          <VChip v-bind="resolveStatus(item.order_status)" density="default" label />
        </template>

        <!-- Balance -->
        <!-- <template #item.balance="{ item }">
          <VChip
            v-if="typeof ((resolveInvoiceBalanceVariant(item.balance, item.total)).status) === 'string'"
            :color="resolveInvoiceBalanceVariant(item.balance, item.total).chip.color"
            label
          >
            {{ (resolveInvoiceBalanceVariant(item.balance, item.total)).status }}
          </VChip>

          <template v-else>
            <span class="text-base">
              {{ Number((resolveInvoiceBalanceVariant(item.balance, item.total)).status) > 0 ? `$${(resolveInvoiceBalanceVariant(item.balance, item.total)).status}` : `-$${Math.abs(Number((resolveInvoiceBalanceVariant(item.balance, item.total)).status))}` }}
            </span>
          </template>
        </template> -->

        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn @click="deleteSalesOrder(item.id)">
            <VIcon icon="tabler-trash" />
          </IconBtn>

          <IconBtn :to="{ name: 'documents-sales-sales-order-view-id', params: { id: item.id } }">
            <VIcon icon="tabler-eye" />
          </IconBtn>

          <MoreBtn
            :menu-list="computedMoreList(item.id)"
            item-props
            color="undefined"
          />
        </template>

        <!-- pagination -->
        <template #bottom>
          <VDivider />
          <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3">
            <p class="text-sm text-disabled mb-0">
              {{ paginationMeta({ page, itemsPerPage }, totalSalesOrders) }}
            </p>

            <VPagination 
              v-model="page" 
              :length="Math.ceil(Math.min(totalSalesOrders / itemsPerPage))"
              :total-visible="$vuetify.display.xs ? 1 : Math.min(Math.ceil(totalSalesOrders / itemsPerPage), 5)"
            >
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
    <!-- !SECTION -->
    </VCard>
  </section>

  <section v-else>
    <VCard>
      <VCardTitle>No sales orders found</VCardTitle>
    </VCard>
  </section>

  <!-- Toaster -->
  <Toaster ref="toaster" />
</template>

<style lang="scss">
#invoice-list {
  .invoice-list-actions {
    inline-size: 8rem;
  }

  .invoice-list-filter {
    inline-size: 12rem;
  }
}
</style>
