<script lang="ts" setup>
import PageTitleCreateUpdateView from '@/components/PageTitleCreateUpdateView.vue'
import Toaster from '@/components/toaster/Toaster.vue'
import GoodsReturnNoteEditable from '../components/GoodsReturnNoteEditable.vue'
import InvoiceSendInvoiceDrawer from '@/views/apps/invoice/InvoiceSendInvoiceDrawer.vue'
import cloneDeep from 'lodash/cloneDeep'

// Type: Invoice data
import type { 
  SchemaDtoUpdateGoodsReturnNoteDto,
  SchemaDtoUpdateGoodsReturnNoteItemDto,
  SchemaDtoCreateGoodsReturnNoteDto,
  SchemaDtoCreateGoodsReturnNoteItemDto,
  SchemaEntityEntity,
} from '@/composables/schema'
import type { SchemaSaleGoodsReturnNoteItemView, SchemaSaleGoodsReturnNoteView } from '@/composables/ext-schema'

const route = useRoute('documents-sales-goods-return-note-create-or-update-id')

// 👉 Default Blank Data
const grnData = ref<SchemaSaleGoodsReturnNoteView>({
  id: -1,
  base_document_id: -1,
  goods_return_note_number: '',
  return_date: '',
  returned_by_customer_id: -1,
  receiving_location_information: {},
  received_by_employee_id: -1,
  overall_goods_condition: '',
  base_document: {
    id: -1,
    issue_date: '',
    additional_discount_amount: 0,
    custom_adjustment_amount: 0,
    other_fees: 0,
    // payment_instructions: 'none',
    // payment_status: 'partially_paid',
    // payment_terms: 'partial_before_and_after_delivery',
    // shipping_date: '',
    // shipping_method: 'drop_shipping',
    // shipping_terms: 'delivered_at_place',
    remarks: 'Here under ski team many occasionally alas coffee whose then.',
    // terms_and_conditions: 'Lots whenever tonight as handsome yourselves nobody down most murder to under consequently next wearily how previously dynasty who your.',
  },
  goods_return_note_items: [
    {
      id: -1,
      base_document_item_id: -1,
      goods_return_note_id: -1,
      credit_note_id: -1,
      invoice_id: -1,
      rma_item_id: -1,
      sales_order_item_id: -1,
      return_condition: '',
      return_quantity: 0,
      return_reason: '',
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

// 👉 Get GoodsReturnNote
const getGoodsReturnNote = async () => {
    const resp = await getGoodsReturnNoteViewService(parseInt(route.params.id))
    if (resp.status === 200 || resp.status === 201) {
      const data: any = resp.data
      grnData.value = data.payload
    } else if (resp.message || resp.error) {
        const msg = resp.message || resp.error
        showMultiLineMessage(msg || 'An error occurred while sending the request');
    }
}

// 👉 Create GoodsReturnNote
const createGoodsReturnNote = async () => {
  const grn: SchemaSaleGoodsReturnNoteView = cloneDeep(grnData.value)

  // re-parse the date to ISO string format
  const returnDate = grn.return_date ? new Date(grn.return_date).toISOString() : new Date().toISOString()
  const issueDate = grn.base_document.issue_date ? new Date(grn.base_document.issue_date).toISOString() : new Date().toISOString()
  grn.base_document.issue_date = issueDate
  grn.base_document.shipping_date = returnDate
  
  // get the proprietor address as ship from information
  const entity = await getEntityViewService(1)
  const data: any = entity.data
  grn.receiving_location_information = { "address": data.payload.address }

  const createGrnItemsDto: SchemaDtoCreateGoodsReturnNoteItemDto[] = []
  grn.goods_return_note_items.forEach((item: SchemaSaleGoodsReturnNoteItemView) => {
      const grnItemDto : SchemaDtoCreateGoodsReturnNoteItemDto = {
          base_document_item: item.base_document_item,
          goods_return_note_item: {
              id: item.id,
              base_document_item_id: item.base_document_item_id,
              goods_return_note_id: item.goods_return_note_id,
              credit_note_id: item.credit_note_id,
              invoice_id: item.invoice_id,
              rma_item_id: item.rma_item_id,
              sales_order_item_id: item.sales_order_item_id,
              return_condition: item.return_condition,
              return_quantity: item.return_quantity,
              return_reason: item.return_reason,
          }
      }
      createGrnItemsDto.push(grnItemDto)
  })

  const createDto: SchemaDtoCreateGoodsReturnNoteDto = {
    base_document: grn.base_document, 
    goods_return_note: {
      id: grn.id,
      base_document_id: grn.base_document_id,
      goods_return_note_number: grn.goods_return_note_number,
      return_date: returnDate,
      returned_by_customer_id: grn.returned_by_customer_id,
      receiving_location_information: grn.receiving_location_information,
      received_by_employee_id: grn.received_by_employee_id,
      overall_goods_condition: grn.overall_goods_condition,
    },
    items: createGrnItemsDto,
  }

  const resp = await createGoodsReturnNoteService(createDto)
  if (resp.status === 200 || resp.status === 201) {
      showMessage('Sales Order created successfully')
  } else if (resp.message || resp.error) {
      const msg = resp.message || resp.error
      showMultiLineMessage(msg || 'An error occurred while sending the request');
  }

  // navigate to view after 2 seconds
  if (resp.status === 200 || resp.status === 201) {
    setTimeout(async () => {
      const redirectTo = '/documents/sales/goods-return-note/view/' + grn.id
      await navigateTo({ path: redirectTo })
    }, 1000)
  }
}

// 👉 Update GoodsReturnNote
const updateGoodsReturnNote = async () => {
  const grn: SchemaSaleGoodsReturnNoteView = cloneDeep(grnData.value)

  // re-parse the date to ISO string format
  const returnDate = new Date(grn.return_date || '').toISOString()
  const issueDate = new Date(grn.base_document.issue_date || '').toISOString()
  grn.base_document.issue_date = issueDate

  const updateGrnItemsDto: SchemaDtoUpdateGoodsReturnNoteItemDto[] = []
  grn.goods_return_note_items.forEach((item: SchemaSaleGoodsReturnNoteItemView) => {
      const grnItemDto : SchemaDtoCreateGoodsReturnNoteItemDto = {
          base_document_item: item.base_document_item,
          goods_return_note_item: {
              id: item.id,
              base_document_item_id: item.base_document_item_id,
              goods_return_note_id: item.goods_return_note_id,
              credit_note_id: item.credit_note_id,
              invoice_id: item.invoice_id,
              rma_item_id: item.rma_item_id,
              sales_order_item_id: item.sales_order_item_id,
              return_condition: item.return_condition,
              return_quantity: item.return_quantity,
              return_reason: item.return_reason,
          }
      }
      updateGrnItemsDto.push(grnItemDto)
  })

  const updateDto: SchemaDtoUpdateGoodsReturnNoteDto = {
    base_document: grn.base_document,
    goods_return_note: {
      id: grn.id,
      base_document_id: grn.base_document_id,
      goods_return_note_number: grn.goods_return_note_number,
      return_date: returnDate,
      returned_by_customer_id: grn.returned_by_customer_id,
      receiving_location_information: grn.receiving_location_information,
      received_by_employee_id: grn.received_by_employee_id,
      overall_goods_condition: grn.overall_goods_condition,
    },
    items: updateGrnItemsDto,
  }

  const resp = await updateGoodsReturnNoteService(updateDto)
  if (resp.status === 200 || resp.status === 201) {
      showMessage('Goods Issue Note updated successfully')
  } else if (resp.message || resp.error) {
      const msg = resp.message || resp.error
      showMultiLineMessage(msg || 'An error occurred while sending the request');
  }

  // navigate to view after 2 seconds
  if (resp.status === 200 || resp.status === 201) {
    setTimeout(async () => {
      const redirectTo = '/documents/sales/goods-return-note/view/' + grn.id
      await navigateTo({ path: redirectTo })
    }, 1000)
  }
}

// 👉 Get GoodsReturnNote
if (route.params.id && parseInt(route.params.id) > 0) {
    getGoodsReturnNote()
}

const addProduct = (value: SchemaSaleGoodsReturnNoteItemView) => {
  grnData?.value?.goods_return_note_items?.push(value)
}

const removeProduct = (id: number) => {
  grnData?.value?.goods_return_note_items?.splice(id, 1)
}

const updateCustomer = (entity: SchemaEntityEntity) => {
  grnData.value.returned_by_customer_id = entity.id
  grnData.value.customer_info = entity
}

const handleCreateOrUpdate = () => {
  grnData.value.id && grnData.value.id > 0 ? updateGoodsReturnNote() : createGoodsReturnNote()
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
      title="Create / Update Goods Return Note"
      description="Create or update a goods return note"
      backlink="documents-sales-goods-return-note-list"
    />

    <VRow>
      <!-- 👉 InvoiceEditable -->
      <VCol
        cols="12"
        md="9"
      >
        <GoodsReturnNoteEditable
          :grnData="grnData"
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
