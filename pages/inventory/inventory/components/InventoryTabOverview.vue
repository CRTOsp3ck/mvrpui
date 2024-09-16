<script setup lang="ts">
import InventoryTransactionTable from './InventoryTransactionTable.vue'
import type { SchemaInventoryInventoryView } from '@/composables/ext_schema'

interface Props{
  inventoryData: SchemaInventoryInventoryView,
}
const props = defineProps<Props>()
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      md="6"
    >
      <VCard>
        <VCardText class="d-flex gap-y-4 flex-column">
          <div class="d-flex gap-x-6 align-center">
            <VAvatar
                variant="tonal"
                color="primary"
                icon="tabler-currency-dollar"
                rounded
            />
            <h4 class="text-h4">
                Current Valuation
            </h4>
          </div>
          <div>
            <p class="mb-1">
              <span class="text-primary text-h4 me-2">${{ props.inventoryData.total_value_on_hand_gen.toFixed(2) }}</span>
              <span class="text-body-1">Total Price</span>
            </p>
            <p class="mb-0 text-disabled">
                Based on total quantity on hand
            </p>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <VCard>
        <VCardText class="d-flex gap-y-4 flex-column">
          <div class="d-flex gap-x-6 align-center">
            <VAvatar
            variant="tonal"
            color="success"
            icon="tabler-gift-card"
            rounded
            />
            <h4 class="text-h4">
              Quantity Available
            </h4>
          </div>
          <div>
            <p class="mb-1">
              <span class="text-primary text-h4 me-2">{{ props.inventoryData.quantity_available }}</span>
              <span class="text-body-1">Units</span>
            </p>
            <p class="mb-0 text-disabled">
              Receive notification when items go on sale
            </p>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <VCard>
        <VCardText class="d-flex gap-y-4 flex-column">
          <div class="d-flex gap-x-6 align-center">
            <VAvatar
            variant="tonal"
            color="warning"
            icon="tabler-star"
            rounded
            />
            <h4 class="text-h4">
              Quantity Reserved
            </h4>
          </div>
          <div>
            <p class="mb-1">
              <span class="text-primary text-h4 me-2">{{ props.inventoryData.quantity_reserved }}</span>
              <span class="text-body-1">Units</span>
            </p>
            <p class="mb-0 text-disabled">
              Receive notification when items go on sale
            </p>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <VCard>
        <VCardText class="d-flex gap-y-4 flex-column">
          <div class="d-flex gap-x-6 align-center">
            <VAvatar
            variant="tonal"
            color="info"
            icon="tabler-discount-2"
            rounded
            />
            <h4 class="text-h4">
              Quantity Returned
            </h4>
          </div>
          <div>
            <p class="mb-1">
              <span class="text-primary text-h4 me-2">{{ props.inventoryData.quantity_returned }}</span>
              <span class="text-body-1">Units</span>
            </p>
            <p class="mb-0 text-disabled">
              Use coupon on next purchase
            </p>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <VCol>
      <InventoryTransactionTable :inventoryId="inventoryData.id"/>
    </VCol>
  </VRow>
</template>
