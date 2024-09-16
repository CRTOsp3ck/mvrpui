<!-- eslint-disable vue/no-mutating-props -->
<script setup lang="ts">
import Toaster from '@/components/toaster/Toaster.vue'
import InventorySearchInput from '@/components/input/InventorySearchInput.vue';
import type { SchemaInventoryInventoryView } from '@/composables/ext-schema';
import type { SchemaBaseBaseDocumentItem } from '@/composables/schema';

const toaster = ref();
const showMultiLineMessage = (msg: string) => {
  toaster.value.addMultiLineMessage(msg, 'bottom middle');
}

interface Emit {
  (e: 'removeProduct', value: number): void
  (e: 'totalAmount', value: number): void
}

interface Props {
  id: number
  data: SchemaBaseBaseDocumentItem
}
const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const selectedInventory = ref<SchemaInventoryInventoryView>()

if (props.data.inventory_id && props.data.inventory_id > 0) {
  const resp = await getInventoryViewService(props.data.inventory_id)
  const data: any = resp.data
  if (data && data.payload) {
    selectedInventory.value = data.payload
  } else if (resp.message || resp.error) {
    const msg = resp.message || resp.error
    showMultiLineMessage(msg || 'An error occurred while sending the request');
  }
}

watch(selectedInventory, () => {
  if (props.data) {
    props.data.inventory_id = selectedInventory.value?.id
    props.data.unit_price = selectedInventory.value?.price_per_unit
  }
}, { immediate: true })

const removeProduct = () => {
  emit('removeProduct', props.id)
}

const totalPrice = computed(() => {
  return Number(props.data.unit_price) * Number(props.data.quantity)
})

watch(totalPrice, () => {
  emit('totalAmount', totalPrice.value)
}, { immediate: true })


</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div class="add-products-header mb-4 d-none d-md-flex ps-5 pe-16">
    <VRow class="font-weight-medium">
      <VCol
        cols="12"
        md="6"
      >
        <h6 class="text-sm font-weight-medium">
          <span class="text-base">
            Item
          </span>
        </h6>
      </VCol>

      <VCol
        cols="12"
        md="2"
      >
        <span class="text-base">
          Cost
        </span>
      </VCol>

      <VCol
        cols="12"
        md="2"
      >
        <span class="text-base">
          Qty
        </span>
      </VCol>

      <VCol
        cols="12"
        md="2"
      >
        <span class="text-base">
          Price
        </span>
      </VCol>
    </VRow>
  </div>

  <VCard
    flat
    border
    class="d-flex flex-row"
  >
    <!-- 👉 Left Form -->
    <div class="pa-5 flex-grow-1">
      <VRow>
        <VCol>
          <InventorySearchInput
            :inventoryData="selectedInventory"
            @inventoryData="selectedInventory = $event"
            class="mb-3"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol
          v-if = "selectedInventory"
          cols="12"
          md="6"
        >
          <AppTextField
            type="text"
            label="Item Name"
            v-model="selectedInventory.item.name"
            readonly
          />
        </VCol>

        <VCol
          v-if = "selectedInventory"
          cols="12"
          md="2"
          sm="4"
        >
          <AppTextField
            v-model="props.data.unit_price"
            type="number"
            label="Cost"
            placeholder="100"
          />
        </VCol>

        <VCol
          v-if = "selectedInventory"
          cols="12"
          md="2"
          sm="4"
        >
          <AppTextField
            v-model="props.data.quantity"
            type="number"
            label="Qty"
          />
        </VCol>

        <VCol
          v-if = "selectedInventory"
          cols="12"
          md="2"
          sm="4"
        >
          <p class="mt-8">
            <span class="d-inline d-md-none">Price: </span>
            <span class="text-body-1">${{ totalPrice }}</span>
          </p>
        </VCol>
      </VRow>
      <VRow>
        <VCol
        >
        <AppTextarea
            v-if = "selectedInventory"
            v-model="selectedInventory.item.description"
            rows="2"
            label="Description"
            placeholder="Item description"
          />
        </VCol>
        
        <VCol
          v-if = "selectedInventory"
        >
          <div class="text-body-2 text-no-wrap mt-4">
            <p class="mb-1">
              Discount
            </p>

            <span>0%</span>

            <span class="mx-2">
              0%
              <VTooltip activator="parent">Tax 1</VTooltip>
            </span>

            <span>
              0%
              <VTooltip activator="parent">Tax 2</VTooltip>
            </span>
          </div>
        </VCol>
      </VRow>

    </div>

    <!-- 👉 Item Actions -->
    <div class="d-flex flex-column justify-space-between border-s pa-1">
      <IconBtn @click="removeProduct">
        <VIcon
          size="20"
          icon="tabler-x"
        />
      </IconBtn>

      <IconBtn>
        <VIcon
          size="20"
          icon="tabler-settings"
        />
      </IconBtn>
    </div>
  </VCard>

  <!-- Toaster -->
  <Toaster ref="toaster" />
</template>
