<script setup lang="ts">
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import EntitySearchInput from '@/components/input/EntitySearchInput.vue'
import ReturnMerchandiseAuthorizationItemsChild from './ReturnMerchandiseAuthorizationItemsChild.vue'
import { ref, computed } from 'vue'
import type { 
  SchemaEntityEntity,
  SchemaInventoryReturnMerchandiseAuthorization,
  SchemaInventoryReturnMerchandiseAuthorizationItem, 
} from '@/composables/schema'
import type { SchemaInventoryReturnMerchandiseAuthorizationView } from '@/composables/ext-schema'

interface Props {
  rmaData: SchemaInventoryReturnMerchandiseAuthorizationView
}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'pushItem', value: SchemaInventoryReturnMerchandiseAuthorizationItem): void
  (e: 'removeItem', id: number): void
  (e: 'updateReturnedBy', entity: SchemaEntityEntity): void
}>()

const salesperson = ref()
const thanksNote = ref()
const note = ref()

// 👉 Add item function
const addItem = () => {
  const newItem: SchemaInventoryReturnMerchandiseAuthorizationItem = {
    inventory_id: -1,
    unit_value: 0,
    quantity: 0,
  };
  emit('pushItem', newItem);
}

// 👉 Remove Product edit section
const removeProduct = (id: number) => {
  emit('removeItem', id);
}

const returnedBy = ref<SchemaEntityEntity>()

// 👉 Update selected returned by customer
const updateReturnedBy = (entity: SchemaEntityEntity) => {
  returnedBy.value = entity
  emit('updateReturnedBy', entity)
}

// 👉 Computed subtotal
const subtotal = computed(() => {
  return props.rmaData.items?.reduce((sum, item) => {
    if (!item.unit_value || !item.quantity) return sum;
    return sum + (item.unit_value * item.quantity);
  }, 0);
});

</script>

<template>
  <VCard>
    <!-- SECTION Header -->
    <VCardText class="d-flex flex-wrap justify-space-between gap-y-5 flex-column flex-sm-row">
      <!-- 👉 Left Content -->
      <div class="ma-sm-4">
        <div class="d-flex align-center mb-6">
          <!-- 👉 Logo -->
          <VNodeRenderer
            :nodes="themeConfig.app.logo"
            class="me-3"
          />

          <!-- 👉 Title -->
          <h6 class="font-weight-bold text-capitalize text-h4">
            {{ themeConfig.app.title }}
          </h6>
        </div>

        <!-- 👉 Address -->
        <p class="mb-0">
          Office 149, 450 South Brand Brooklyn
        </p>
        <p class="my-2">
          San Diego County, CA 91905, USA
        </p>
        <p class="mb-0">
          +1 (123) 456 7891, +44 (876) 543 2198
        </p>
      </div>

      <!-- 👉 Right Content -->
      <div class="mt-4 ma-sm-4">
        <!-- 👉 Invoice Id -->
        <h6 class="d-flex align-center font-weight-medium justify-sm-end text-xl mb-3">
          <span
            class="me-3 text-h4"
            style="inline-size: 6rem;"
          >RMA #</span>

          <span>
            <AppTextField
              v-model="props.rmaData.id"
              disabled
              density="compact"
              style="inline-size: 9.5rem;"
            />
          </span>
        </h6>

        <!-- 👉 Issue Date -->
        <div class="d-flex align-center justify-sm-end mb-3">
          <span
            class="me-3"
            style="inline-size: 6rem;"
          >Date Issued</span>

          <span style="inline-size: 9.5rem;">
            <AppDateTimePicker
              v-model="props.rmaData.rma_date"
              density="compact"
              placeholder="YYYY-MM-DD"
              :config="{ position: 'auto right' }"
            />
          </span>
        </div>

        <!-- 👉 Due Date -->
        <div class="d-flex align-center justify-sm-end mb-0">
          <span
            class="me-3"
            style="inline-size: 6rem;"
          >Due Date</span>

          <span style="min-inline-size: 9.5rem;">
            <!-- <AppDateTimePicker
              v-model="invoice.dueDate"
              density="compact"
              placeholder="YYYY-MM-DD"
              :config="{ position: 'auto right' }"
            /> -->
            <AppDateTimePicker
              v-model="props.rmaData.rma_date"
              density="compact"
              placeholder="YYYY-MM-DD"
              :config="{ position: 'auto right' }"
            />
          </span>
        </div>
      </div>
    </VCardText>
    <!-- !SECTION -->

    <VDivider />

    <EntitySearchInput
      v-model="returnedBy"
      :entityId="props.rmaData.returned_by_customer_id"
      @entityData="updateReturnedBy"
    />

    <VCardText class="d-flex flex-wrap justify-space-between flex-column flex-sm-row gap-y-5 gap-4">
      <div
        class="ma-sm-4"
        style="inline-size: 15.5rem;"
      >
        <h6 class="text-base font-weight-medium mb-6">
          Returned By:
        </h6>

        <p class="mb-1">
          {{ props.rmaData.returned_by_info?.name }}
        </p>
        <p class="mb-1">
          Returned By Company Name
        </p>
        <p class="mb-1">
          {{ props.rmaData.returned_by_info?.address }}
        </p>
        <p class="mb-1">
          {{ props.rmaData.returned_by_info?.phone }}
        </p>
        <p class="mb-0">
          {{ props.rmaData.returned_by_info?.email }}
        </p>
      </div>

      <div class="ma-sm-4">
        <h6 class="text-base font-weight-medium mb-6">
          Bill To:
        </h6>

        <table>
          <tbody>
            <tr>
              <td class="pe-6 pb-1">
                Total Due:
              </td>
              <td class="font-weight-medium pb-1">
                ${{ props.rmaData.total_value_gen }}
              </td>
            </tr>

            <tr>
              <td class="pe-6 pb-1">
                Bank Name:
              </td>
              <td class="pb-1">
                <!-- {{ props.data.paymentDetails.bankName }} -->
                Bank Name
              </td>
            </tr>

            <tr>
              <td class="pe-6 pb-1">
                Country:
              </td>
              <td class="pb-1">
                <!-- {{ props.data.paymentDetails.country }} -->
                Payment Country of Origin
              </td>
            </tr>

            <tr>
              <td class="pe-6 pb-1">
                IBAN:
              </td>
              <td class="pb-1">
                <!-- {{ props.data.paymentDetails.iban }} -->
                IBAN Code
              </td>
            </tr>

            <tr>
              <td class="pe-6 pb-1">
                SWIFT Code:
              </td>
              <td class="pb-1">
                <!-- {{ props.data.paymentDetails.swiftCode }} -->
                SWIFT Code
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </VCardText>

    <VDivider />

    <!-- 👉 Add goods issue note items -->
    <VCardText class="add-products-form">
      <div
        v-for="(item, index) in props.rmaData.items"
        :key="item.id"
        class="my-4 ma-sm-4"
      >
        <ReturnMerchandiseAuthorizationItemsChild
          :id="index"
          :data="item"
          @removeProduct="removeProduct"
        />
      </div>

      <div class="mt-4 ma-sm-4">
        <VBtn @click="addItem">
          Add Item
        </VBtn>
      </div>
    </VCardText>

    <VDivider />

    <!-- 👉 Total Amount -->
    <VCardText class="d-flex justify-space-between flex-wrap flex-column flex-sm-row">
      <div class="mx-sm-4 my-4">
        <div class="d-flex align-center mb-4">
          <h6 class="text-sm font-weight-medium me-10">
            Salesperson:
          </h6>
          <AppTextField
            v-model="salesperson"
            style="inline-size: 10rem;"
            placeholder="John Doe"
          />
        </div>

        <AppTextField
          v-model="thanksNote"
          placeholder="Message"
        />
      </div>

      <div class="mx-sm-4 my-4">
        <table class="w-100">
          <tbody>
            <tr>
              <td class="pe-16">
                Subtotal:
              </td>
              <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                <h6 class="text-sm">
                  ${{ subtotal }}
                </h6>
              </td>
            </tr>
            <tr>
              <td class="pe-16">
                Discount:
              </td>
              <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                <h6 class="text-sm">
                  $0
                </h6>
              </td>
            </tr>
            <tr>
              <td class="pe-16">
                Tax:
              </td>
              <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                <h6 class="text-sm">
                  6%
                </h6>
              </td>
            </tr>
          </tbody>
        </table>

        <VDivider class="mt-4 mb-3" />

        <table class="w-100">
          <tbody>
            <tr>
              <td class="pe-16">
                Total:
              </td>
              <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                <h6 class="text-sm">
                  ${{ subtotal }}
                </h6>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </VCardText>

    <VDivider />

    <VCardText class="mx-sm-4">
      <p class="font-weight-medium text-sm text-high-emphasis mb-2">
        Note:
      </p>
      <AppTextarea
        v-model="note"
        placeholder="Write note here..."
        :rows="2"
      />
    </VCardText>
  </VCard>
</template>
