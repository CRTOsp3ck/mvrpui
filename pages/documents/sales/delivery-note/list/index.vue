<script setup lang="ts">
import { ref } from 'vue';
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";//
import { AgGridVue } from "ag-grid-vue3";
import 'ag-grid-enterprise'
import type { IServerSideDatasource } from 'ag-grid-community';
import PageTitle from '@/components/PageTitle.vue'
import Toaster from '@/components/toaster/Toaster.vue'
import DeliveryNoteInfoCard from '../components/DeliveryNoteInfoCard.vue'
import CustomerRenderer from '@/pages/documents/sales/components/CustomerRenderer.vue'
import SalesOrderNumberRenderer from '../../sales-order/components/SalesOrderNumberRenderer.vue'
import DeliveryNoteNumberRenderer from '../components/DeliveryNoteNumberRenderer.vue'
import ShippingStatusRenderer from '../components/ShippingStatusRenderer.vue';
import ActionRenderer from '../components/ActionRenderer.vue'

const colDefs = ref([
  { 
    field: "id", 
    enableRowGroup: true, 
    flex: 0.75, 
    checkboxSelection: true,
    headerCheckboxSelection: true, 
    editable: false,
    suppressMovable: true,
  },
  { 
    field: "delivery_note_number", 
    headerName:"Ref No",
    enableRowGroup: true, 
    flex: 0.75, 
    cellRenderer: DeliveryNoteNumberRenderer,
  },
  { 
    field: "sales_order_id", 
    headerName:"Ref SO No",
    enableRowGroup: true, 
    flex: 0.75, 
    cellRenderer: SalesOrderNumberRenderer,
  },
  { 
    field: "customer_id", 
    headerName:"Customer",
    enableRowGroup: true, 
    flex: 2, 
    cellRenderer: CustomerRenderer,
  },
  { 
    field: "base_document.net_amount_gen", 
    headerName:"Total Value", 
    enableRowGroup: true, 
    enableValue: true, 
    flex: 1, 
    valueGetter: (params: any) => { return params.data.base_document.net_amount_gen.toFixed(2); },
  },
  { 
    field: "delivery_note_items", 
    headerName:"Quantity", 
    enableRowGroup: true,  
    enableValue: true, 
    flex: 1,
    valueGetter: (params: any) => { return params.data.delivery_note_items.length + " Items(s)"; },
    hide: true,
  },
  { 
    field: "shipping_date", 
    headerName:"Shipping Date", 
    enableRowGroup: true, 
    flex: 1, 
    valueFormatter: (params: any) => { return new Date(params.value).toLocaleDateString('en-gb'); },
  },
  { 
    field: "shipping_status", 
    headerName:"Shipping Status",
    enableRowGroup: true, 
    flex: 1, 
    cellRenderer: ShippingStatusRenderer,
  },
  { 
    field: "created_at", 
    enableRowGroup: true, 
    flex: 1, 
    headerName:"Created", 
    valueFormatter: (params: any) => { return new Date(params.value).toLocaleDateString('en-gb'); },
    hide: true, 
  },
  { 
    field: "actions", 
    flex: 1, 
    filter: false,
    floatingFilter: false,
    editable: false,
    sortable: false,
    selectable: false,
    cellRenderer: ActionRenderer 
  },
]);

const defaultColDef = ref({
  filter: "agTextColumnFilter",
  floatingFilter: true,
  editable: true,
  sortable: true,
  resizable: true,
  enablePivot: true,
  allowedAggFuncs: ["sum", "min", "max", "avg", "count"],
});

const sideBarDef = ref({
  toolPanels: [
    {
      id: 'columns',
      labelDefault: 'Columns',
      labelKey: 'columns',
      iconKey: 'columns',
      toolPanel: 'agColumnsToolPanel',
    },
    {
      id: 'filters',
      labelDefault: 'Filters',
      labelKey: 'filters',
      iconKey: 'filter',
      toolPanel: 'agFiltersToolPanel',
    },
  ],
  // defaultToolPanel: 'columns',
  hiddenByDefault: false,
  position: 'right',
});

const rowSelection = ref('multiple');
const rowModelType = ref('serverSide');
const pagination = ref(true);
const paginationPageSize = ref(10);
const paginationPageSizeSelector = ref([10, 25, 50]);

const onCellValueChanged = (event:any) => {
  console.log(`New Cell Value: ${event.value}`);
}

const onSelectionChanged = (event:any) => {
  const selectedRows = event.api.getSelectedRows();
  console.log(`Selected Rows: ${selectedRows.map((row: any) => row.mission).join(', ')}`);
}

const gridOptions = ref({
  getRowId: (params: any) => params.data.id.toString(),  
});

const datasource : IServerSideDatasource = {
  getRows(params) {
    if (!params.request.startRow) {
        params.request.startRow = 0;
    }
    if (!params.request.endRow) {
        params.request.endRow = 10;
    }
    const itemsPerPage = params.request.endRow - params.request.startRow;
    const req = {
        server_side_get_rows_request: params.request,
        items_per_page: itemsPerPage,
        keyword: '',
        order_by: 'created_at',
        age: params.request.startRow / itemsPerPage + 1,
        sort_by: 'desc',
    }
    searchDeliveryNoteViewService(req)
    .then((resp) => {
        if (resp.status === 200 || resp.status === 201) {
            const data: any = resp.data
            params.success({
                rowData: data.payload,
                rowCount: data.pagination.total_items
            });
        } else if (resp.message || resp.error) {
            params.fail();
            const msg = resp.message || resp.error
            showMultiLineMessage(msg || 'An error occurred while sending the request');
        }
    })
  }
};

const toaster = ref();
const showMultiLineMessage = (msg: string) => {
  toaster.value.addMultiLineMessage(msg, 'bottom middle');
}

</script>

<template>
  <div>
    <PageTitle 
      title="Delivery Note (DOs) Management" 
      description="View all delivery notes created over the course of selected period." 
    />
  
    <DeliveryNoteInfoCard />

    <ag-grid-vue
      :gridOptions="gridOptions"
      :columnDefs="colDefs"
      :defaultColDef="defaultColDef"
      :rowSelection="rowSelection"
      :suppressRowClickSelection="true"
      :pagination="pagination"
      :paginationPageSize="paginationPageSize"
      :paginationPageSizeSelector="paginationPageSizeSelector"
      :sideBar="sideBarDef"
      :serverSideDatasource="datasource"
      :rowModelType="rowModelType"
      @cell-value-changed="onCellValueChanged"
      @selection-changed="onSelectionChanged"
      style="width: 100%; height: 600px;"
      class="ag-theme-quartz mb-6"
    />

    <VCard class="mb-6">
      <div class="d-flex align-center justify-between flex-wrap gap-4 mx-6 my-6">
        <!-- 👉 Create button -->
        <VBtn :to="{ name: 'documents-sales-delivery-note-create-or-update-id', params: { id: '-1' } }" prepend-icon="tabler-plus">
            Create
        </VBtn>
        <!-- 👉 Export button -->
        <VBtn variant="tonal" color="secondary" prepend-icon="tabler-screen-share">
            Export
        </VBtn>
        <!-- 👉 Print button -->
        <VBtn variant="tonal" color="secondary" prepend-icon="tabler-printer">
            Print
        </VBtn>
      </div>
    </VCard>

  </div>

  <!-- Toaster -->
  <Toaster ref="toaster" />
</template>
