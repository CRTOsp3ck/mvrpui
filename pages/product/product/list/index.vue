<script setup lang="ts">
import { ref } from 'vue';
import "ag-grid-community/styles/ag-grid.css"; 
import "ag-grid-community/styles/ag-theme-quartz.css";//
import { AgGridVue } from "ag-grid-vue3";
import 'ag-grid-enterprise'
import type { IServerSideDatasource } from 'ag-grid-community';
import startCase from 'lodash/startCase';
import PageTitle from '@/components/PageTitle.vue'
import Toaster from '@/components/toaster/Toaster.vue'
import NameRenderer from '../../components/NameRenderer.vue'
import ActionRenderer from '../../components/ActionRenderer.vue'

const colDefs = ref([
  { 
    field: "id", 
    enableRowGroup: true, 
    flex: 0.75, 
    checkboxSelection: true,
    headerCheckboxSelection: true, 
    editable: false,
    suppressMovable: true,
    filter: 'agNumberColumnFilter', 
  },
  { 
    field: "code", 
    enableRowGroup: true, 
    flex: 1, 
  },
  { 
    field: "brand", 
    enableRowGroup: true, 
    flex: 1, 
  },
  { 
    field: "name", 
    enableRowGroup: true, 
    flex: 2, 
    cellRenderer: NameRenderer 
  },
  { 
    field: "category", 
    enableRowGroup: true, 
    flex: 1.5, 
    valueFormatter: (params: any) => { return startCase(params.value); } 
  },
  { 
    field: "sku", 
    enableRowGroup: true, 
    flex: 1, 
  },
  { 
    field: "cost", 
    enableRowGroup: true,  
    enableValue: true, 
    flex: 0.75, 
    filter: 'agNumberColumnFilter', 
    valueFormatter: (params: any) => { return params.value.toFixed(2); } 
  },
  { 
    field: "price", 
    enableRowGroup: true, 
    enableValue: true, 
    flex: 0.75, 
    filter: 'agNumberColumnFilter', 
    valueFormatter: (params: any) => { return params.value.toFixed(2); } 
  },
  { 
    field: "created_at", 
    enableRowGroup: true, 
    flex: 1, 
    headerName:"Created", 
    cellDataType: 'date',
    filter: 'agDateColumnFilter',
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
    cellRenderer: ActionRenderer 
  },
]);

const defaultColDef = ref({
  filter: "agTextColumnFilter",
  filterParams: {
    closeOnApply: true,
    buttons: ['clear', 'reset', 'cancel'],
  },
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
    const req: any = {
        server_side_get_rows_request: params.request,
        items_per_page: itemsPerPage,
        keyword: '',
        order_by: 'created_at',
        age: params.request.startRow / itemsPerPage + 1,
        sort_by: 'desc',
        type: 'product',
    }
    searchItemsService(req)
    .then((resp) => {
        if (resp.status === 200 || resp.status === 201) {
            const data: any = resp.data
            params.success({
                rowData: data.payload || [],
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
    <PageTitle title="Product List Management" description="List of all products" />

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
        <VBtn :to="{ name: 'product-product-create-or-update-id', params: { id: '-1' } }" prepend-icon="tabler-plus">
            Create
        </VBtn>
        <!-- 👉 Export button -->
        <VBtn variant="tonal" color="secondary" prepend-icon="tabler-screen-share">
            Export
        </VBtn>
        <!-- 👉 Export button -->
        <VBtn variant="tonal" color="secondary" prepend-icon="tabler-printer">
            Print
        </VBtn>
      </div>
    </VCard>

  </div>

  <!-- Toaster -->
  <Toaster ref="toaster" />
</template>
