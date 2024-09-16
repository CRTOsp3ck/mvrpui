<script setup lang="ts">
import { VDataTable } from 'vuetify/labs/VDataTable'
import Toaster from '@/components/toaster/Toaster.vue';
import type { SchemaSaleSalesOrderView } from '@/composables/ext-schema'

const route = useRoute('documents-sales-sales-order-view-id')
const isConfirmDialogVisible = ref(false)
const isUserInfoEditDialogVisible = ref(false)
const isEditAddressDialogVisible = ref(false)

const toaster = ref();
const showMultiLineMessage = (msg: string) => {
  toaster.value.addMultiLineMessage(msg, 'bottom middle');
}

const headers = [
  { title: 'Product', key: 'productName' },
  { title: 'Price', key: 'price' },
  { title: 'Quantity', key: 'quantity' },
  { title: 'Total', key: 'total' },
]

const orderData = ref<SchemaSaleSalesOrderView>()
const orderDataItems = ref<SchemaSaleSalesOrderView['sales_order_items']>([])
const orderId = ref(parseInt(route.params.id))

if (orderId.value > 0) {
  const resp = await getSalesOrderViewService(orderId.value)
  if (resp.status === 200 || resp.status === 201) {
    const data: any = resp.data
    orderData.value = data.payload
    orderDataItems.value = data.payload.sales_order_items
  } else if (resp.message || resp.error) {
    const msg = resp.message || resp.error
    showMultiLineMessage(msg || 'An error occurred while sending the request');
  }
}



</script>

<template>
  <div>
    <div class="d-flex justify-space-between align-center flex-wrap gap-y-4 mb-6">
      <div>
        <div class="d-flex gap-2 align-center mb-2 flex-wrap">
          <h4 class="text-h4">
            Order #{{ route.params.id }}
          </h4>
          <div class="d-flex gap-x-2">
            <VChip
              variant="tonal"
              color="success"
              label
            >
              Paid
            </VChip>
            <VChip
              variant="tonal"
              color="info"
              label
            >
              Ready to Pickup
            </VChip>
          </div>
        </div>
        <div>
          <span class="text-body-1">
            {{ orderData ? new Date(orderData.created_at || '').toLocaleString() : '' }}
          </span>
        </div>
      </div>

      <VBtn
        variant="tonal"
        color="error"
        @click="isConfirmDialogVisible = !isConfirmDialogVisible"
      >
        Delete Order
      </VBtn>
    </div>

    <VRow>
      <VCol
        cols="12"
        md="8"
      >
        <!-- 👉 Order Details -->
        <VCard class="mb-6">
          <VCardItem>
            <template #title>
              <h5 class="text-h5">
                Order Details
              </h5>
            </template>
            <template #append>
              <VBtn variant="text">
                Edit
              </VBtn>
            </template>
          </VCardItem>

          <VDivider />
          <VDataTable
            :headers="headers"
            :items="orderDataItems"
            item-value="productName"
            show-select
            class="text-no-wrap"
          >
            <template #item.productName="{ item }">
              <div class="d-flex align-center">
                <!-- <VAvatar size="38" :variant="'tonal'" class="me-3">
                  <VImg
                    v-if="item.avatar && item.avatar.length"
                    :src="item.avatar"
                  />
                  <span v-else>{{ avatarText(item.inventory_info.item.name).slice(0,2) }}</span>
                </VAvatar> -->
                <div class="d-flex flex-column">
                  <span>
                      <NuxtLink :to="{ name: 'inventory-inventory-view-id', params: { id: item.inventory_info.id } }"
                      class="text-body-1 font-weight-medium">
                      {{ item.inventory_info.item.name }}
                    </NuxtLink>
                  </span>
                  <span class="text-sm text-disabled">
                    {{ item.inventory_info.item.brand }}
                  </span>
                </div>
              </div>
            </template>

            <template #item.price="{ item }">
              <span>${{ item.base_document_item.unit_price.toFixed(2) }}</span>
            </template>

            <template #item.total="{ item }">
              <span class="text-h6 ">
                ${{ (item.base_document_item.unit_price * item.base_document_item.quantity).toFixed(2) }}
              </span>
            </template>

            <template #item.quantity="{ item }">
              <span class="text-high-emphasis font-weight-medium">{{ item.base_document_item.quantity }}</span>
            </template>

            <template #bottom />
          </VDataTable>
          <VDivider />

          <VCardText>
            <div class="d-flex align-end flex-column">
              <table class="text-high-emphasis">
                <tbody>
                  <tr>
                    <td width="200px">
                      Subtotal:
                    </td>
                    <td>
                      ${{  orderData?.base_document?.gross_amount_gen?.toFixed(2) }}
                    </td>
                  </tr>
                  <br />
                  <tr>
                    <td>Discount Total: </td>
                    <td>
                      - ${{ orderData?.base_document?.discount_amount_gen?.toFixed(2) }}
                    </td>
                  </tr>
                  <tr>
                    <td>Additional Discount: </td>
                    <td>
                      - ${{ orderData?.base_document?.additional_discount_amount?.toFixed(2) }}
                    </td>
                  </tr>
                  <br />
                  <tr>
                    <td>Shipping Total: </td>
                    <td>
                      ${{ orderData?.base_document?.shipping_fees_gen?.toFixed(2) }}
                    </td>
                  </tr>
                  <tr>
                    <td>Tax: </td>
                    <td>
                      ${{ orderData?.base_document?.tax_amount_gen?.toFixed(2) }}
                    </td>
                  </tr>
                  <tr>
                    <td>Other Fees: </td>
                    <td>
                      ${{ orderData?.base_document?.other_fees?.toFixed(2) }}
                    </td>
                  </tr>
                  <tr>
                    <td>Custom Adjustment: </td>
                    <td>
                      ${{ orderData?.base_document?.custom_adjustment_amount?.toFixed(2) }}
                    </td>
                  </tr>
                  <br />
                  <tr>
                    <td class="text-high-emphasis font-weight-medium">
                      Total:
                    </td>
                    <td class="font-weight-medium">
                      ${{ orderData?.base_document?.net_amount_gen?.toFixed(2) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </VCardText>
        </VCard>

        <!-- 👉 Shipping Activity -->
        <VCard title="Shipping Activity">
          <VCardText>
            <VTimeline
              truncate-line="both"
              align="start"
              side="end"
              line-color="primary"
              density="compact"
              class="v-timeline-density-compact"
            >
              <VTimelineItem
                dot-color="primary"
                size="x-small"
              >
                <div class="d-flex justify-space-between align-center">
                  <div class="app-timeline-title">
                    Order was placed (Order ID: #32543)
                  </div>
                  <div class="app-timeline-meta">
                    Tuesday 10:20 AM
                  </div>
                </div>
                <p class="app-timeline-text mb-0">
                  Your order has been placed successfully
                </p>
              </VTimelineItem>

              <VTimelineItem
                dot-color="primary"
                size="x-small"
              >
                <div class="d-flex justify-space-between align-center">
                  <span class="app-timeline-title">Pick-up</span>
                  <span class="app-timeline-meta">Wednesday 11:29 AM</span>
                </div>
                <p class="app-timeline-text mb-0">
                  Pick-up scheduled with courier
                </p>
              </VTimelineItem>

              <VTimelineItem
                dot-color="primary"
                size="x-small"
              >
                <div class="d-flex justify-space-between align-center">
                  <span class="app-timeline-title">Dispatched</span>
                  <span class="app-timeline-meta">Thursday 8:15 AM</span>
                </div>
                <p class="app-timeline-text mb-0">
                  Item has been picked up by courier.
                </p>
              </VTimelineItem>

              <VTimelineItem
                dot-color="primary"
                size="x-small"
              >
                <div class="d-flex justify-space-between align-center">
                  <span class="app-timeline-title">Package arrived</span>
                  <span class="app-timeline-meta">Saturday 15:20 AM</span>
                </div>
                <p class="app-timeline-text mb-0">
                  Package arrived at an Amazon facility, NY
                </p>
              </VTimelineItem>

              <VTimelineItem
                dot-color="primary"
                size="x-small"
              >
                <div class="d-flex justify-space-between align-center">
                  <span class="app-timeline-title">Dispatched for delivery</span>
                  <span class="app-timeline-meta">Today 14:12 PM</span>
                </div>
                <p class="app-timeline-text mb-0">
                  Package has left an Amazon facility , NY
                </p>
              </VTimelineItem>

              <VTimelineItem
                dot-color="secondary"
                size="x-small"
              >
                <div class="d-flex justify-space-between align-center">
                  <span class="app-timeline-title">Delivery</span>
                </div>
                <p class="app-timeline-text mb-0">
                  Package will be delivered by tomorrow
                </p>
              </VTimelineItem>
            </VTimeline>
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        md="4"
      >
        <!-- 👉 Customer Details  -->
        <VCard class="mb-6">
          <VCardText class="d-flex flex-column gap-y-6">
            <div class="text-body-1 text-high-emphasis font-weight-medium">
              Customer Details
            </div>

            <div class="d-flex align-center">
              <VAvatar size="34" :variant="'tonal'" class="me-3">
                  <span>{{ avatarText(orderData?.customer_info?.name || '').slice(0,2) }}</span>
              </VAvatar>
              <div class="d-flex flex-column">
                <div>
                  <div>
                    <NuxtLink :to="{ name: 'entity-customer-view-id', params: { id: orderData?.customer_id } }"
                    class="text-body-1 font-weight-medium text-link">
                      {{ orderData?.customer_info?.name }}
                    </NuxtLink>
                  </div>
                  <span class="text-sm text-disabled">Customer ID: #{{ orderData?.customer_info?.id }}</span>
                </div>
              </div>              
            </div>

            <div>
              <VAvatar
                variant="tonal"
                color="success"
                class="me-3"
              >
                <VIcon icon="tabler-shopping-cart" />
              </VAvatar>
              <span class="text-body-1 font-weight-medium text-high-emphasis">12 Orders</span>
            </div>

            <div class="d-flex flex-column gap-y-1">
              <div class="d-flex justify-space-between align-center text-body-2">
                <span class="text-body-1 text-high-emphasis font-weight-medium">Contact Info</span>
                <VBtn
                  variant="text"
                  density="compact"
                  @click="isUserInfoEditDialogVisible = !isUserInfoEditDialogVisible"
                >
                  Edit
                </VBtn>
              </div>
              <span>Email: {{ orderData?.customer_info?.email }}</span>
              <span>Mobile: {{ orderData?.customer_info?.phone }}</span>
            </div>
          </VCardText>
        </VCard>

        <!-- 👉 Shipping Address -->
        <VCard class="mb-6">
          <VCardText>
            <div class="d-flex align-center justify-space-between">
              <div class="text-body-1 text-high-emphasis font-weight-medium">
                Shipping Address
              </div>
              <VBtn
                variant="text"
                density="compact"
                @click="isEditAddressDialogVisible = !isEditAddressDialogVisible"
              >
                Edit
              </VBtn>
            </div>
            <div class="pr-12">
              {{ orderData?.ship_to_information?.address }}
            </div>
          </VCardText>
        </VCard>

        <!-- 👉 Billing Address -->
        <VCard>
          <VCardText>
            <div class="d-flex align-center justify-space-between">
              <div class="text-body-1 text-high-emphasis font-weight-medium">
                Billing Address
              </div>
              <VBtn
                variant="text"
                density="compact"
                @click="isEditAddressDialogVisible = !isEditAddressDialogVisible"
              >
                Edit
              </VBtn>
            </div>
            <div class="pr-12">
              {{ orderData?.customer_info?.address }}
            </div>

            <div class="mt-6">
              <div class="text-body-1 text-body-1 text-high-emphasis font-weight-medium">
                Mastercard
              </div>
              <div class="text-body-1">
                Card Number: ******4291
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <ConfirmDialog
      v-model:isDialogVisible="isConfirmDialogVisible"
      confirmation-question="Are you sure to cancel your Order?"
      cancel-msg="Order cancelled!!"
      cancel-title="Cancelled"
      confirm-msg="Your order cancelled successfully."
      confirm-title="Cancelled!"
    />

    <UserInfoEditDialog v-model:isDialogVisible="isUserInfoEditDialogVisible" />

    <AddEditAddressDialog v-model:isDialogVisible="isEditAddressDialogVisible" />

    <!-- 👉 Toaster -->
    <Toaster ref="toaster" />
  </div>
</template>
