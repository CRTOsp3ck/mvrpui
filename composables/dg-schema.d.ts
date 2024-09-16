interface IServerSideDatasource {
  // Grid calls `getRows` when it requires more rows as specified in the params.
  // Params object contains callbacks for responding to the request.
  getRows(params: IServerSideGetRowsParams): void;
  // Optional method, if your datasource has state it needs to clean up. 
  destroy?(): void;
}

interface IServerSideGetRowsParams<TData = any, TContext = any> {
  // Details for the request. A simple object that can be converted to JSON.
  request: IServerSideGetRowsRequest;
  // The parent row node. The RootNode (level -1) if request is top level.
  // This is NOT part fo the request as it cannot be serialised to JSON (a rowNode has methods).
  parentNode: IRowNode;
  // Success callback, pass the rows back to the grid that were requested.
  success(params: LoadSuccessParams): void;
  // Fail callback, tell the grid the call failed so it can adjust it's state.
  fail(): void;
  // The grid api. 
  api: GridApi<TData>;
  // Application context as set on `gridOptions.context`. 
  context: TContext;
}

interface IServerSideGetRowsRequest {
  // First row requested or undefined for all rows. 
  startRow: number  |  undefined;
  // Index after the last row required row or undefined for all rows. 
  endRow: number  |  undefined;
  // Columns that are currently row grouped.  
  rowGroupCols: ColumnVO[];
  // Columns that have aggregations on them.  
  valueCols: ColumnVO[];
  // Columns that have pivot on them.  
  pivotCols: ColumnVO[];
  // Defines if pivot mode is on or off.  
  pivotMode: boolean;
  // What groups the user is viewing.  
  groupKeys: string[];
  // If filtering, what the filter model is.
  // If Advanced Filter is enabled, will be of type `AdvancedFilterModel | null`.
  // If Advanced Filter is disabled, will be of type `FilterModel`.
  filterModel: FilterModel  |  AdvancedFilterModel  |  null;
  // If sorting, what the sort model is.  
  sortModel: SortModelItem[];
}

interface ColumnVO {
  id: string;
  displayName: string;
  field?: string;
  aggFunc?: string;
}

interface FilterModel {
  [colId: string]: any;
}

type AdvancedFilterModel = 
      JoinAdvancedFilterModel 
    | ColumnAdvancedFilterModel


interface JoinAdvancedFilterModel {
  filterType: 'join';
  // How the conditions are joined together 
  type: 'AND'  |  'OR';
  // The filter conditions that are joined by the `type` 
  conditions: AdvancedFilterModel[];
}

type ColumnAdvancedFilterModel = 
      TextAdvancedFilterModel 
    | NumberAdvancedFilterModel 
    | BooleanAdvancedFilterModel 
    | DateAdvancedFilterModel 
    | DateStringAdvancedFilterModel 
    | ObjectAdvancedFilterModel


interface TextAdvancedFilterModel {
  filterType: 'text';
  // The ID of the column being filtered. 
  colId: string;
  // The filter option that is being applied. 
  type: TextAdvancedFilterModelType;
  // The value to filter on. This is the same value as displayed in the input. 
  filter?: string;
}

type TextAdvancedFilterModelType = 
      'equals' 
    | 'notEqual' 
    | 'contains' 
    | 'notContains' 
    | 'startsWith' 
    | 'endsWith' 
    | 'blank' 
    | 'notBlank'


interface NumberAdvancedFilterModel {
  filterType: 'number';
  // The ID of the column being filtered. 
  colId: string;
  // The filter option that is being applied. 
  type: ScalarAdvancedFilterModelType;
  // The value to filter on. 
  filter?: number;
}

type ScalarAdvancedFilterModelType = 
      'equals' 
    | 'notEqual' 
    | 'lessThan' 
    | 'lessThanOrEqual' 
    | 'greaterThan' 
    | 'greaterThanOrEqual' 
    | 'blank' 
    | 'notBlank'


interface BooleanAdvancedFilterModel {
  filterType: 'boolean';
  // The ID of the column being filtered. 
  colId: string;
  // The filter option that is being applied. 
  type: BooleanAdvancedFilterModelType;
}

type BooleanAdvancedFilterModelType = 'true' | 'false'

interface DateAdvancedFilterModel {
  filterType: 'date';
  // The ID of the column being filtered. 
  colId: string;
  // The filter option that is being applied. 
  type: ScalarAdvancedFilterModelType;
  // The value to filter on. This is in format `YYYY-MM-DD`. 
  filter?: string;
}

interface DateStringAdvancedFilterModel {
  filterType: 'dateString';
  // The ID of the column being filtered. 
  colId: string;
  // The filter option that is being applied. 
  type: ScalarAdvancedFilterModelType;
  // The value to filter on. This is in format `YYYY-MM-DD`. 
  filter?: string;
}

interface ObjectAdvancedFilterModel {
  filterType: 'object';
  // The ID of the column being filtered. 
  colId: string;
  // The filter option that is being applied. 
  type: TextAdvancedFilterModelType;
  // The value to filter on. This is the same value as displayed in the input. 
  filter?: string;
}

interface SortModelItem {
  // Column Id to apply the sort to. 
  colId: string;
  // Sort direction 
  sort: 'asc'  |  'desc';
}

interface LoadSuccessParams {
  // Data retrieved from the server as requested by the grid.
  rowData: any[];
  // The last row, if known, to help Infinite Scroll.
  rowCount?: number;
  // Any extra information for the grid to associate with this load.
  groupLevelInfo?: any;
  // The pivot fields in the response - if provided the grid will attempt to generate secondary columns.
  pivotResultFields?: string[];
}