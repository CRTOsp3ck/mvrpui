<script setup lang="ts">
import { ref, watch } from 'vue'
import Toaster from '@/components/toaster/Toaster.vue';
import type { SchemaInventoryInventoryView } from '@/composables/ext-schema';

interface Props {
  inventoryData?: SchemaInventoryInventoryView
}
const props = defineProps<Props>()

interface Emit {
    (e: 'update:isInventorySelected', value: boolean): void
    (e: 'inventoryData', value: SchemaInventoryInventoryView): void
}
const emit = defineEmits<Emit>()

const toaster = ref();
const showMessage = (msg: string) => {
  toaster.value.addMessage(msg, 'bottom middle');
}
const showMultiLineMessage = (msg: string) => {
  toaster.value.addMultiLineMessage(msg, 'bottom middle');
}

const loading = ref(false)
const search = ref<string>()
const select = ref<string>()

const inventories = ref<string[]>([])
const inventoriesData = ref<SchemaInventoryInventoryView[]>([])

const querySelections = async (query: string) => {
  if (loading.value) return
  loading.value = true
  await fetchInventories(query)
  inventories.value = inventoriesData.value.map(
    (inv: SchemaInventoryInventoryView) => `${inv.item.brand} - ${inv.item.name}`)
  loading.value = false
}

watch(search, query => {
  query && query !== select.value && querySelections(query)
})

watch(select, () => {
  const selectedInventoryData = inventoriesData.value.find(
    (inv: SchemaInventoryInventoryView) => `${inv.item.brand} - ${inv.item.name}` === select.value)
  if (selectedInventoryData) {
    emit('update:isInventorySelected', true)
    emit('inventoryData', selectedInventoryData)
  }
})

const fetchInventories = async (query: string) => {
    const req = {
        items_per_page: 50,
        keyword: query,
        order_by: 'created_at',
        page: 1,
        sort_by: "asc",
        type: "product",
    }
    const resp = await searchInventoryViewsService(req)
    if (resp.status === 200 || resp.status === 201) {
        const data: any = resp.data
        inventoriesData.value = data.payload;
    } else if (resp.message || resp.error) {
        const msg = resp.message || resp.error
        showMultiLineMessage(msg || 'An error occurred while sending the request');
    }
}

if (props.inventoryData) {
  select.value = `${props.inventoryData.item.brand} - ${props.inventoryData.item.name}`
}

querySelections('')

</script>

<template>
  <div>
    <VAutocomplete
      v-model="select"
      v-model:search="search"
      :loading="loading"
      :items="inventories"
      placeholder="Select Inventory"
      label="Select Inventory"
      variant="underlined"
      :menu-props="{ maxHeight: '200px' }"
    />
    
    <!-- Toaster -->
    <Toaster ref="toaster" />
  </div>
</template>
