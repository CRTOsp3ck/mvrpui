<script setup lang="ts">
import { ref, watch } from 'vue'
import Toaster from '@/components/toaster/Toaster.vue';

interface Emit {
    (e: 'update:isItemSelected', value: boolean): void
    (e: 'itemData', value: SchemaItemItem): void
}
const emit = defineEmits<Emit>()
const onItemSelected = () => {
  console.log('Item selected:', select.value)
}

const toaster = ref();
const showMessage = (msg: string) => {
  toaster.value.addMessage(msg, 'bottom middle');
}
const showMultiLineMessage = (msg: string) => {
  toaster.value.addMultiLineMessage(msg, 'bottom middle');
}

const loading = ref(false)
const search = ref()
const select = ref(null)

const items = ref<string[]>([])
const itemsData = ref<SchemaItemItem[]>([])

const querySelections = async (query: string) => {
  if (loading.value) return
  loading.value = true
  await fetchItems(query)
  // extract the brand and item name from the itemsData
  items.value = itemsData.value.map((item: SchemaItemItem) => `${item.brand} - ${item.name}`)
  // items.value = states.filter(state => (state || '').toLowerCase().includes((query || '').toLowerCase()))
  loading.value = false
}

watch(search, query => {
  query && query !== select.value && querySelections(query)
})

watch(select, () => {
  const selectedItemData = itemsData.value.find((item: SchemaItemItem) => `${item.brand} - ${item.name}` === select.value)
  emit('update:isItemSelected', true)
  emit('itemData', selectedItemData)
})

const fetchItems = async (query: string) => {
    const req = {
        items_per_page: 50,
        keyword: query,
        order_by: 'created_at',
        page: 1,
        sort_by: "asc",
        type: "product",
    }
    const resp = await searchItemsService(req)
    if (resp.status === 200 || resp.status === 201) {
        itemsData.value = resp.data.payload
    } else if (resp.message || resp.error) {
        showMultiLineMessage(resp.message || resp.error);
    }
}

querySelections('')

</script>

<template>
  <VAutocomplete
    v-model="select"
    v-model:search="search"
    :loading="loading"
    :items="items"
    placeholder="Search for a product"
    label="Select a product to create inventory"
    variant="underlined"
    :menu-props="{ maxHeight: '200px' }"
    @select="onItemSelected"
  />
  
  <!-- Toaster -->
  <Toaster ref="toaster" />
</template>
