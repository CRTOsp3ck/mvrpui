<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { paginationMeta } from '@api-utils/paginationMeta'
import StockCountSheetInfoCard from '../components/StockCountSheetInfoCard.vue'
import type { SchemaInventoryStockCountSheetView } from '@/composables/ext-schema';
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
  // { title: 'Trending', key: 'trending', sortable: false },
  { title: 'Inventory', key: 'inventory' },
  { title: 'Counted By', key: 'counted_by' },
  { title: 'Quantity', key: 'quantity' },
  { title: 'Discrepency', key: 'discrepency' },
  { title: 'Count Date', key: 'count_date' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// 👉 Fetch StockCountSheet
const fetchStockCountSheets = async () => {
    isFetching.value = true
    const req = {
        items_per_page: itemsPerPage.value,
        keyword: searchQuery.value,
        order_by: orderBy.value || 'created_at',
        page: page.value,
        sort_by: sortBy.value,
    }
    const resp = await searchStockCountSheetViewService(req)
    if (resp.status === 200 || resp.status === 201) {
        const data: any = resp.data
        stockCountSheets.value = data.payload;
        totalStockCountSheets.value = data.pagination.total_items;
    } else if (resp.message || resp.error) {
        const msg = resp.message || resp.error
        showMultiLineMessage(msg || 'An error occurred while sending the request');
    }
    isFetching.value = false
}

// 👉 Delete StockCountSheet
const deleteStockCountSheet = async (scsId: number) => {
    stockCountSheets.value = stockCountSheets.value.filter((scs) => scs.id !== scsId)
    const resp = await deleteInventoryService(scsId)
    if (resp.message || resp.error) {
        const msg = resp.message || resp.error
        showMultiLineMessage(msg || 'An error occurred while sending the request');
    }
    if (stockCountSheets.value.length === 0 && page.value > 1) {
        // If no more stockCountSheets on current page and it's not the first page, go back to the previous page
        page.value -= 1;
    }
    if (!isFetching.value) {
        fetchStockCountSheets();
    }
}

// Initial fetch
const isFetching = ref(false)
fetchStockCountSheets()

// Watchers to refetch entities on pascsation options change
watch([page, itemsPerPage, sortBy, orderBy], fetchStockCountSheets)

const stockCountSheets = ref<SchemaInventoryStockCountSheetView[]>([])
const totalStockCountSheets = ref(0)

const computedMoreList = computed(() => {
  return (paramId: number) => ([
    { title: 'Download', value: 'download', prependIcon: 'tabler-download' },
    {
      title: 'Edit',
      value: 'edit',
      prependIcon: 'tabler-pencil',
      to: { name: 'documents-inventory-stock-count-sheet-create-or-update-id', params: { id: paramId } },
    },
    { title: 'Duplicate', value: 'duplicate', prependIcon: 'tabler-layers-intersect' },
  ])
})

// 👉 Toaster
const toaster = ref();
const showMultiLineMessage = (msg: string) => {
  toaster.value.addMultiLineMessage(msg, 'bottom middle');
}
</script>

<template>
  <!-- 👉 Page title -->
  <VCard class="mb-6">
    <VCardText>
      <p class="text-h4">
        Stock Count Sheet (SCSs) Management
      </p>
      <p class="text-medium-emphasis">
        View all stock count sheets created over the course of selected period.
      </p>
    </VCardText>
  </VCard>
  
  <StockCountSheetInfoCard />

  <section v-if="stockCountSheets">
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
            :to="{ name: 'documents-inventory-stock-count-sheet-create-or-update-id', params: { id: '-1' } }"
          >
            Create Stock Count Sheet
          </VBtn>
        </div>

        <VSpacer />

        <div class="d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <div class="invoice-list-filter">
            <AppTextField
              v-model="searchQuery"
              placeholder="Search Invoice"
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
        :items-length="totalStockCountSheets"
        :headers="headers"
        :items="stockCountSheets"
        class="text-no-wrap"
        @update:options="updateOptions"
      >
        <!-- Trending Header -->
        <!-- <template #column.trending>
          <VIcon
            size="22"
            icon="tabler-trending-up"
          />
        </template> -->

        <!-- id -->
        <template #item.id="{ item }">
          <NuxtLink :to="{ name: 'documents-inventory-stock-count-sheet-view-id', params: { id: item.id } }">
            #{{ item.id }}
          </NuxtLink>
        </template>

        <template #item.inventory="{ item }">
          <NuxtLink :to="{ name: 'inventory-inventory-view-id', params: { id: item.inventory_id } }">
            #{{ item.inventory_id }}
          </NuxtLink>
        </template>

        <!-- trending -->
        <!-- <template #item.trending="{ item }">
          <VTooltip>
            <template #activator="{ props }">
              <VAvatar
                :size="30"
                v-bind="props"
                :color="resolveInvoiceStatusVariantAndIcon(item.invoiceStatus).variant"
                variant="tonal"
              >
                <VIcon
                  :size="20"
                  :icon="resolveInvoiceStatusVariantAndIcon(item.invoiceStatus).icon"
                />
              </VAvatar>
            </template>
            <p class="mb-0">
              {{ item.invoiceStatus }}
            </p>
            <p class="mb-0">
              Balance: {{ item.balance }}
            </p>
            <p class="mb-0">
              Due date: {{ item.dueDate }}
            </p>
          </VTooltip>
        </template> -->

        <!-- client -->
        <template #item.counted_by="{ item }">
          <div class="d-flex align-center">
            <!-- <VAvatar
              size="38"
              :color="!item.avatar.length ? resolveInvoiceStatusVariantAndIcon(item.invoiceStatus).variant : undefined"
              :variant="!item.avatar.length ? 'tonal' : undefined"
              class="me-3"
            >
              <VImg
                v-if="item.avatar.length"
                :src="item.avatar"
              />
              <span v-else>{{ avatarText(item.receipient_id) }}</span>
            </VAvatar> -->
            <div class="d-flex flex-column">
              <NuxtLink
                :to="{ name: 'entity-employee-view-id', params: { id: item.counted_by_employee_id } }"
                class="text-link font-weight-medium"
              >
                #{{ item.counted_by_employee_id ? item.counted_by_employee_id : 'N/A' }}
              </NuxtLink>
              <!-- <span class="text-sm text-disabled">{{ item.receipient_id.email }}</span> -->
            </div>
          </div>
        </template>

        <!-- Discrepency -->
        <template #item.discrepency="{ item }">
          {{ item.discrepancies_gen }} Unit(s)
        </template>

        <!-- Total -->
        <template #item.quantity="{ item }">
          {{ item.total_quantity }} Unit(s)
        </template>

        <!-- Date -->
        <template #item.count_date="{ item }">
          {{ new Date(item.count_date).toDateString() }}
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn @click="deleteStockCountSheet(item.id)">
            <VIcon icon="tabler-trash" />
          </IconBtn>

          <IconBtn :to="{ name: 'documents-inventory-stock-count-sheet-view-id', params: { id: item.id } }">
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
              {{ paginationMeta({ page, itemsPerPage }, totalStockCountSheets) }}
            </p>

            <VPagination 
              v-model="page" 
              :length="Math.ceil(Math.min(totalStockCountSheets / itemsPerPage))"
              :total-visible="$vuetify.display.xs ? 1 : Math.min(Math.ceil(totalStockCountSheets / itemsPerPage), 5)"
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
      <VCardTitle>No stock count sheets found</VCardTitle>
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
