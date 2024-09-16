<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { ref, computed, watch } from 'vue'
import { paginationMeta } from '@api-utils/paginationMeta'
import CreateEntityDrawer from '@/components/drawers/CreateEntityDrawer.vue'
import UpdateEntityDrawer from '@/components/drawers/UpdateEntityDrawer.vue'
import Toaster from '@/components/toaster/Toaster.vue'
import type { SchemaEntityEntity } from '@/composables/schema'

interface Props{
    entityType: string,
}
const props = defineProps<Props>()

// 👉 Store
const searchQuery = ref('')
const selectedRole = ref()
const selectedPlan = ref()
const selectedStatus = ref()

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

// Headers
const headers = [
    { title: 'User', key: 'user' },
    { title: 'Code', key: 'code' },
    { title: 'Phone', key: 'phone' },
    { title: 'Actions', key: 'actions', sortable: false },
]

const fetchEntities = async () => {
    isFetching.value = true
    const req = {
        items_per_page: itemsPerPage.value,
        keyword: searchQuery.value,
        order_by: orderBy.value || 'created_at',
        page: page.value,
        sort_by: sortBy.value,
        type: props.entityType,
    }
    const resp = await searchEntitiesService(req)
    if (resp.status === 200 || resp.status === 201) {
        const data: any = resp.data
        entities.value = data.payload;
        totalEntities.value = data.pagination.total_items;
    } else if (resp.message || resp.error) {
        const msg = resp.message || resp.error
        showMultiLineMessage(msg || 'An error occurred while sending the request');
    }
    isFetching.value = false
}

const createEntity = async (entityData: SchemaEntityEntity) => {
    const resp = await createEntityService(entityData)
    if (resp.message || resp.error) {
        const msg = resp.message || resp.error
        showMultiLineMessage(msg || 'An error occurred while sending the request');
    }
    if (!isFetching.value) {
        fetchEntities();
    }
}

const updateEntity = async (entityData: SchemaEntityEntity) => {
    const resp = await updateEntityService(entityData)
    if (resp.message || resp.error) {
        const msg = resp.message || resp.error
        showMultiLineMessage(msg || 'An error occurred while sending the request');
    }
    if (!isFetching.value) {
        fetchEntities();
    }
}

const deleteEntity = async (entityId: number) => {
    entities.value = entities.value.filter((user) => user.id !== entityId)
    const resp = await deleteEntityService(entityId)
    if (resp.message || resp.error) {
        const msg = resp.message || resp.error
        showMultiLineMessage(msg || 'An error occurred while sending the request');
    }
    if (entities.value.length === 0 && page.value > 1) {
        // If no more entities on current page and it's not the first page, go back to the previous page
        page.value -= 1;
    }
    if (!isFetching.value) {
        fetchEntities();
    }
}

const toaster = ref();
const showMessage = (msg: string) => {
  toaster.value.addMessage(msg, 'bottom middle');
}
const showMultiLineMessage = (msg: string) => {
  toaster.value.addMultiLineMessage(msg, 'bottom middle');
}

// Initial fetch
const isFetching = ref(false)
fetchEntities()

// Watchers to refetch entities on pagination options change
watch([page, itemsPerPage, sortBy, orderBy], fetchEntities)

// Entities data
const entities = ref<SchemaEntityEntity[]>([])
const totalEntities = ref(0)
const entityToUpdate = ref<SchemaEntityEntity>()

const isCreateEntityDrawerVisible = ref(false)
const isUpdateEntityDrawerVisible = ref(false)

const startUpdateEntitySession = (entity: SchemaEntityEntity) => {
    entityToUpdate.value = entity
    isUpdateEntityDrawerVisible.value = true
}

const getViewEntityPathByType = () => {
    switch (props.entityType) {
        case 'employee':
            return 'entity-employee-view-id'
        case 'customer':
            return 'entity-customer-view-id'
        case 'supplier':
            return 'entity-vendor-view-id'
        default:
            return null
    }
}

// 👉 search filters
const roles = [
    { title: 'Admin', value: 'admin' },
    { title: 'Author', value: 'author' },
    { title: 'Editor', value: 'editor' },
    { title: 'Maintainer', value: 'maintainer' },
    { title: 'Subscriber', value: 'subscriber' },
]

const plans = [
    { title: 'Basic', value: 'basic' },
    { title: 'Company', value: 'company' },
    { title: 'Enterprise', value: 'enterprise' },
    { title: 'Team', value: 'team' },
]

const status = [
    { title: 'Pending', value: 'pending' },
    { title: 'Active', value: 'active' },
    { title: 'Inactive', value: 'inactive' },
]

const widgetData = ref([
    { title: 'Session', value: '21,459', change: 29, desc: 'Total Users', icon: 'tabler-user', iconColor: 'primary' },
    { title: 'Paid Users', value: '4,567', change: 18, desc: 'Last Week Analytics', icon: 'tabler-user-plus', iconColor: 'error' },
    { title: 'Active Users', value: '19,860', change: -14, desc: 'Last Week Analytics', icon: 'tabler-user-check', iconColor: 'success' },
    { title: 'Pending Users', value: '237', change: 42, desc: 'Last Week Analytics', icon: 'tabler-user-exclamation', iconColor: 'warning' },
])
</script>

<template>
    <section>
        <!-- 👉 Widgets -->
        <div class="d-flex mb-6">
            <VRow>
                <template v-for="(data, id) in widgetData" :key="id">
                    <VCol cols="12" md="3" sm="6">
                        <VCard>
                            <VCardText>
                                <div class="d-flex justify-space-between">
                                    <div class="d-flex flex-column gap-y-1">
                                        <span class="text-body-1 text-medium-emphasis">{{ data.title }}</span>
                                        <div>
                                            <h4 class="text-h4">
                                                {{ data.value }}
                                                <span class="text-base" :class="data.change > 0 ? 'text-success' : 'text-error'">
                                                    ({{prefixWithPlus(data.change) }}%)
                                                </span>
                                            </h4>
                                        </div>
                                        <span class="text-sm">{{ data.desc }}</span>
                                    </div>
                                    <VAvatar :color="data.iconColor" variant="tonal" rounded size="38">
                                        <VIcon :icon="data.icon" size="26" />
                                    </VAvatar>
                                </div>
                            </VCardText>
                        </VCard>
                    </VCol>
                </template>
            </VRow>
        </div>

        <VCard title="Filters" class="mb-6">
            <VCardText>
                <VRow>
                    <!-- 👉 Select Role -->
                    <VCol cols="12" sm="4">
                        <AppSelect v-model="selectedRole" label="Select Role" placeholder="Select Role" :items="roles"
                            clearable clear-icon="tabler-x" />
                    </VCol>
                    <!-- 👉 Select Plan -->
                    <VCol cols="12" sm="4">
                        <AppSelect v-model="selectedPlan" label="Select Plan" placeholder="Select Plan" :items="plans"
                            clearable clear-icon="tabler-x" />
                    </VCol>
                    <!-- 👉 Select Status -->
                    <VCol cols="12" sm="4">
                        <AppSelect v-model="selectedStatus" label="Select Status" placeholder="Select Status"
                            :items="status" clearable clear-icon="tabler-x" />
                    </VCol>
                </VRow>
            </VCardText>
        </VCard>

        <VCard>
            <VCardText class="d-flex flex-wrap py-4 gap-4">
                <div class="me-3 d-flex gap-3">
                    <AppSelect :model-value="itemsPerPage" :items="[
                        { value: 10, title: '10' },
                        { value: 25, title: '25' },
                        { value: 50, title: '50' },
                        { value: 100, title: '100' },
                        { value: -1, title: 'All' },
                    ]" style="inline-size: 6.25rem;" @update:model-value="itemsPerPage = parseInt($event, 10)" />
                </div>
                <VSpacer />

                <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
                    <!-- 👉 Search  -->
                    <div style="inline-size: 10rem;">
                        <AppTextField v-model="searchQuery" placeholder="Search" density="compact" />
                    </div>

                    <!-- 👉 Export button -->
                    <VBtn variant="tonal" color="secondary" prepend-icon="tabler-screen-share">
                        Export
                    </VBtn>

                    <!-- 👉 Add user button -->
                    <VBtn prepend-icon="tabler-plus" @click="isCreateEntityDrawerVisible=true">
                        Add New User
                    </VBtn>
                </div>
            </VCardText>

            <VDivider />

            <!-- SECTION datatable -->
            <VDataTableServer 
                v-if="entities && entities.length" 
                :key="page"
                v-model:items-per-page="itemsPerPage" 
                v-model:page="page" 
                :items="entities"
                :items-length="totalEntities" 
                :headers="headers" 
                class="text-no-wrap" 
                @update:options="updateOptions"
            >
                <!-- User -->
                <template #item.user="{ item }">
                    <div class="d-flex align-center">
                        <VAvatar size="34" :variant="!item.avatar ? 'tonal' : undefined" class="me-3">
                            <VImg v-if="item.avatar" :src="item.avatar" />
                            <span v-else>{{ avatarText(item.name).slice(0,2) }}</span>
                        </VAvatar>
                        <div class="d-flex flex-column">
                            <h6 class="text-base">
                                <NuxtLink :to="{ name: getViewEntityPathByType(), params: { id: item.id } }"
                                    class="font-weight-medium text-link">
                                    {{ item.name }}
                                </NuxtLink>
                            </h6>
                            <span class="text-sm text-medium-emphasis">{{ item.email }}</span>
                        </div>
                    </div>
                </template>

                <!-- Code -->
                <!-- <template #item.plan="{ item }">
                    <span class="text-capitalize font-weight-medium">{{ item.code }}</span>
                </template> -->

                <!-- 👉 Role -->
                <!-- <template #item.role="{ item }">
                    <div class="d-flex align-center gap-4">
                        <VAvatar :size="30" :color="resolveUserRoleVariant(item.role).color" variant="tonal">
                            <VIcon :size="20" :icon="resolveUserRoleVariant(item.role).icon" />
                        </VAvatar>
                        <span class="text-capitalize">{{ item.role }}</span>
                    </div>
                </template> -->

                <!-- Plan -->
                <!-- <template #item.plan="{ item }">
                    <span class="text-capitalize font-weight-medium">{{ item.currentPlan }}</span>
                </template> -->

                <!-- Status -->
                <!-- <template #item.status="{ item }">
                    <VChip :color="resolveUserStatusVariant(item.status)" size="small" label class="text-capitalize">
                        {{ item.status }}
                    </VChip>
                </template> -->

                <!-- Actions -->
                <template #item.actions="{ item }">

                    <IconBtn @click="deleteEntity(item.id)">
                        <VIcon icon="tabler-trash" />
                    </IconBtn>

                    <IconBtn @click="startUpdateEntitySession(item)">
                        <VIcon icon="tabler-edit" />
                    </IconBtn>

                    <!-- <IconBtn :to="{ name: getViewEntityPathByType(), params: { id: item.id } }">
                        <VIcon icon="tabler-eye" />
                    </IconBtn> -->

                    <VBtn icon variant="text" size="small" color="medium-emphasis">
                        <VIcon size="24" icon="tabler-dots-vertical" />
                        <VMenu activator="parent">
                            <VList>
                                <VListItem @click="startUpdateEntitySession(item)">
                                    <template #prepend>
                                        <VIcon icon="tabler-pencil" />
                                    </template>
                                    <VListItemTitle>Update</VListItemTitle>
                                </VListItem>

                                <VListItem :to="{ name: getViewEntityPathByType(), params: { id: item.id } }">
                                    <template #prepend>
                                        <VIcon icon="tabler-eye" />
                                    </template>
                                    <VListItemTitle>View</VListItemTitle>
                                </VListItem>

                                <VListItem @click="deleteEntity(item.id)">
                                    <template #prepend>
                                        <VIcon icon="tabler-trash" />
                                    </template>
                                    <VListItemTitle>Delete</VListItemTitle>
                                </VListItem>
                            </VList>
                        </VMenu>
                    </VBtn>
                </template>

                <!-- pagination -->
                <template #bottom>
                    <VDivider />
                    <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3">
                        <p class="text-sm text-disabled mb-0">
                            {{ paginationMeta({ page, itemsPerPage }, totalEntities) }}
                        </p>

                        <VPagination v-model="page" :length="Math.ceil(Math.min(totalEntities / itemsPerPage))"
                            :total-visible="$vuetify.display.xs ? 1 : Math.min(Math.ceil(totalEntities / itemsPerPage), 5)">
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

            <VCard
                v-else
                title="Initial Load"
            >
                <VCardText>
                <p>You can specifically add Initial Load action using <code>loading</code> prop</p>
                <span>Refresh the page to see it again in action.</span>
                </VCardText>
            </VCard>
            <!-- SECTION -->
             
        </VCard>

        <!-- 👉 Create Entity -->
        <CreateEntityDrawer 
            v-model:isDrawerOpen="isCreateEntityDrawerVisible" 
            :entityType="props.entityType"
            @entityData="createEntity" 
        />

        <!-- 👉 Update Entity -->
        <UpdateEntityDrawer 
            v-if="entityToUpdate"
            v-model:isDrawerOpen="isUpdateEntityDrawerVisible" 
            :entityType="props.entityType"
            :entity="entityToUpdate"
            @entityData="updateEntity" 
        />

        <!-- Toaster -->
        <Toaster ref="toaster" />

    </section>
</template>