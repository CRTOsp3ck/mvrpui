<script lang="ts" setup>
import Toaster from '@/components/toaster/Toaster.vue'
import ReturnMerchandiseAuthorizationEditable from '../components/ReturnMerchandiseAuthorizationEditable.vue'
import InvoiceSendInvoiceDrawer from '@/views/apps/invoice/InvoiceSendInvoiceDrawer.vue'
import cloneDeep from 'lodash/cloneDeep'
import type { 
  SchemaInventoryReturnMerchandiseAuthorizationItem, 
  SchemaDtoUpdateReturnMerchandiseAuthorizationDto,
  SchemaDtoUpdateReturnMerchandiseAuthorizationItemDto,
  SchemaEntityEntity,
} from '@/composables/schema'
import type { SchemaInventoryReturnMerchandiseAuthorizationView } from '@/composables/ext-schema'

const route = useRoute('documents-inventory-return-merchandise-authorization-create-or-update-id')

// 👉 Default Blank Data
const rmaData = ref<SchemaInventoryReturnMerchandiseAuthorizationView>({
    id: -1,
    rma_number: '',
    rma_date: '',
    returned_by_customer_id: -1,
    received_by_employee_id: -1,
    total_value_gen: 0,
    notes: '',
    items: [
        {
            id: -1,
            rma_id: -1,
            inventory_id: -1,
            quantity: 0,
            unit_value: 0,
        }
    ],
})

const paymentTerms = ref(true)
const clientNotes = ref(false)
const paymentStub = ref(false)

const isSendSidebarActive = ref(false)
const isAddPaymentSidebarActive = ref(false)

// 👉 Get ReturnMerchandiseAuthorization
const getReturnMerchandiseAuthorization = async () => {
    const resp = await getReturnMerchandiseAuthorizationViewService(parseInt(route.params.id))
    if (resp.status === 200 || resp.status === 201) {
      const data: any = resp.data
      rmaData.value = data.payload
    } else if (resp.message || resp.error) {
        const msg = resp.message || resp.error
        showMultiLineMessage(msg || 'An error occurred while sending the request');
    }
}

// 👉 Create ReturnMerchandiseAuthorization
const createReturnMerchandiseAuthorization = async () => {
  const rma = cloneDeep(rmaData.value)
  const createDto: SchemaDtoUpdateReturnMerchandiseAuthorizationDto = {
      return_merchandise_authorization: {
          returned_by_customer_id: rma.returned_by_customer_id,
          received_by_employee_id: rma.received_by_employee_id,
          rma_date: rma.rma_date ? new Date(rma.rma_date).toISOString() : new Date().toISOString(),
          notes: rma.notes
      },
  }

  const createRmaItemsDto: SchemaDtoUpdateReturnMerchandiseAuthorizationItemDto[] = []
  rma.items?.forEach((item: SchemaInventoryReturnMerchandiseAuthorizationItem) => {
      const rmaItem : SchemaInventoryReturnMerchandiseAuthorizationItem = {
          inventory_id: item.inventory_id,
          quantity: item.quantity,
          unit_value: item.unit_value,
      }
      createRmaItemsDto.push({
          return_merchandise_authorization_item: rmaItem
      })
  })

  createDto.items = createRmaItemsDto

  const resp = await createReturnMerchandiseAuthorizationService(createDto)
  if (resp.status === 200 || resp.status === 201) {
      showMessage('Return Merchandise Authorization created successfully')
  } else if (resp.message || resp.error) {
      const msg = resp.message || resp.error
      showMultiLineMessage(msg || 'An error occurred while sending the request');
  }

  // navigate to view after 2 seconds
  if (resp.status === 200 || resp.status === 201) {
    setTimeout(async () => {
      const redirectTo = '/documents/inventory/return-merchandise-authorization/view/' + rma.id
      await navigateTo({ path: redirectTo })
    }, 1000)
  }
}

// 👉 Update ReturnMerchandiseAuthorization
const updateReturnMerchandiseAuthorization = async () => {
  const rma = cloneDeep(rmaData.value)
  const updateDto: SchemaDtoUpdateReturnMerchandiseAuthorizationDto = {
      return_merchandise_authorization: {
          id: rma.id,
          rma_number: rma.rma_number,
          returned_by_customer_id: rma.returned_by_customer_id,
          received_by_employee_id: rma.received_by_employee_id,
          rma_date: rma.rma_date ? new Date(rma.rma_date).toISOString() : new Date().toISOString(),
          notes: rma.notes
      },
  }

  const updateRmaItemsDto: SchemaDtoUpdateReturnMerchandiseAuthorizationItemDto[] = []
  rma.items?.forEach((item: SchemaInventoryReturnMerchandiseAuthorizationItem) => {
      const rmaItem : SchemaInventoryReturnMerchandiseAuthorizationItem = {
          id: item.id,
          rma_id: item.rma_id,
          inventory_id: item.inventory_id,
          quantity: item.quantity,
          unit_value: item.unit_value,
      }
      updateRmaItemsDto.push({
          return_merchandise_authorization_item: rmaItem
      })
  })

  updateDto.items = updateRmaItemsDto

  const resp = await updateReturnMerchandiseAuthorizationService(updateDto)
  if (resp.status === 200 || resp.status === 201) {
      showMessage('Return Merchandise Authorization updated successfully')
  } else if (resp.message || resp.error) {
      const msg = resp.message || resp.error
      showMultiLineMessage(msg || 'An error occurred while sending the request');
  }

  // navigate to view after 2 seconds
  if (resp.status === 200 || resp.status === 201) {
    setTimeout(async () => {
      const redirectTo = '/documents/inventory/return-merchandise-authorization/view/' + rma.id
      await navigateTo({ path: redirectTo })
    }, 1000)
  }
}

// 👉 Get ReturnMerchandiseAuthorization
if (route.params.id && parseInt(route.params.id) > 0) {
    getReturnMerchandiseAuthorization()
}

const addProduct = (value: SchemaInventoryReturnMerchandiseAuthorizationItem) => {
  rmaData?.value?.items?.push(value)
}

const removeProduct = (id: number) => {
  rmaData?.value?.items?.splice(id, 1)
}

const updateReturnedByCustomer = (entity: SchemaEntityEntity) => {
  rmaData.value.returned_by_customer_id = entity.id
}

const updateReceivedByEmployee = (entity: SchemaEntityEntity) => {
  rmaData.value.received_by_employee_id = entity.id
}

const handleCreateOrUpdate = () => {
  if (rmaData.value.id && rmaData.value.id > 0) {
    updateReturnMerchandiseAuthorization()
  } else {
    createReturnMerchandiseAuthorization()
  }
}

const toaster = ref();
const showMessage = (msg: string) => {
  toaster.value.addMessage(msg, 'bottom middle');
}
const showMultiLineMessage = (msg: string) => {
  toaster.value.addMultiLineMessage(msg, 'bottom middle');
}

</script>

<template>
  <section>
    <!-- 👉 Page Title -->
    <PageTitleCreateUpdateView
      title="Create / Update Return Merchandise Authorization"
      description="Create or update a return merchandise authorization"
      backlink="documents-inventory-return-merchandise-authorization-list"
    />

    <VRow>
      <!-- 👉 InvoiceEditable -->
      <VCol
        cols="12"
        md="9"
      >
        <ReturnMerchandiseAuthorizationEditable
          :rmaData="rmaData"
          @pushItem="addProduct"
          @removeItem="removeProduct"
          @updateReturnedBy="updateReturnedByCustomer"
        />
      </VCol>

      <!-- 👉 Right Column: Invoice Action -->
      <VCol
        cols="12"
        md="3"
      >
        <VCard class="mb-8">
          <VCardText>
            <!-- 👉 Send Invoice -->
            <VBtn
              block
              prepend-icon="tabler-send"
              class="mb-2"
              @click="isSendSidebarActive = true"
            >
              Send
            </VBtn>

            <!-- 👉 Preview -->
            <VBtn
              block
              color="default"
              variant="tonal"
              class="mb-2"
              :to="{ name: 'apps-invoice-preview-id', params: { id: '5036' } }"
            >
              Preview
            </VBtn>

            <!-- 👉 Save -->
            <!-- <VBtn
              block
              color="default"
              variant="tonal"
              @click="isAddPaymentSidebarActive = true"
            > -->
            <VBtn
              block
              color="default"
              variant="tonal"
              @click="handleCreateOrUpdate"
            >
              Save
            </VBtn>
          </VCardText>
        </VCard>

        <!-- 👉 Select payment method -->
        <!-- <AppSelect
          v-model="selectedPaymentMethod"
          :items="paymentMethods"
          label="Accept Payment Via"
          class="mb-6"
        /> -->

        <!-- 👉 Payment Terms -->
        <div class="d-flex align-center justify-space-between mb-2">
          <VLabel for="payment-terms">
            Payment Terms
          </VLabel>
          <div>
            <VSwitch
              id="payment-terms"
              v-model="paymentTerms"
            />
          </div>
        </div>

        <!-- 👉  Client Notes -->
        <div class="d-flex align-center justify-space-between mb-2">
          <VLabel for="client-notes">
            Client Notes
          </VLabel>
          <div>
            <VSwitch
              id="client-notes"
              v-model="clientNotes"
            />
          </div>
        </div>

        <!-- 👉  Payment Stub -->
        <div class="d-flex align-center justify-space-between">
          <VLabel for="payment-stub">
            Payment Stub
          </VLabel>
          <div>
            <VSwitch
              id="payment-stub"
              v-model="paymentStub"
            />
          </div>
        </div>
      </VCol>

      <!-- 👉 Invoice send drawer -->
      <InvoiceSendInvoiceDrawer v-model:isDrawerOpen="isSendSidebarActive" />
    </VRow>

    <!-- 👉 Send Invoice Sidebar -->
    <InvoiceSendInvoiceDrawer v-model:isDrawerOpen="isAddPaymentSidebarActive" />

    <!-- Toaster -->
    <Toaster ref="toaster" />
  </section>
</template>
