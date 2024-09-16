<script lang="ts" setup>
import Toaster from '@/components/toaster/Toaster.vue'
import GoodsIssueNoteEditable from '../components/GoodsIssueNoteEditable.vue'
import InvoiceSendInvoiceDrawer from '@/views/apps/invoice/InvoiceSendInvoiceDrawer.vue'
import PageTitleCreateUpdateView from '@/components/PageTitleCreateUpdateView.vue'
import cloneDeep from 'lodash/cloneDeep'
import type { 
  SchemaInventoryGoodsIssueNoteItem, 
  SchemaDtoUpdateGoodsIssueNoteDto,
  SchemaDtoUpdateGoodsIssueNoteItemDto,
  SchemaEntityEntity,
} from '@/composables/schema'
import type { SchemaInventoryGoodsIssueNoteView } from '@/composables/ext-schema'

const route = useRoute('documents-inventory-goods-issue-note-create-or-update-id')

// 👉 Default Blank Data
const goodsIssueNoteData = ref<SchemaInventoryGoodsIssueNoteView>({
    id: -1,
    gin_number: '',
    receipient_id: -1,
    total_value_gen: 0,
    issue_date: '',
    notes: '',
    items: [
        {
            id: -1,
            gin_id: -1,
            inventory_id: -1,
            quantity: 0,
            unit_value: 0,
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

// 👉 Get GoodsIssueNote
const getGoodsIssueNote = async () => {
  const resp = await getGoodsIssueNoteViewService(parseInt(route.params.id))
  if (resp.status === 200 || resp.status === 201) {
    const data: any = resp.data
    goodsIssueNoteData.value = data.payload
  } else if (resp.message || resp.error) {
    const msg = resp.message || resp.error
    showMultiLineMessage(msg || 'An error occurred while sending the request');
  }
}

// 👉 Create GoodsIssueNote
const createGoodsIssueNote = async () => {
  const gin = cloneDeep(goodsIssueNoteData.value)
  const createDto: SchemaDtoUpdateGoodsIssueNoteDto = {
    goods_issue_note: {
      receipient_id: gin.receipient_id,
      issue_date: gin.issue_date ? new Date(gin.issue_date).toISOString() : new Date().toISOString(),
      notes: gin.notes
    },
  }

  const createGinItemsDto: SchemaDtoUpdateGoodsIssueNoteItemDto[] = []
  gin.items?.forEach((item: SchemaInventoryGoodsIssueNoteItem) => {
    const ginItem : SchemaInventoryGoodsIssueNoteItem = {
      inventory_id: item.inventory_id,
      quantity: item.quantity,
      unit_value: item.unit_value,
    }
    createGinItemsDto.push({
      goods_issue_note_item: ginItem
    })
  })

  createDto.items = createGinItemsDto

  const resp = await createGoodsIssueNoteService(createDto)
  if (resp.status === 200 || resp.status === 201) {
    showMessage('Goods Issue Note created successfully')
  } else if (resp.message || resp.error) {
    const msg = resp.message || resp.error
    showMultiLineMessage(msg || 'An error occurred while sending the request');
  }

  // navigate to view after 2 seconds
  if (resp.status === 200 || resp.status === 201) {
    setTimeout(async () => {
      const redirectTo = '/documents/inventory/goods-issue-note/view/' + gin.id
      await navigateTo({ path: redirectTo })
    }, 1000)
  }
}

// 👉 Update GoodsIssueNote
const updateGoodsIssueNote = async () => {
  const gin = cloneDeep(goodsIssueNoteData.value)
  const updateDto: SchemaDtoUpdateGoodsIssueNoteDto = {
    goods_issue_note: {
      id: gin.id,
      gin_number: gin.gin_number,
      receipient_id: gin.receipient_id,
      issue_date: gin.issue_date ? new Date(gin.issue_date).toISOString() : new Date().toISOString(),
      notes: gin.notes
    },
  }

  const updateGinItemsDto: SchemaDtoUpdateGoodsIssueNoteItemDto[] = []
  gin.items?.forEach((item: SchemaInventoryGoodsIssueNoteItem) => {
    const ginItem : SchemaInventoryGoodsIssueNoteItem = {
      id: item.id,
      gin_id: item.gin_id,
      inventory_id: item.inventory_id,
      quantity: item.quantity,
      unit_value: item.unit_value,
    }
    updateGinItemsDto.push({
      goods_issue_note_item: ginItem
    })
  })

  updateDto.items = updateGinItemsDto

  const resp = await updateGoodsIssueNoteService(updateDto)
  if (resp.status === 200 || resp.status === 201) {
    showMessage('Goods Issue Note updated successfully')
  } else if (resp.message || resp.error) {
    const msg = resp.message || resp.error
    showMultiLineMessage(msg || 'An error occurred while sending the request');
  }

  // navigate to view after 2 seconds
  if (resp.status === 200 || resp.status === 201) {
    setTimeout(async () => {
      const redirectTo = '/documents/inventory/goods-issue-note/view/' + gin.id
      await navigateTo({ path: redirectTo })
    }, 1000)
  }

}

// 👉 Get GoodsIssueNote
if (route.params.id && parseInt(route.params.id) > 0) {
  getGoodsIssueNote()
}

const addProduct = (value: SchemaInventoryGoodsIssueNoteItem) => {
  goodsIssueNoteData?.value?.items?.push(value)
}

const removeProduct = (id: number) => {
  goodsIssueNoteData?.value?.items?.splice(id, 1)
}

const updateReceipient = (entity: SchemaEntityEntity) => {
  goodsIssueNoteData.value.receipient_id = entity.id
}

const handleCreateOrUpdate = () => {
  goodsIssueNoteData.value.id && goodsIssueNoteData.value.id > 0 ? updateGoodsIssueNote() : createGoodsIssueNote()
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
      title="Create / Update Goods Issue Note"
      description="Create or update a goods issue note"
      backlink="documents-inventory-goods-issue-note-list"
    />
    

    <VRow>
      <!-- 👉 InvoiceEditable -->
      <VCol
        cols="12"
        md="9"
      >
        <GoodsIssueNoteEditable
          :goodsIssueNoteData="goodsIssueNoteData"
          @pushItem="addProduct"
          @removeItem="removeProduct"
          @updateReceipient="updateReceipient"
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
