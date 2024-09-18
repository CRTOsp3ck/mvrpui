import type { 
    SchemaItemItem,
    SchemaInventoryInventoryTransaction,
    SchemaInventoryGoodsIssueNoteItem,
    SchemaInventoryReturnMerchandiseAuthorizationItem,
    SchemaInvoicePaymentReceiptItem,
    SchemaEntityEntity,
    SchemaBaseBaseDocument,
    SchemaBaseBaseDocumentItem, 
} from './schema';

export type SchemaInventoryInventoryView = {
    id?: number;
    inventory_number?: string;
    item_id?: number;
    quantity_reserved?: number;
    quantity_available?: number;
    quantity_returned?: number;
    quantity_total_gen?: number;
    cost_per_unit?: number;
    price_per_unit?: number;
    total_value_on_hand_gen?: number;
    reorder_level?: number;
    reorder_quantity?: number;
    is_discontinued?: boolean;
    remarks?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    item: SchemaItemItem;
    transactions?: SchemaInventoryInventoryTransaction[];
};

export type SchemaInventoryGoodsIssueNoteView = {
    id?: number;
    gin_number?: string;
    receipient_id?: number;
    total_value_gen?: number;
    issue_date?: string;
    notes?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    receipient?: SchemaEntityEntity;
    items?: SchemaInventoryGoodsIssueNoteItem[];
};

export type SchemaInventoryReturnMerchandiseAuthorizationView = {
    id?: number;
    rma_number?: string;
    returned_by_customer_id?: number;
    received_by_employee_id?: number;
    total_value_gen?: number;
    rma_date?: string;
    notes?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    items?: SchemaInventoryReturnMerchandiseAuthorizationItem[];
    returned_by_info?: SchemaEntityEntity;
    received_by_info?: SchemaEntityEntity;
};

export type SchemaInventoryStockCountSheetView = {
    id?: number;
    scs_number?: string;
    inventory_id?: number;
    total_quantity?: number;
    count_date?: string;
    discrepancies_gen?: number;
    notes?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    inventory?: SchemaInventoryInventoryView;
    counted_by_info?: SchemaEntityEntity;
};

export type SchemaSaleSalesOrderView = {
    id?: number;
    base_document_id?: number;
    sales_order_number?: string;
    vendor_id?: number;
    customer_id?: number;
    payment_due_date?: string;
    ship_from_information?: Record<string, any>;
    ship_to_information?: Record<string, any>;
    sales_representative_employee_id?: number;
    order_status?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    vendor_info?: SchemaEntityEntity;
    customer_info?: SchemaEntityEntity;
    sales_representative_info?: SchemaEntityEntity;
    base_document: SchemaBaseBaseDocument;
    sales_order_items: SchemaSaleSalesOrderItemView[]; 
};

export type SchemaSaleSalesOrderItemView = {
    id?: number;
    sales_order_id?: number;
    base_document_item_id?: number;
    created_at?: string;
    deleted_at?: string;
    updated_at?: string;
    base_document_item: SchemaBaseBaseDocumentItem;
    inventory_info?: SchemaInventoryInventoryView;
};

export type SchemaSaleSalesQuotationView = {
    id?: number;
    base_document_id?: number;
    sales_quotation_number?: string;
    valid_until_date?: string;
    vendor_id?: number;
    customer_id?: number;
    ship_to_information?: Record<string, any>;
    requested_by?: Record<string, any>;
    prepared_by_employee_id?: number;
    quotation_status?: string;
    created_at?: string;
    deleted_at?: string;
    updated_at?: string;
    base_document: SchemaBaseBaseDocument;
    vendor_info?: SchemaEntityEntity;
    customer_info?: SchemaEntityEntity;
    prepared_by_employee_info?: SchemaEntityEntity;
    sales_quotation_items: SchemaSaleSalesQuotationItemView[];
};

export type SchemaSaleSalesQuotationItemView = {
    id?: number;
    base_document_item_id?: number;
    sales_quotation_id?: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    base_document_item: SchemaBaseBaseDocumentItem;
    inventory_info?: SchemaInventoryInventoryView;
};

export type SchemaSaleDeliveryNoteView = {
    id?: number;
    base_document_id?: number;
    delivery_note_number?: string;
    sales_order_id?: number;
    vendor_id?: number;
    customer_id?: number;
    ship_to_information?: Record<string, any>;
    ship_from_information?: Record<string, any>;
    bill_to_information?: Record<string, any>;
    shipping_date?: string;
    shipping_status?: string;
    shipping_personnel_information?: Record<string, any>;
    received_by?: Record<string, any>;
    overall_goods_condition?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    base_document: SchemaBaseBaseDocument;
    vendor_info?: SchemaEntityEntity;
    customer_info?: SchemaEntityEntity;
    delivery_note_items: SchemaSaleDeliveryNoteItemView[];
};

export type SchemaSaleDeliveryNoteItemView = {
    id?: number;
    base_document_item_id?: number;
    delivery_note_id?: number;
    goods_condition?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    base_document_item: SchemaBaseBaseDocumentItem;
    inventory_info?: SchemaInventoryInventoryView;
};

export type SchemaSaleGoodsReturnNoteView = {
    id?: number;
    base_document_id?: number;
    goods_return_note_number?: string;
    return_date?: string;
    returned_by_customer_id?: number;
    receiving_location_information?: Record<string, any>;
    received_by_employee_id?: number;
    overall_goods_condition?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    base_document: SchemaBaseBaseDocument;
    customer_info?: SchemaEntityEntity;
    goods_return_note_items: SchemaSaleGoodsReturnNoteItemView[];
};

export type SchemaSaleGoodsReturnNoteItemView = {
    id?: number;
    base_document_item_id?: number;
    goods_return_note_id?: number;
    credit_note_id?: number;
    invoice_id?: number;
    rma_item_id?: number;
    sales_order_item_id?: number;
    return_quantity: number;
    return_condition?: string;
    return_reason?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    base_document_item: SchemaBaseBaseDocumentItem;
    inventory_info?: SchemaInventoryInventoryView;
};

export type SchemaInvoiceCreditNoteView = {
    id?: number;
    base_document_id?: number;
    credit_note_number?: string;
    customer_id?: number;
    issue_date?: string;
    reason_for_issuance?: string;
    additional_charges?: number;
    total_value_gen?: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    base_document: SchemaBaseBaseDocument;
    customer_info?: SchemaEntityEntity;
    credit_note_items?: SchemaInvoiceCreditNoteItemView[];
};

export type SchemaInvoiceCreditNoteItemView = {
    id?: number;
    credit_note_id?: number;
    invoice_item_id?: number;
    name?: string;
    description?: string;
    quantity?: number;
    unit_value?: number;
    total_value_gen?: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    base_document_item?: SchemaBaseBaseDocumentItem;
    invoice_info?: any;    
}

export type SchemaInvoicePaymentReceiptView = {
    id: number;
    payment_receipt_number: string;
    invoice_id: number;
    date_of_payment: string;
    payer_id: number;
    payee_id: number;
    total_value_gen?: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    payer_info?: SchemaEntityEntity;
    payee_info?: SchemaEntityEntity;
    payment_receipt_items?: SchemaInvoicePaymentReceiptItem[];
};