<script setup lang="ts">
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import PageTitleCreateUpdateView from '@/components/PageTitleCreateUpdateView.vue'
import Toaster from '@/components/toaster/Toaster.vue'

// Components
import InvoiceAddPaymentDrawer from '@/views/apps/invoice/InvoiceAddPaymentDrawer.vue'
import InvoiceSendInvoiceDrawer from '@/views/apps/invoice/InvoiceSendInvoiceDrawer.vue'

const route = useRoute('documents-inventory-goods-issue-note-view-id')

const isAddPaymentSidebarVisible = ref(false)
const isSendPaymentSidebarVisible = ref(false)

// 👉 Get GoodsIssueNote
const getGoodsIssueNote = async () => {
    const resp = await getGoodsIssueNoteViewService(parseInt(route.params.id))
    if (resp.status === 200 || resp.status === 201) {
        const data: any = resp.data
        goodsIssueNote.value = data.payload;
    } else if (resp.message || resp.error) {
        const msg = resp.message || resp.error
        showMultiLineMessage(msg || 'An error occurred while sending the request');
    }
}

const goodsIssueNote = ref()
getGoodsIssueNote()

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
  <section v-if="goodsIssueNote">
    <!-- 👉 Page Title -->
    <PageTitleCreateUpdateView
      title="View Goods Issue Note Document"
      description="Review a created goods issue note document"
      backlink="documents-inventory-goods-issue-note-list"
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
                Goods Issue Note
              </p>
              <h6 class="font-weight-medium text-h4">
                GIN #{{ goodsIssueNote.id }}
              </h6>

              <!-- 👉 Issue Date -->
              <p class="my-3">
                <span>Date Issued: </span>
                <!-- <span>{{ new Date(goodsIssueNote.issue_date).toLocaleDateString('en-GB') }}</span> -->
                <span>{{ new Date(goodsIssueNote.issue_date).toLocaleDateString() }}</span>
              </p>

              <!-- 👉 Due Date -->
              <p class="mb-0">
                <span>Due Date: </span>
                <!-- <span>{{ new Date(goodsIssueNote.issue_date).toLocaleDateString('en-GB') }}</span> -->
                <span>{{ new Date(goodsIssueNote.issue_date).toLocaleDateString() }}</span>
              </p>
            </div>
          </VCardText>
          <!-- !SECTION -->

          <VDivider />

          <!-- 👉 Payment Details -->
          <VCardText class="d-flex justify-space-between flex-wrap flex-column flex-sm-row print-row">
            <div class="ma-sm-4">
              <h6 class="text-base font-weight-medium mb-6">
                Invoice To:
              </h6>
              <p class="mb-1">
                {{ goodsIssueNote.receipient.name ? goodsIssueNote.receipient.name : "Receipient Name" }}
              </p>
              <p class="mb-1">
                {{ goodsIssueNote.receipient.company ? goodsIssueNote.receipient.company : "Receipient Company Name" }}
              </p>
              <p class="mb-1">
                {{ goodsIssueNote.receipient.address ? goodsIssueNote.receipient.address : "Receipient Address" }} 
              </p>
              <!-- <p class="mb-1">
                {{ goodsIssueNote.receipient.country ? goodsIssueNote.receipient.country : "Receipient Country" }}
              </p> -->
              <p class="mb-1">
                {{ goodsIssueNote.receipient.phone ? goodsIssueNote.receipient.phone : "Receipient Contact" }}
              </p>
              <p class="mb-0">
                {{ goodsIssueNote.receipient.email ? goodsIssueNote.receipient.email : "Receipient Email" }}
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
                        ${{ goodsIssueNote.total_value_gen.toFixed(2) }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="pe-6 pb-1">
                      Bank Name:
                    </td>
                    <td class="pb-1">
                      <!-- {{ goodsIssueNote.paymentDetails.bankName ? goodsIssueNote.paymentDetails.bankName : "Bank Name" }} -->
                      Bank Name
                    </td>
                  </tr>
                  <tr>
                    <td class="pe-6 pb-1">
                      Country:
                    </td>
                    <td class="pb-1">
                      <!-- {{ goodsIssueNote.paymentDetails.country ? goodsIssueNote.paymentDetails.country : "Country of Payment Origin" }} -->
                      Country of Payment Origin
                    </td>
                  </tr>
                  <tr>
                    <td class="pe-6 pb-1">
                      IBAN:
                    </td>
                    <td class="pb-1">
                      <!-- {{ goodsIssueNote.paymentDetails.iban ? goodsIssueNote.paymentDetails.iban : "IBAN" }} -->
                      IBAN
                    </td>
                  </tr>
                  <tr>
                    <td class="pe-6 pb-1">
                      SWIFT Code:
                    </td>
                    <td class="pb-1">
                      <!-- {{ goodsIssueNote.paymentDetails.swiftCode ? goodsIssueNote.paymentDetails.swiftCode : "SWIFT Code" }} -->
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
                v-for="item in goodsIssueNote.items"
                :key="item.id"
              >
                <td class="text-wrap">
                  {{ item.inventory.item.name }}
                </td>
                <td class="text-wrap">
                  {{ item.inventory.item.description }}
                </td>
                <td class="text-center">
                  ${{ item.unit_value.toFixed(2) }}
                </td>
                <td class="text-center">
                  {{ item.quantity }}
                </td>
                <td class="text-center">
                  ${{ item.total_value_gen.toFixed(2) }}
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
                        <p class="mb-2">
                          Discount:
                        </p>
                        <p class="mb-2">
                          Tax:
                        </p>
                        <p class="mb-2">
                          Total:
                        </p>
                      </div>
                    </td>

                    <td class="font-weight-medium text-high-emphasis">
                      <p class="mb-2">
                        ${{ goodsIssueNote.total_value_gen.toFixed(2) }}
                      </p>
                      <p class="mb-2">
                        $00.00
                      </p>
                      <p class="mb-2">
                        $00.00
                      </p>
                      <p class="mb-2">
                        ${{ goodsIssueNote.total_value_gen.toFixed(2) }}
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
              :to="{ name: 'documents-inventory-goods-issue-note-create-or-update-id', params: { id: route.params.id } }"
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
