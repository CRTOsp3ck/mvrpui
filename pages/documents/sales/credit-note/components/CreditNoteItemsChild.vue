<!-- eslint-disable vue/no-mutating-props -->
<script setup lang="ts">
import Toaster from '@/components/toaster/Toaster.vue'
import InventorySearchInput from '@/components/input/InventorySearchInput.vue';
import type { SchemaInventoryInventoryView } from '@/composables/ext-schema';
import type { SchemaBaseBaseDocumentItem, SchemaInvoiceCreditNoteItem } from '@/composables/schema';

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
  data?: SchemaInvoiceCreditNoteItem
}
const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const creditNoteItem = ref<SchemaInvoiceCreditNoteItem>()

if (props.data){
  creditNoteItem.value = props.data
} 

watch(creditNoteItem, () => {
  if (props.data) {
    props.data.unit_value = creditNoteItem.value?.unit_value
    props.data.quantity = creditNoteItem.value?.quantity
  }
}, { immediate: true })

const removeProduct = () => {
  emit('removeProduct', props.id)
}

const totalPrice = computed(() => {
  return Number(creditNoteItem.value?.unit_value) * Number(creditNoteItem.value?.quantity)
})

watch(totalPrice, () => {
  emit('totalAmount', totalPrice.value)
}, { immediate: true })


</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div class="add-products-header mb-4 d-none d-md-flex ps-5 pe-16">
    <VRow class="font-weight-medium">
      <VCol cols="12" md="6">
        <h6 class="text-sm font-weight-medium">
          <span class="text-base">
            Item
          </span>
        </h6>
      </VCol>

      <VCol cols="12" md="2">
        <span class="text-base">
          Cost
        </span>
      </VCol>

      <VCol cols="12" md="2">
        <span class="text-base">
          Qty
        </span>
      </VCol>

      <VCol cols="12" md="2">
        <span class="text-base">
          Price
        </span>
      </VCol>
    </VRow>
  </div>

  <VCard flat border class="d-flex flex-row">
    <!-- 👉 Left Form -->
    <div class="pa-5 flex-grow-1">
      <!-- <VRow>
        <VCol>
          <InventorySearchInput
            :inventoryData="selectedInventory"
            @inventoryData="selectedInventory = $event"
            class="mb-3"
          />
        </VCol>
      </VRow> -->

      <VRow>
        <VCol v-if="creditNoteItem" cols="12" md="6">
          <AppTextField
            v-model="creditNoteItem.name"
            type="text"
            label="Item Name"
          />
        </VCol>

        <VCol v-if="creditNoteItem" cols="12" md="2" sm="4">
          <AppTextField
            v-model="creditNoteItem.unit_value"
            type="number"
            label="Cost"
            placeholder="100"
          />
        </VCol>

        <VCol v-if="creditNoteItem" cols="12" md="2" sm="4">
          <AppTextField
            v-model="creditNoteItem.quantity"
            type="number"
            label="Qty"
          />
        </VCol>

        <VCol v-if="creditNoteItem" cols="12" md="2" sm="4">
          <p class="mt-8">
            <span class="d-inline d-md-none">Price: </span>
            <span class="text-body-1">${{ totalPrice }}</span>
          </p>
        </VCol>
      </VRow>

      <VRow v-if="creditNoteItem">
        <VCol>
          <AppTextarea
              v-model="creditNoteItem.description"
              rows="2"
              label="Description"
              placeholder="Item description"
            />
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
