<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { paginationMeta } from '@api-utils/paginationMeta'
import Toaster from '@/components/toaster/Toaster.vue'
import startCase from 'lodash/startCase'
import type { SchemaItemItem } from '@/composables/schema'

interface Props {
  itemType: string
}
const props = defineProps<Props>()

const widgetData = ref([
    { title: 'In-Store Sales', value: '$5,345.43', icon: 'tabler-home', desc: '5k orders', change: 5.7 },
    { title: 'Website Sales', value: '$674,347.12', icon: 'tabler-device-laptop', desc: '21k orders', change: 12.4 },
    { title: 'Discount', value: '$14,235.12', icon: 'tabler-gift', desc: '6k orders' },
    { title: 'Affiliate', value: '$8,345.23', icon: 'tabler-wallet', desc: '150 orders', change: -3.5 },
])

const headers = [
    { title: 'Product', key: 'product' },
    { title: 'Category', key: 'category' },
    // { title: 'Stock', key: 'stock', sortable: false },
    { title: 'SKU', key: 'sku' },
    { title: 'Cost', key: 'cost' },
    { title: 'Price', key: 'price' },
    // { title: 'QTY', key: 'qty' },
    { title: 'Status', key: 'status' },
    { title: 'Actions', key: 'actions', sortable: false },
]

const selectedStatus = ref()
const selectedCategory = ref()
const selectedStock = ref<boolean | undefined>()
const searchQuery = ref('')

const status = ref([
    { title: 'Active', value: 'active' },
    { title: 'Inactive', value: 'inactive' },
    { title: 'Discontinued', value: 'discontinued' },
    { title: 'Testing', value: 'testing' },
])

const categories = ref([
    { title: 'Accessories', value: 'Accessories' },
    { title: 'Home Decor', value: 'Home Decor' },
    { title: 'Electronics', value: 'Electronics' },
    { title: 'Shoes', value: 'Shoes' },
    { title: 'Office', value: 'Office' },
    { title: 'Games', value: 'Games' },
])

const stockStatus = ref([
    { title: 'In Stock', value: true },
    { title: 'Out of Stock', value: false },
])

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

const fetchItems = async () => {
    isFetching.value = true
    const req = {
        items_per_page: itemsPerPage.value,
        keyword: searchQuery.value,
        order_by: orderBy.value || 'created_at',
        page: page.value,
        sort_by: sortBy.value,
        type: props.itemType,
    }
    const resp = await searchItemsService(req)
    if (resp.status === 200 || resp.status === 201) {
        const data: any = resp.data
        items.value = data.payload;
        totalItems.value = data.pagination.total_items;
    } else if (resp.message || resp.error) {
        const msg = resp.message || resp.error
        showMultiLineMessage(msg || 'An error occurred while sending the request');
    }
    isFetching.value = false
}

const deleteItem = async (itemId: number) => {
    items.value = items.value.filter((item) => item.id !== itemId)
    const resp = await deleteItemService(itemId)
    if (resp.message || resp.error) {
        const msg = resp.message || resp.error
        showMultiLineMessage(msg || 'An error occurred while sending the request');
    }
    if (items.value.length === 0 && page.value > 1) {
        // If no more entities on current page and it's not the first page, go back to the previous page
        page.value -= 1;
    }
    if (!isFetching.value) {
        fetchItems();
    }
}

const toaster = ref();
const showMultiLineMessage = (msg: string) => {
  toaster.value.addMultiLineMessage(msg, 'bottom middle');
}

// Initial fetch
const isFetching = ref(false)
fetchItems()

// Watchers to refetch entities on pagination options change
watch([page, itemsPerPage, sortBy, orderBy], fetchItems)

const items = ref<SchemaItemItem[]>([])
const totalItems = ref(0)

const resolveCategory = (category: string) => {
    if (category === 'Accessories')
        return { color: 'error', icon: 'tabler-device-watch' }
    if (category === 'Home Decor')
        return { color: 'info', icon: 'tabler-home' }
    if (category === 'Electronics')
        return { color: 'primary', icon: 'tabler-device-imac' }
    if (category === 'Shoes')
        return { color: 'success', icon: 'tabler-shoe' }
    if (category === 'Office')
        return { color: 'warning', icon: 'tabler-briefcase' }
    if (category === 'Games')
        return { color: 'primary', icon: 'tabler-device-gamepad-2' }
}

const resolveStatus = (statusMsg: string) => {
    if (statusMsg === 'testing')
        return { text: 'Testing', color: 'warning' }
    if (statusMsg === 'active')
        return { text: 'Active', color: 'success' }
    if (statusMsg === 'inactive')
        return { text: 'Inactive', color: 'error' }
    if (statusMsg === 'discontinued')
        return { text: 'Discontinued', color: 'error' }
}
</script>

<template>
    <div>
        <!-- 👉 widgets -->
        <VCard class="mb-6">
            <VCardText>
                <VRow>
                    <template v-for="(data, id) in widgetData" :key="id">
                        <VCol cols="12" sm="6" md="3" class="px-6">
                            <div class="d-flex justify-space-between" :class="$vuetify.display.xs
                                ? 'product-widget'
                                : $vuetify.display.sm
                                    ? id < 2 ? 'product-widget' : ''
                                    : ''">
                                <div class="d-flex flex-column gap-y-1">
                                    <div class="text-body-1 font-weight-medium text-capitalize">
                                        {{ data.title }}
                                    </div>

                                    <h4 class="text-h4 my-1">
                                        {{ data.value }}
                                    </h4>

                                    <div class="d-flex">
                                        <div class="me-2 text-disabled text-no-wrap">
                                            {{ data.desc }}
                                        </div>

                                        <VChip v-if="data.change" label :color="data.change > 0 ? 'success' : 'error'">
                                            {{ prefixWithPlus(data.change) }}%
                                        </VChip>
                                    </div>
                                </div>

                                <VAvatar variant="tonal" rounded size="38">
                                    <VIcon :icon="data.icon" size="28" />
                                </VAvatar>
                            </div>
                        </VCol>
                        <VDivider v-if="$vuetify.display.mdAndUp ? id !== widgetData.length - 1
                            : $vuetify.display.smAndUp ? id % 2 === 0
                                : false" vertical inset length="95" />
                    </template>
                </VRow>
            </VCardText>
        </VCard>

        <!-- 👉 products -->
        <VCard title="Filters" class="mb-6">
            <VCardText>
                <VRow>
                    <!-- 👉 Select Status -->
                    <VCol cols="12" sm="4">
                        <AppSelect v-model="selectedStatus" placeholder="Status" :items="status" clearable
                            clear-icon="tabler-x" />
                    </VCol>

                    <!-- 👉 Select Category -->
                    <VCol cols="12" sm="4">
                        <AppSelect v-model="selectedCategory" placeholder="Category" :items="categories" clearable
                            clear-icon="tabler-x" />
                    </VCol>

                    <!-- 👉 Select Stock Status -->
                    <VCol cols="12" sm="4">
                        <AppSelect v-model="selectedStock" placeholder="Stock" :items="stockStatus" clearable
                            clear-icon="tabler-x" />
                    </VCol>
                </VRow>
            </VCardText>

            <VDivider class="my-4" />

            <div class="d-flex flex-wrap gap-4 mx-5">
                <div class="d-flex align-center">
                    <!-- 👉 Search  -->
                    <AppTextField v-model="searchQuery" placeholder="Search Product" density="compact"
                        style="inline-size: 200px;" class="me-3" />
                </div>

                <VSpacer />
                <div class="d-flex gap-4 flex-wrap align-center">
                    <AppSelect v-model="itemsPerPage" :items="[5, 10, 20, 25, 50]" />
                    <!-- 👉 Export button -->
                    <VBtn variant="tonal" color="secondary" prepend-icon="tabler-upload">
                        Export
                    </VBtn>

                    <VBtn color="primary" prepend-icon="tabler-plus"
                        @click="$router.push('/product-management/product/create-or-update/-1')">
                        Add Product
                    </VBtn>
                </div>
            </div>

            <VDivider class="mt-4" />

            <!-- 👉 Datatable  -->
            <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:page="page" :headers="headers" show-select
                :items="items" :items-length="totalItems" class="text-no-wrap" @update:options="updateOptions">
                <!-- product  -->
                <template #item.product="{ item }">
                    <div class="d-flex align-center gap-x-2">
                        <VAvatar v-if="item.image" size="38" variant="tonal" rounded :image="item.image" />
                        <div class="d-flex flex-column">
                            <NuxtLink :to="{ name: 'product-management-product-view-id', params: { id: item.id } }"
                                class="text-body-1 font-weight-medium">
                                {{ item.name }}
                            </NuxtLink>
                            <!-- <span class="text-body-1 font-weight-medium">{{ item.name }}</span> -->
                            <span class="text-sm text-disabled">{{ item.brand }}</span>
                        </div>
                    </div>
                </template>

                <!-- category -->
                <template #item.category="{ item }">
                    <VAvatar size="30" variant="tonal" :color="resolveCategory(item.category)?.color" class="me-2">
                        <VIcon :icon="resolveCategory(item.category)?.icon" size="18" />
                    </VAvatar>
                    <span class="text-body-1 font-weight-medium">{{ startCase(item.category) }}</span>
                </template>

                <!-- stock -->
                <!-- <template #item.stock="{ item }">
                    <VSwitch :model-value="item.stock" />
                </template> -->

                <!-- cost -->
                <template #item.cost="{ item }">
                    <span>${{ item.cost.toFixed(2) }}</span>
                </template>

                <!-- price -->
                <template #item.price="{ item }">
                    <span>${{ item.price.toFixed(2) }}</span>
                </template>

                <!-- status -->
                <template #item.status="{ item }">
                    <VChip v-bind="resolveStatus(item.status)" density="default" label />
                </template>

                <!-- Actions -->
                <template #item.actions="{ item }">

                    <IconBtn @click="deleteItem(item.id)">
                        <VIcon icon="tabler-trash" />
                    </IconBtn>

                    <IconBtn :to="{ name: 'product-product-create-or-update-id', params: { id: item.id } }">
                        <VIcon icon="tabler-edit" />
                    </IconBtn>

                    <!-- <IconBtn :to="{ name: 'product-management-product-view-id', params: { id: item.id } }">
                        <VIcon icon="tabler-eye" />
                    </IconBtn> -->

                    <IconBtn>
                        <VIcon icon="tabler-dots-vertical" />
                        <VMenu activator="parent">
                            <VList>
                                <VListItem :to="{ name: 'product-product-create-or-update-id', params: { id: item.id } }" value="update" prepend-icon="tabler-edit">
                                    Update
                                </VListItem>

                                <VListItem :to="{ name: 'product-product-view-id', params: { id: item.id } }" prepend-icon="tabler-eye">
                                    View
                                </VListItem>

                                <VListItem value="delete" prepend-icon="tabler-trash" @click="deleteItem(item.id)">
                                    Delete
                                </VListItem>
                            </VList>
                        </VMenu>
                    </IconBtn>
                </template>

                <template #bottom>
                    <VDivider />

                    <div class="d-flex align-center justify-space-between flex-wrap gap-3 pa-5 pt-3">
                        <p class="text-sm text-medium-emphasis mb-0">
                            {{ paginationMeta({ page, itemsPerPage }, totalItems) }}
                        </p>

                        <VPagination v-model="page" :length="Math.min(totalItems / itemsPerPage)"
                            :total-visible="$vuetify.display.xs ? 1 : Math.min(Math.ceil(totalItems / itemsPerPage), 5)">
                            <template #prev="slotProps">
                                <VBtn variant="tonal" color="default" v-bind="slotProps" :icon="false">
                                    Previous
                                </VBtn>
                            </template>

                            <template #next="slotProps">
                                <VBtn variant="tonal" color="default" v-bind="slotProps" :icon="false">
                                    Next
                                </VBtn>
                            </template>
                        </VPagination>
                    </div>
                </template>
                
            </VDataTableServer>
        </VCard>
    </div>

    <!-- Toaster -->
    <Toaster ref="toaster" />

</template>

<style lang="scss" scoped>
.product-widget {
    border-block-end: 1px solid rgba(var(--v-theme-on-surface), var(--v-border-opacity));
    padding-block-end: 1rem;
}
</style>
