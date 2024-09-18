<script lang="ts" setup>
import Toaster from '@/components/toaster/Toaster.vue'
import PageTitleCreateUpdateView from '@/components/PageTitleCreateUpdateView.vue'
import PaymentReceiptEditable from '../components/PaymentReceiptEditable.vue'
import InvoiceSendInvoiceDrawer from '@/views/apps/invoice/InvoiceSendInvoiceDrawer.vue'
import cloneDeep from 'lodash/cloneDeep'

// Type: Invoice data
import type { 
  SchemaDtoUpdatePaymentReceiptDto,
  SchemaDtoUpdatePaymentReceiptItemDto,
  SchemaDtoCreatePaymentReceiptDto,
  SchemaDtoCreatePaymentReceiptItemDto,
  SchemaEntityEntity,
  SchemaInvoicePaymentReceiptItem
} from '@/composables/schema'
import type { SchemaInvoicePaymentReceiptView } from '@/composables/ext-schema'

const route = useRoute('documents-sales-payment-receipt-create-or-update-id')

// 👉 Default Blank Data
const paymentReceiptData = ref<SchemaInvoicePaymentReceiptView>({
  id: -1,
  payment_receipt_number: '',
  invoice_id: -1,
  payer_id: -1,
  payee_id: -1,
  date_of_payment: '',
  payee_info: {},
  payer_info: {},
  payment_receipt_items: [
    {
      id: -1,
      payment_receipt_id: -1,
      name: '',
      description: '',
      quantity: 0,
      unit_value: 0
    }
  ], 
})

const paymentTerms = ref(true)
const clientNotes = ref(false)
const paymentStub = ref(false)
const selectedPaymentMethod = ref('Bank Account')
const paymentMethods = ['Bank Account', 'PayPal', 'UPI Transfer']

const isSendSidebarActive = ref(false)
const isAddPaymentSidebarActive = ref(false)

// 👉 Get PaymentReceipt
const getPaymentReceipt = async () => {
    const resp = await getPaymentReceiptViewService(parseInt(route.params.id))
    if (resp.status === 200 || resp.status === 201) {
      const data: any = resp.data
      paymentReceiptData.value = data.payload
    } else if (resp.message || resp.error) {
        const msg = resp.message || resp.error
        showMultiLineMessage(msg || 'An error occurred while sending the request');
    }
}

// 👉 Create PaymentReceipt
const createPaymentReceipt = async () => {
  const so: SchemaInvoicePaymentReceiptView = cloneDeep(paymentReceiptData.value)

  // re-parse the date to ISO string format
  const paymentDate = so.date_of_payment ? new Date(so.date_of_payment).toISOString() : new Date().toISOString()

  const createSoItemsDto: SchemaDtoCreatePaymentReceiptItemDto[] = []
  so.payment_receipt_items?.forEach((item: SchemaInvoicePaymentReceiptItem) => {
      const soItemDto : SchemaDtoCreatePaymentReceiptItemDto = {
          payment_receipt_item: item
      }
      createSoItemsDto.push(soItemDto)
  })

  const createDto: SchemaDtoCreatePaymentReceiptDto = {
    payment_receipt: paymentReceiptData.value,
    items: createSoItemsDto,
  }

  const resp = await createPaymentReceiptService(createDto)
  if (resp.status === 200 || resp.status === 201) {
      showMessage('Sales Order created successfully')
  } else if (resp.message || resp.error) {
      const msg = resp.message || resp.error
      showMultiLineMessage(msg || 'An error occurred while sending the request');
  }

  // navigate to view after 2 seconds
  if (resp.status === 200 || resp.status === 201) {
    setTimeout(async () => {
      const redirectTo = '/documents/sales/payment-receipt/view/' + so.id
      await navigateTo({ path: redirectTo })
    }, 1000)
  }
}

// 👉 Update PaymentReceipt
const updatePaymentReceipt = async () => {
  const so: SchemaInvoicePaymentReceiptView = cloneDeep(paymentReceiptData.value)

  // re-parse the date to ISO string format
  const paymentDate = new Date(so.date_of_payment || '').toISOString()

  const updateSoItemsDto: SchemaDtoUpdatePaymentReceiptItemDto[] = []
  so.payment_receipt_items?.forEach((item: SchemaInvoicePaymentReceiptItem) => {
      const soItemDto : SchemaDtoUpdatePaymentReceiptItemDto = {
          payment_receipt_item: item
      }
      updateSoItemsDto.push(soItemDto)
  })

  const updateDto: SchemaDtoUpdatePaymentReceiptDto = {
    payment_receipt: paymentReceiptData.value,
    items: updateSoItemsDto,
  }

  const resp = await updatePaymentReceiptService(updateDto)
  if (resp.status === 200 || resp.status === 201) {
      showMessage('Payment Receipt updated successfully')
  } else if (resp.message || resp.error) {
      const msg = resp.message || resp.error
      showMultiLineMessage(msg || 'An error occurred while sending the request');
  }

  const data: any = resp.data
  const soId = data.payload.id

  // navigate to view after 2 seconds
  if (resp.status === 200 || resp.status === 201) {
    setTimeout(async () => {
      const redirectTo = '/documents/sales/payment-receipt/view/' + soId
      await navigateTo({ path: redirectTo })
    }, 1000)
  }
}

// 👉 Get PaymentReceipt
if (route.params.id && parseInt(route.params.id) > 0) {
    getPaymentReceipt()
}

const addProduct = (value: SchemaInvoicePaymentReceiptItem) => {
  paymentReceiptData?.value?.payment_receipt_items?.push(value)
}

const removeProduct = (id: number) => {
  paymentReceiptData?.value?.payment_receipt_items?.splice(id, 1)
}

const updateCustomer = (entity: SchemaEntityEntity) => {
  paymentReceiptData.value.payer_id = entity.id || -1
  paymentReceiptData.value.payer_info = entity
}

const handleCreateOrUpdate = () => {
  paymentReceiptData.value.id && paymentReceiptData.value.id > 0 ? updatePaymentReceipt() : createPaymentReceipt()
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
      title="Create / Update Payment Receipt"
      description="Create or update a payment receipt"
      backlink="documents-sales-payment-receipt-list"
    />

    <VRow>
      <!-- 👉 InvoiceEditable -->
      <VCol
        cols="12"
        md="9"
      >
        <PaymentReceiptEditable
          :paymentReceiptData="paymentReceiptData"
          @pushItem="addProduct"
          @removeItem="removeProduct"
          @updateCustomer="updateCustomer"
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
        <AppSelect
          v-model="selectedPaymentMethod"
          :items="paymentMethods"
          label="Accept Payment Via"
          class="mb-6"
        />

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
