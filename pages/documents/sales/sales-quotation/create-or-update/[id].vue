<script lang="ts" setup>
import Toaster from '@/components/toaster/Toaster.vue'
import PageTitleCreateUpdateView from '@/components/PageTitleCreateUpdateView.vue'
import SalesQuotationEditable from '../components/SalesQuotationEditable.vue'
import InvoiceSendInvoiceDrawer from '@/views/apps/invoice/InvoiceSendInvoiceDrawer.vue'
import cloneDeep from 'lodash/cloneDeep'

// Type: Invoice data
import type { 
  SchemaDtoUpdateSalesQuotationDto,
  SchemaDtoUpdateSalesQuotationItemDto,
  SchemaDtoCreateSalesQuotationDto,
  SchemaDtoCreateSalesQuotationItemDto,
  SchemaEntityEntity,
} from '@/composables/schema'
import type { SchemaSaleSalesQuotationItemView, SchemaSaleSalesQuotationView } from '@/composables/ext-schema'

const route = useRoute('documents-sales-sales-quotation-create-or-update-id')

// 👉 Default Blank Data
const salesQuotationData = ref<SchemaSaleSalesQuotationView>({
  id: -1,
  base_document_id: -1,
  sales_quotation_number: '',
  valid_until_date: '',
  vendor_id: 1,
  customer_id: -1,
  ship_to_information: {},
  requested_by: {},
  prepared_by_employee_id: 1,
  quotation_status: 'pending',
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
    terms_and_conditions: 'Lots whenever tonight as handsome yourselves nobody down most murder to under consequently next wearily how previously dynasty who your.',
  },
  sales_quotation_items: [
    {
      id: -1,
      base_document_item_id: -1,
      sales_quotation_id: -1,
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

// 👉 Get SalesQuotation
const getSalesQuotation = async () => {
    const resp = await getSalesQuotationViewService(parseInt(route.params.id))
    if (resp.status === 200 || resp.status === 201) {
      const data: any = resp.data
      salesQuotationData.value = data.payload
    } else if (resp.message || resp.error) {
        const msg = resp.message || resp.error
        showMultiLineMessage(msg || 'An error occurred while sending the request');
    }
}

// 👉 Create SalesQuotation
const createSalesQuotation = async () => {
  const sq: SchemaSaleSalesQuotationView = cloneDeep(salesQuotationData.value)

  // re-parse the date to ISO string format
  const validUntilDate = sq.valid_until_date ? new Date(sq.valid_until_date).toISOString() : new Date().toISOString()
  const issueDate = sq.base_document.issue_date ? new Date(sq.base_document.issue_date).toISOString() : new Date().toISOString()
  sq.base_document.issue_date = issueDate
  sq.base_document.shipping_date = validUntilDate
  
  // set ship to information as customer address
  sq.ship_to_information = { "address": sq.customer_info?.address }
  sq.requested_by = { 
    "name": sq.customer_info?.name, 
    "address": sq.customer_info?.phone, 
    "email": sq.customer_info?.email 
  }

  const sqItemsDto: SchemaDtoCreateSalesQuotationItemDto[] = []
  sq.sales_quotation_items.forEach((item: SchemaSaleSalesQuotationItemView) => {
      const sqItemDto : SchemaDtoCreateSalesQuotationItemDto = {
          base_document_item: item.base_document_item,
          sales_quotation_item: {
              id: item.id,
              sales_quotation_id: item.sales_quotation_id,
              base_document_item_id: item.base_document_item_id
          }
      }
      sqItemsDto.push(sqItemDto)
  })

  const createDto: SchemaDtoCreateSalesQuotationDto = {
    base_document: sq.base_document, 
    sales_quotation: {
      vendor_id: sq.vendor_id,
      customer_id: sq.customer_id,
      valid_until_date: validUntilDate,
      ship_to_information: sq.ship_to_information,
      requested_by: sq.requested_by,
      prepared_by_employee_id: sq.prepared_by_employee_id,
      quotation_status: sq.quotation_status,
    },
    items: sqItemsDto,
  }

  const resp = await createSalesQuotationService(createDto)
  if (resp.status === 200 || resp.status === 201) {
      showMessage('Sales Order created successfully')
  } else if (resp.message || resp.error) {
      const msg = resp.message || resp.error
      showMultiLineMessage(msg || 'An error occurred while sending the request');
  }

  const data: any = resp.data
  const sqId = data.payload.id

  // navigate to view after 2 seconds
  if (resp.status === 200 || resp.status === 201) {
    setTimeout(async () => {
      const redirectTo = '/documents/sales/sales-quotation/view/' + sqId
      await navigateTo({ path: redirectTo })
    }, 1000)
  }
}

// 👉 Update SalesQuotation
const updateSalesQuotation = async () => {
  const sq: SchemaSaleSalesQuotationView = cloneDeep(salesQuotationData.value)

  // re-parse the date to ISO string format
  const validUntilDate = sq.valid_until_date ? new Date(sq.valid_until_date).toISOString() : new Date().toISOString()
  const issueDate = sq.base_document.issue_date ? new Date(sq.base_document.issue_date).toISOString() : new Date().toISOString()
  sq.base_document.issue_date = issueDate
  sq.base_document.shipping_date = validUntilDate
  
  // set ship to information as customer address
  sq.ship_to_information = { "address": sq.customer_info?.address }
  sq.requested_by = { 
    "name": sq.customer_info?.name, 
    "address": sq.customer_info?.phone, 
    "email": sq.customer_info?.email 
  }

  const sqItemsDto: SchemaDtoUpdateSalesQuotationItemDto[] = []
  sq.sales_quotation_items.forEach((item: SchemaSaleSalesQuotationItemView) => {
      const sqItemDto : SchemaDtoUpdateSalesQuotationItemDto = {
          base_document_item: item.base_document_item,
          sales_quotation_item: {
              id: item.id,
              sales_quotation_id: item.sales_quotation_id,
              base_document_item_id: item.base_document_item_id
          }
      }
      sqItemsDto.push(sqItemDto)
  })

  const updateDto: SchemaDtoUpdateSalesQuotationDto = {
    base_document: sq.base_document, 
    sales_quotation: {
      id: sq.id,
      base_document_id: sq.base_document_id,
      sales_quotation_number: sq.sales_quotation_number,
      vendor_id: sq.vendor_id,
      customer_id: sq.customer_id,
      valid_until_date: validUntilDate,
      ship_to_information: sq.ship_to_information,
      requested_by: sq.requested_by,
      prepared_by_employee_id: sq.prepared_by_employee_id,
      quotation_status: sq.quotation_status,
    },
    items: sqItemsDto,
  }

  const resp = await updateSalesQuotationService(updateDto)
  if (resp.status === 200 || resp.status === 201) {
      showMessage('Goods Issue Note updated successfully')
  } else if (resp.message || resp.error) {
      const msg = resp.message || resp.error
      showMultiLineMessage(msg || 'An error occurred while sending the request');
  }

  // navigate to view after 2 seconds
  if (resp.status === 200 || resp.status === 201) {
    setTimeout(async () => {
      const redirectTo = '/documents/sales/sales-quotation/view/' + sq.id
      await navigateTo({ path: redirectTo })
    }, 1000)
  }
}

// 👉 Get SalesQuotation
if (route.params.id && parseInt(route.params.id) > 0) {
    getSalesQuotation()
}

const addProduct = (value: SchemaSaleSalesQuotationItemView) => {
  salesQuotationData?.value?.sales_quotation_items?.push(value)
}

const removeProduct = (id: number) => {
  salesQuotationData?.value?.sales_quotation_items?.splice(id, 1)
}

const updateCustomer = (entity: SchemaEntityEntity) => {
  salesQuotationData.value.customer_id = entity.id
  salesQuotationData.value.customer_info = entity
}

const handleCreateOrUpdate = () => {
  salesQuotationData.value.id && salesQuotationData.value.id > 0 ? updateSalesQuotation() : createSalesQuotation()
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
      title="Create / Update Sales Quotation"
      description="Create or update a sales quotation"
      backlink="documents-sales-sales-quotation-list"
    />
  
    <VRow>
      <!-- 👉 InvoiceEditable -->
      <VCol
        cols="12"
        md="9"
      >
        <SalesQuotationEditable
          :salesQuotationData="salesQuotationData"
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
