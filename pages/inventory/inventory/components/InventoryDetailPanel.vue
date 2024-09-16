<script setup lang="ts">
import type { SchemaInventoryInventoryView } from '@/composables/ext-schema';
import rocketImg from '@images/eCommerce/rocket.png'
import startCase from 'lodash/startCase'

interface Props {
  inventoryData: SchemaInventoryInventoryView
}
const props = defineProps<Props>()

const isUserInfoEditDialogVisible = ref(false)
const isUpgradePlanDialogVisible = ref(false)
</script>

<template>
  <VRow>
    <!-- SECTION Product Details -->
    <VCol cols="12">
      <VCard v-if="props.inventoryData">
        <VCardText class="text-center pt-15">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            :size="100"
            :color="!props.inventoryData.item.customer ? 'primary' : undefined"
            :variant="!props.inventoryData.item.avatar ? 'tonal' : undefined"
          >
            <VImg
              v-if="props.inventoryData.item.avatar"
              :src="props.inventoryData.item.avatar"
            />
            <span
              v-else
              class="text-5xl font-weight-medium"
            >
              {{ avatarText(props.inventoryData.item.name) }}
            </span>
          </VAvatar>

          <!-- 👉 Product fullName -->
          <h4 class="text-h4  mt-4">
            {{ props.inventoryData.item.name }}
          </h4>
          <span class="text-sm">Product ID #{{ props.inventoryData.item.id }}</span>

          <div class="d-flex justify-center gap-x-5 mt-6">

            <!-- Quantity Total -->
            <div class="d-flex align-center">
              <VAvatar
                variant="tonal"
                color="primary"
                rounded
                class="me-3"
              >
                <VIcon icon="tabler-shopping-cart" />
              </VAvatar>
              <div class="d-flex flex-column align-start">
                <span class="text-body-1 font-weight-medium">{{ props.inventoryData.quantity_total_gen }}</span>
                <span class="text-body-2">Total Quantity</span>
              </div>
            </div>

            <!-- Total Value On Hand -->
            <div class="d-flex align-center">
              <VAvatar
                variant="tonal"
                color="primary"
                rounded
                class="me-3"
              >
                <VIcon icon="tabler-currency-dollar" />
              </VAvatar>
              <div class="d-flex flex-column align-start">
                <span class="text-body-1 font-weight-medium">${{ props.inventoryData.total_value_on_hand_gen?.toFixed(2) }}</span>
                <span class="text-body-2"> Total Valuation</span>
              </div>
            </div>
            
          </div>
        </VCardText>

        <!-- 👉 Product Details -->
        <VCardText>
          <VDivider class="my-4" />
          <div class="text-disabled text-uppercase text-sm">
            Details
          </div>

          <VList class="card-list mt-2">
            <VListItem>
              <div class="text-body-1">
                <span class="font-weight-medium me-2">Code:</span>
                <span>
                  {{ props.inventoryData.item.code }}
                </span>
              </div>
            </VListItem>

            <VListItem>
              <div class="text-body-1">
                <span class="font-weight-medium me-2">Name:</span>
                <span>
                  {{ props.inventoryData.item.name }}
                </span>
              </div>
            </VListItem>

            <VListItem>
              <div class="text-body-1">
                <span class="font-weight-medium me-2">Description:</span>
                <span>
                  {{ props.inventoryData.item.description }}
                </span>
              </div>
            </VListItem>

            <VListItem>
              <div class="text-body-1">
                <span class="font-weight-medium me-2">Brand:</span>
                <span>
                  {{ props.inventoryData.item.brand }}
                </span>
              </div>
            </VListItem>

            <VListItem>
              <div class="text-body-1">
                <span class="font-weight-medium me-2">Category:</span>
                <VChip
                  label
                  color="success"
                >
                  {{ startCase(props.inventoryData.item.category) }}
                </VChip>
              </div>
            </VListItem>

            <VListItem>
              <div class="text-body-1">
                <span class="font-weight-medium me-2">SKU:</span>
                <span>
                  {{ props.inventoryData.item.sku }}
                </span>
              </div>
            </VListItem>

            <VListItem>
              <div class="text-body-1">
                <span class="font-weight-medium me-2">Cost:</span>
                <span>
                  ${{ props.inventoryData.item.cost }}
                </span>
              </div>
            </VListItem>

            <VListItem>
              <div class="text-body-1">
                <span class="font-weight-medium me-2">Price:</span>
                <span>
                  ${{ props.inventoryData.item.price }}
                </span>
              </div>
            </VListItem>

            <VListItem>
              <div class="text-body-1">
                <span class="font-weight-medium me-2">Country Of Origin:</span>
                <span>
                  {{ props.inventoryData.item.origin }}
                </span>
              </div>
            </VListItem>

            <VListItem>
              <div class="text-body-1">
                <span class="font-weight-medium me-2">Status:</span>
                <VChip
                  label
                  color="success"
                >
                  {{ startCase(props.inventoryData.item.status) }}
                </VChip>
              </div>
            </VListItem>

          </VList>
        </VCardText>

        <VCardText class="text-center">
          <VBtn :to="{ name: 'inventory-inventory-create-or-update-id', params: { id: props.inventoryData.id } }">
            Edit Details
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>
  <UserInfoEditDialog v-model:isDialogVisible="isUserInfoEditDialogVisible" />
  <UserUpgradePlanDialog v-model:isDialogVisible="isUpgradePlanDialogVisible" />
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.75rem;
}

.current-plan{
  background: linear-gradient(45deg, rgb(var(--v-theme-primary)) 0%, #9E95F5 100%);
  color: #fff;
}
</style>
