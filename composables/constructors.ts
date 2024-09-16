import type { 
    SchemaEntityEntity, 
    SchemaItemItem,
    SchemaInventoryInventory 
} from './schema';

export class SchemaEntityEntityClass implements SchemaEntityEntity {
    name: string = '';
    phone: string = '';
    email: string = '';
    address: string = '';
    website: string = '';
    type: string = '';

    constructor(type: string) {
        this.type = type;
    }
}

export class SchemaItemItemClass implements SchemaItemItem {
    id: number = -1;
    brand: string = '';
    category: string = '';
    code: string = '';
    cost: number = 0;
    description: string = '';
    name: string = '';
    origin: string = '';
    price: number = 0;
    sku: string = '';
    status: string = '';
    type: string = '';

    constructor(type: string) {
        this.type = type;
    }
}

export class SchemaInventoryInventoryClass implements SchemaInventoryInventory {
    id: number = -1;
    inventory_number: string = '';
    item_id: number = 0;
    quantity_reserved: number = 0;
    quantity_available: number = 0;
    quantity_returned: number = 0;
    quantity_total_gen: number = 0;
    cost_per_unit: number = 0;
    price_per_unit: number = 0;
    total_value_on_hand_gen: number = 0;
    reorder_level: number = 0;
    reorder_quantity: number = 0;
    is_discontinued: boolean = false;
    remarks: string = '';
    created_at: string = '';
    updated_at: string = '';
    deleted_at: string = '';

    constructor() {}
}