<script setup lang="ts">
import { ref } from 'vue';
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { AgGridVue } from "ag-grid-vue3"; // Vue Data Grid Component
import 'ag-grid-enterprise'; // Import the Enterprise features

import CompanyLogoRenderer from './CompanyLogoRenderer.vue';
import MissionResultRenderer from './MissionResultRenderer.vue';

const rowData = ref([]);
   const colDefs = ref([
     { field: "mission", checkboxSelection: true },
     { field: "company", cellRenderer: CompanyLogoRenderer },
     { field: "location" },
     { field: "date", valueFormatter: (params: any) => { return new Date(params.value).toDateString(); } },
     { field: "price", valueFormatter: (params: any) => { return '£' + params.value.toLocaleString(); } },
     { field: "successful", cellRenderer: MissionResultRenderer },
     { field: "rocket" }
   ]);

const defaultColDef = ref({
  filter: "agTextColumnFilter",
  floatingFilter: true,
  editable: true,
});

const rowSelection = ref('multiple');
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

// Fetch data when the component is mounted
onMounted(async () => {
 rowData.value = await fetchData();
});

const fetchData = async () => {
 const response = await fetch('https://www.ag-grid.com/example-assets/space-mission-data.json');
 return response.json();
};
</script>

<template>
  <div>
    <!-- The AG Grid component -->
    <ag-grid-vue
      :rowData="rowData"
      :columnDefs="colDefs"
      :defaultColDef="defaultColDef"
      :rowSelection="rowSelection"
      :suppressRowClickSelection="true"
      :pagination="pagination"
      :paginationPageSize="paginationPageSize"
      :paginationPageSizeSelector="paginationPageSizeSelector"
      :sideBar="false"
      @cell-value-changed="onCellValueChanged"
      @selection-changed="onSelectionChanged"
      style="width: 100%; height: 600px;"
      class="ag-theme-quartz"
    >
    </ag-grid-vue>
  </div>
</template>


