<script setup lang="ts">
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import Toaster from '@/components/toaster/Toaster.vue'
import PageTitleCreateUpdateView from '@/components/PageTitleCreateUpdateView.vue'

// Components
import InvoiceAddPaymentDrawer from '@/views/apps/invoice/InvoiceAddPaymentDrawer.vue'
import InvoiceSendInvoiceDrawer from '@/views/apps/invoice/InvoiceSendInvoiceDrawer.vue'
import type { SchemaInvoiceCreditNoteView } from '@/composables/ext-schema'

const route = useRoute('documents-sales-credit-note-view-id')

const isAddPaymentSidebarVisible = ref(false)
const isSendPaymentSidebarVisible = ref(false)

// 👉 Get CreditNote
const getCreditNote = async () => {
    const resp = await getCreditNoteViewService(parseInt(route.params.id))
    if (resp.status === 200 || resp.status === 201) {
        const data: any = resp.data
        creditNote.value = data.payload;
    } else if (resp.message || resp.error) {
        const msg = resp.message || resp.error
        showMultiLineMessage(msg || 'An error occurred while sending the request');
    }
}

const creditNote = ref<SchemaInvoiceCreditNoteView>()
getCreditNote()

// 👉 Print Invoice
const printInvoice = () => {
  window.print()
}

// 👉 Toaster
const toaster = ref();
const showMultiLineMessage = (msg: string) => {
  toaster.value.addMultiLineMessage(msg, 'bottom middle');
}
</script>

<template>
  <section v-if="creditNote">
    
    <!-- 👉 Page Title -->
    <PageTitleCreateUpdateView
      title="View Credit Note Document"
      description="Review a created credit note document"
      backlink="documents-sales-credit-note-list"
    />

    <VRow>
      <VCol
        cols="12"
        md="9"
      >
        <VCard>
          <!-- SECTION Header -->
          <VCardText class="d-flex flex-wrap justify-space-between flex-column flex-sm-row print-row">
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
              <!-- 👉 Invoice ID -->
              <p class="mb-1">
                Credit Note
              </p>
              <h6 class="font-weight-medium text-h4">
                CN #{{ creditNote.id }}
              </h6>

              <!-- 👉 Issue Date -->
              <p class="my-3">
                <span>Date Issued: </span>
                <!-- <span>{{ new Date(creditNote.issue_date).toLocaleDateString('en-GB') }}</span> -->
                <span>{{ new Date(creditNote.issue_date).toLocaleDateString() }}</span>
              </p>

              <!-- 👉 Due Date -->
              <p class="mb-0">
                <span>Credit Date: </span>
                <!-- <span>{{ new Date(creditNote.issue_date).toLocaleDateString('en-GB') }}</span> -->
                <span>{{ new Date(creditNote.issue_date).toLocaleDateString() }}</span>
              </p>
            </div>
          </VCardText>
          <!-- !SECTION -->

          <VDivider />

          <!-- 👉 Payment Details -->
          <VCardText class="d-flex justify-space-between flex-wrap flex-column flex-sm-row print-row">
            <div class="ma-sm-4">
              <h6 class="text-base font-weight-medium mb-6">
                Credit To:
              </h6>
              <p class="mb-1">
                {{ creditNote.customer_info.name ? creditNote.customer_info.name : "Receipient Name" }}
              </p>
              <p class="mb-1">
                {{ creditNote.customer_info.company ? creditNote.customer_info.company : "Receipient Company Name" }}
              </p>
              <p class="mb-1">
                {{ creditNote.customer_info.address ? creditNote.customer_info.address : "Receipient Address" }} 
              </p>
              <!-- <p class="mb-1">
                {{ creditNote.customer_info.country ? creditNote.customer_info.country : "Receipient Country" }}
              </p> -->
              <p class="mb-1">
                {{ creditNote.customer_info.phone ? creditNote.customer_info.phone : "Receipient Contact" }}
              </p>
              <p class="mb-0">
                {{ creditNote.customer_info.email ? creditNote.customer_info.email : "Receipient Email" }}
              </p>
            </div>

            <div class="mt-4 ma-sm-4">
              <h6 class="text-h6 font-weight-medium mb-6">
                Bill To:
              </h6>
              <table>
                <tbody>
                  <tr>
                    <td class="pe-6 pb-1">
                      Total Due:
                    </td>
                    <td class="pb-1">
                      <span class="font-weight-medium">
                        ${{ creditNote.total_value_gen.toFixed(2) }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="pe-6 pb-1">
                      Bank Name:
                    </td>
                    <td class="pb-1">
                      <!-- {{ creditNote.paymentDetails.bankName ? creditNote.paymentDetails.bankName : "Bank Name" }} -->
                      Bank Name
                    </td>
                  </tr>
                  <tr>
                    <td class="pe-6 pb-1">
                      Country:
                    </td>
                    <td class="pb-1">
                      <!-- {{ creditNote.paymentDetails.country ? creditNote.paymentDetails.country : "Country of Payment Origin" }} -->
                      Country of Payment Origin
                    </td>
                  </tr>
                  <tr>
                    <td class="pe-6 pb-1">
                      IBAN:
                    </td>
                    <td class="pb-1">
                      <!-- {{ creditNote.paymentDetails.iban ? creditNote.paymentDetails.iban : "IBAN" }} -->
                      IBAN
                    </td>
                  </tr>
                  <tr>
                    <td class="pe-6 pb-1">
                      SWIFT Code:
                    </td>
                    <td class="pb-1">
                      <!-- {{ creditNote.paymentDetails.swiftCode ? creditNote.paymentDetails.swiftCode : "SWIFT Code" }} -->
                      SWIFT Code
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </VCardText>

          <!-- 👉 Table -->
          <VDivider />

          <VTable class="invoice-preview-table">
            <thead>
              <tr>
                <th scope="col">
                  ITEM
                </th>
                <th scope="col">
                  DESCRIPTION
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  PRICE PER UNIT
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  QTY
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  AMOUNT
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="item in creditNote.credit_note_items"
                :key="item.id"
              >
                <td class="text-wrap">
                  {{ item.name }}
                </td>
                <td class="text-wrap">
                  {{ item.description }}
                </td>
                <td class="text-center">
                  ${{ item.unit_value?.toFixed(2) }}
                </td>
                <td class="text-center">
                  {{ item.quantity }}
                </td>
                <td class="text-center">
                  ${{ (item.unit_value * item.quantity).toFixed(2) }}
                </td>
              </tr>
            </tbody>
          </VTable>

          <VDivider class="mb-2" />

          <!-- Total -->
          <VCardText class="d-flex justify-space-between flex-column flex-sm-row print-row">
            <div class="my-2 mx-sm-4 text-base">
              <div class="d-flex align-center mb-1">
                <h6 class="text-base font-weight-medium me-1">
                  Salesperson:
                </h6>
                <span>Alfie Solomons</span>
              </div>
              <p>Thanks for your business</p>
            </div>

            <div class="my-2 mx-sm-4">
              <table>
                <tbody>
                  <tr>
                    <td class="text-end">
                      <div class="me-5">
                        <p class="mb-2">
                          Subtotal:
                        </p>
                        <!-- <p class="mb-2">
                          Discount:
                        </p>
                        <p class="mb-2">
                          Tax:
                        </p>
                        <p class="mb-2">
                          Shipping:
                        </p> -->
                        <p class="mb-2">
                          Additional Charges:
                        </p>
                        <!-- <p class="mb-2">
                          Custom Adjustment:
                        </p> -->
                        <p class="mb-2">
                          Total:
                        </p>
                      </div>
                    </td>

                    <td class="font-weight-medium text-high-emphasis">
                      <p class="mb-2">
                        ${{ (creditNote.total_value_gen - creditNote.additional_charges).toFixed(2) }}
                      </p>
                      <!-- <p class="mb-2">
                        ${{ (creditNote.base_document.discount_amount_gen + creditNote.base_document.additional_discount_amount).toFixed(2) }}
                      </p> -->
                      <!-- <p class="mb-2">
                        ${{ creditNote.base_document.tax_amount_gen?.toFixed(2) }}
                      </p>
                      <p class="mb-2">
                        ${{ creditNote.base_document.shipping_fees_gen?.toFixed(2) }}
                      </p> -->
                      <p class="mb-2">
                        ${{ creditNote.additional_charges?.toFixed(2) }}
                      </p>
                      <!-- <p class="mb-2">
                        ${{ creditNote.base_document.custom_adjustment_amount?.toFixed(2) }}
                      </p> -->
                      <p class="mb-2">
                        ${{ creditNote.total_value_gen?.toFixed(2) }}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </VCardText>

          <VDivider />

          <VCardText>
            <div class="d-flex mx-sm-4">
              <h6 class="text-base font-weight-medium me-1">
                Note:
              </h6>
              <span>It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance projects. Thank You!</span>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        md="3"
        class="d-print-none"
      >
        <VCard>
          <VCardText>
            <!-- 👉 Send Invoice Trigger button -->
            <VBtn
              block
              prepend-icon="tabler-send"
              class="mb-2"
              @click="isSendPaymentSidebarVisible = true"
            >
              Send
            </VBtn>

            <VBtn
              block
              variant="tonal"
              color="secondary"
              class="mb-2"
            >
              Download
            </VBtn>

            <VBtn
              block
              variant="tonal"
              color="secondary"
              class="mb-2"
              @click="printInvoice"
            >
              Print
            </VBtn>

            <VBtn
              block
              color="secondary"
              variant="tonal"
              class="mb-2"
              :to="{ name: 'documents-sales-credit-note-create-or-update-id', params: { id: route.params.id } }"
            >
              Edit / Update
            </VBtn>

            <!-- 👉  Add Payment trigger button  -->
            <VBtn
              block
              prepend-icon="tabler-currency-dollar"
              @click="isAddPaymentSidebarVisible = true"
            >
              Add Payment
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- 👉 Add Payment Sidebar -->
    <InvoiceAddPaymentDrawer v-model:isDrawerOpen="isAddPaymentSidebarVisible" />

    <!-- 👉 Send Invoice Sidebar -->
    <InvoiceSendInvoiceDrawer v-model:isDrawerOpen="isSendPaymentSidebarVisible" />
  </section>

  <!-- 👉 Toaster -->
  <Toaster ref="toaster" />

</template>

<style lang="scss">
.invoice-preview-table {
  --v-table-row-height: 44px !important;
}

@media print {
  .v-theme--dark {
    --v-theme-surface: 255, 255, 255;
    --v-theme-on-surface: 94, 86, 105;
  }

  body {
    background: none !important;
  }

  @page { margin: 0; size: auto; }

  .layout-page-content,
  .v-row,
  .v-col-md-9 {
    padding: 0;
    margin: 0;
  }

  .product-buy-now {
    display: none;
  }

  .v-navigation-drawer,
  .layout-vertical-nav,
  .app-customizer-toggler,
  .layout-footer,
  .layout-navbar,
  .layout-navbar-and-nav-container {
    display: none;
  }

  .v-card {
    box-shadow: none !important;

    .print-row {
      flex-direction: row !important;
    }
  }

  .layout-content-wrapper {
    padding-inline-start: 0 !important;
  }

  .v-table__wrapper {
    overflow: hidden !important;
  }
}
</style>
