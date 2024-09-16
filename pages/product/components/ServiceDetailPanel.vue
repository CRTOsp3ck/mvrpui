<script setup lang="ts">
import startCase from 'lodash/startCase'
import type { SchemaItemItem } from '@/composables/schema'

interface Props {
  serviceData: SchemaItemItem
}
const props = defineProps<Props>()

const isUserInfoEditDialogVisible = ref(false)
const isUpgradePlanDialogVisible = ref(false)
</script>

<template>
  <VRow>
    <!-- SECTION Product Details -->
    <VCol cols="12">
      <VCard v-if="props.serviceData">
        <VCardText class="text-center pt-15">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            :size="100"
            :color="!props.serviceData.customer ? 'primary' : undefined"
            :variant="!props.serviceData.avatar ? 'tonal' : undefined"
          >
            <VImg
              v-if="props.serviceData.avatar"
              :src="props.serviceData.avatar"
            />
            <span
              v-else
              class="text-5xl font-weight-medium"
            >
              {{ avatarText(props.serviceData.name) }}
            </span>
          </VAvatar>

          <!-- 👉 Product fullName -->
          <h4 class="text-h4  mt-4">
            {{ props.serviceData.name }}
          </h4>
          <span class="text-sm">Product ID #{{ props.serviceData.id }}</span>

          <!-- <div class="d-flex justify-center gap-x-5 mt-6">
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
                <span class="text-body-1 font-weight-medium">{{ props.serviceData.order }}</span>
                <span class="text-body-2">Orders</span>
              </div>
            </div>
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
                <span class="text-body-1 font-weight-medium">${{ props.serviceData.totalSpent }}</span>
                <span class="text-body-2">Spent</span>
              </div>
            </div>
          </div> -->
        </VCardText>

        <!-- 👉 Product Details -->
        <VCardText>
          <VDivider class="mb-4" />
          <div class="text-disabled text-uppercase text-sm">
            Details
          </div>

          <VList class="card-list mt-2">
            <VListItem>
              <div class="text-body-1">
                <span class="font-weight-medium me-2">Code:</span>
                <span>
                  {{ props.serviceData.code }}
                </span>
              </div>
            </VListItem>

            <VListItem>
              <div class="text-body-1">
                <span class="font-weight-medium me-2">Name:</span>
                <span>
                  {{ props.serviceData.name }}
                </span>
              </div>
            </VListItem>

            <VListItem>
              <div class="text-body-1">
                <span class="font-weight-medium me-2">Description:</span>
                <span>
                  {{ props.serviceData.description }}
                </span>
              </div>
            </VListItem>

            <VListItem>
              <div class="text-body-1">
                <span class="font-weight-medium me-2">Contractor:</span>
                <span>
                  {{ props.serviceData.brand }}
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
                  {{ startCase(props.serviceData.category) }}
                </VChip>
              </div>
            </VListItem>

            <VListItem>
              <div class="text-body-1">
                <span class="font-weight-medium me-2">SKU:</span>
                <span>
                  {{ props.serviceData.sku }}
                </span>
              </div>
            </VListItem>

            <VListItem>
              <div class="text-body-1">
                <span class="font-weight-medium me-2">Cost:</span>
                <span>
                  ${{ props.serviceData.cost }}
                </span>
              </div>
            </VListItem>

            <VListItem>
              <div class="text-body-1">
                <span class="font-weight-medium me-2">Price:</span>
                <span>
                  ${{ props.serviceData.price }}
                </span>
              </div>
            </VListItem>

            <!-- <VListItem>
              <div class="text-body-1">
                <span class="font-weight-medium me-2">Country Of Origin:</span>
                <span>
                  {{ props.serviceData.origin }}
                </span>
              </div>
            </VListItem> -->

            <VListItem>
              <div class="text-body-1">
                <span class="font-weight-medium me-2">Status:</span>
                <VChip
                  label
                  color="success"
                >
                  {{ startCase(props.serviceData.status) }}
                </VChip>
              </div>
            </VListItem>

          </VList>
        </VCardText>

        <VCardText class="text-center">
          <VBtn :to="{ name: 'product-service-create-or-update-id', params: { id: props.serviceData.id } }">
            Edit Details
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
    <!-- !SECTION -->

    <!-- SECTION  Upgrade to Premium -->
    <!-- <VCol cols="12">
      <VCard
        flat
        class="current-plan"
      >
        <VCardText>
          <div class="d-flex align-center">
            <div>
              <div class="text-xl font-weight-medium mb-4">
                Upgrade to premium
              </div>
              <p class="mb-6 text-wrap">
                Upgrade customer to premium membership to access pro features.
              </p>
            </div>
            <div>
              <VImg
                :src="rocketImg"
                height="108"
                width="108"
              />
            </div>
          </div>
          <VBtn
            color="#fff"
            class="text-primary"
            block
            @click="isUpgradePlanDialogVisible = !isUpgradePlanDialogVisible"
          >
            Upgrade to Premium
          </VBtn>
        </VCardText>
      </VCard>
    </VCol> -->
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
