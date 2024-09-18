<script lang="ts" setup>
import Toaster from '@/components/toaster/Toaster.vue'
import PageTitleCreateUpdateView from '@/components/PageTitleCreateUpdateView.vue'
import CreditNoteEditable from '../components/CreditNoteEditable.vue'
import InvoiceSendInvoiceDrawer from '@/views/apps/invoice/InvoiceSendInvoiceDrawer.vue'
import cloneDeep from 'lodash/cloneDeep'

// Type: Invoice data
import type { 
  SchemaDtoUpdateCreditNoteDto,
  SchemaDtoUpdateCreditNoteItemDto,
  SchemaDtoCreateCreditNoteDto,
  SchemaDtoCreateCreditNoteItemDto,
  SchemaEntityEntity,
} from '@/composables/schema'
import type { SchemaInvoiceCreditNoteItemView, SchemaInvoiceCreditNoteView } from '@/composables/ext-schema'

const route = useRoute('documents-sales-credit-note-create-or-update-id')

// 👉 Default Blank Data
const creditNoteData = ref<SchemaInvoiceCreditNoteView>({
  id: -1,
  base_document_id: -1,
  credit_note_number: '',
  customer_id: -1,
  issue_date: '',
  reason_for_issuance: '',
  base_document: {
    id: -1,
    issue_date: '',
    additional_discount_amount: 0,
    custom_adjustment_amount: 0,
    other_fees: 0,
    payment_instructions: 'none',
    payment_status: 'partially_paid',
    payment_terms: 'partial_before_and_after_delivery',
    shipping_date: '',
    shipping_method: 'drop_shipping',
    shipping_terms: 'delivered_at_place',
    remarks: 'Here under ski team many occasionally alas coffee whose then.',
    terms_and_conditions: 'Lots whenever tonight as handsome yourselves nobody down most murder to under consequently next wearily how previously dynasty who your.',
  },
  credit_note_items: [
    {
      id: -1,
      credit_note_id: -1,
      base_document_item_id: -1,
      invoice_item_id: undefined,
      name: '',
      description: '',
      quantity: 0,
      unit_value: 0,
      base_document_item: {
          base_document_id: -1,
          id: -1,
          inventory_id: -1,
          quantity: 0,
          unit_discount_amount: 0,
          unit_price: 0,
          unit_shipping_fees: 0,
          unit_tax_amount: 0,
      }
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

// 👉 Get CreditNote
const getCreditNote = async () => {
    const resp = await getCreditNoteViewService(parseInt(route.params.id))
    if (resp.status === 200 || resp.status === 201) {
      const data: any = resp.data
      creditNoteData.value = data.payload
    } else if (resp.message || resp.error) {
        const msg = resp.message || resp.error
        showMultiLineMessage(msg || 'An error occurred while sending the request');
    }
}

// 👉 Create CreditNote
const createCreditNote = async () => {
  const so: SchemaInvoiceCreditNoteView = cloneDeep(creditNoteData.value)

  // re-parse the date to ISO string format
  const paymentDueDate = so.payment_due_date ? new Date(so.payment_due_date).toISOString() : new Date().toISOString()
  const issueDate = so.base_document.issue_date ? new Date(so.base_document.issue_date).toISOString() : new Date().toISOString()
  so.base_document.issue_date = issueDate
  so.base_document.shipping_date = paymentDueDate
  
  // set ship to information as customer address
  so.ship_to_information = { "address": so.customer_info?.address }

  // get the proprietor address as ship from information
  const entity = await getEntityViewService(1)
  so.ship_from_information = { "address": entity.data.payload.address }

  const createSoItemsDto: SchemaDtoCreateCreditNoteItemDto[] = []
  so.credit_note_items.forEach((item: SchemaInvoiceCreditNoteItemView) => {
      const soItemDto : SchemaDtoCreateCreditNoteItemDto = {
          base_document_item: item.base_document_item,
          credit_note_item: {
              id: item.id,
              credit_note_id: item.credit_note_id,
              base_document_item_id: item.base_document_item_id
          }
      }
      createSoItemsDto.push(soItemDto)
  })

  const createDto: SchemaDtoCreateCreditNoteDto = {
    base_document: so.base_document, 
    credit_note: {
      vendor_id: so.vendor_id,
      customer_id: so.customer_id,
      payment_due_date: paymentDueDate,
      ship_from_information: so.ship_from_information,
      ship_to_information: so.ship_to_information,
      sales_representative_employee_id: so.sales_representative_employee_id,
      order_status: so.order_status,
    },
    items: createSoItemsDto,
  }

  const resp = await createCreditNoteService(createDto)
  if (resp.status === 200 || resp.status === 201) {
      showMessage('Sales Order created successfully')
  } else if (resp.message || resp.error) {
      const msg = resp.message || resp.error
      showMultiLineMessage(msg || 'An error occurred while sending the request');
  }

  // navigate to view after 2 seconds
  if (resp.status === 200 || resp.status === 201) {
    setTimeout(async () => {
      const redirectTo = '/documents/sales/credit-note/view/' + so.id
      await navigateTo({ path: redirectTo })
    }, 1000)
  }
}

// 👉 Update CreditNote
const updateCreditNote = async () => {
  const so: SchemaInvoiceCreditNoteView = cloneDeep(creditNoteData.value)

  // re-parse the date to ISO string format
  const paymentDueDate = new Date(so.payment_due_date || '').toISOString()
  const issueDate = new Date(so.base_document.issue_date || '').toISOString()
  so.base_document.issue_date = issueDate

  const updateSoItemsDto: SchemaDtoUpdateCreditNoteItemDto[] = []
  so.credit_note_items.forEach((item: SchemaInvoiceCreditNoteItemView) => {
      const soItemDto : SchemaDtoUpdateCreditNoteItemDto = {
          base_document_item: item.base_document_item,
          credit_note_item: {
              id: item.id,
              credit_note_id: item.credit_note_id,
              base_document_item_id: item.base_document_item_id
          }
      }
      updateSoItemsDto.push(soItemDto)
  })

  const updateDto: SchemaDtoUpdateCreditNoteDto = {
    base_document: so.base_document,
    credit_note: {
      id: so.id,
      base_document_id: so.base_document_id,
      credit_note_number: creditNoteData.value.credit_note_number,
      vendor_id: so.vendor_id,
      customer_id: so.customer_id,
      payment_due_date: paymentDueDate,
      ship_from_information: so.ship_from_information,
      ship_to_information: so.ship_to_information,
      sales_representative_employee_id: so.sales_representative_employee_id,
      order_status: so.order_status,
    },
    items: updateSoItemsDto,
  }

  const resp = await updateCreditNoteService(updateDto)
  if (resp.status === 200 || resp.status === 201) {
      showMessage('Goods Issue Note updated successfully')
  } else if (resp.message || resp.error) {
      const msg = resp.message || resp.error
      showMultiLineMessage(msg || 'An error occurred while sending the request');
  }

  const data: any = resp.data
  const soId = data.payload.id

  // navigate to view after 2 seconds
  if (resp.status === 200 || resp.status === 201) {
    setTimeout(async () => {
      const redirectTo = '/documents/sales/credit-note/view/' + soId
      await navigateTo({ path: redirectTo })
    }, 1000)
  }
}

// 👉 Get CreditNote
if (route.params.id && parseInt(route.params.id) > 0) {
    getCreditNote()
}

const addProduct = (value: SchemaInvoiceCreditNoteItemView) => {
  creditNoteData?.value?.credit_note_items?.push(value)
}

const removeProduct = (id: number) => {
  creditNoteData?.value?.credit_note_items?.splice(id, 1)
}

const updateCustomer = (entity: SchemaEntityEntity) => {
  creditNoteData.value.customer_id = entity.id
  creditNoteData.value.customer_info = entity
}

const handleCreateOrUpdate = () => {
  creditNoteData.value.id && creditNoteData.value.id > 0 ? updateCreditNote() : createCreditNote()
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
      title="Create / Update Credit Note"
      description="Create or update a credit note"
      backlink="documents-sales-credit-note-list"
    />

    <VRow>
      <!-- 👉 InvoiceEditable -->
      <VCol
        cols="12"
        md="9"
      >
        <CreditNoteEditable
          :creditNoteData="creditNoteData"
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
