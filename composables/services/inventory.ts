import client from './api-client';
import type { 
    SchemaInventoryInventory, 
    SchemaDtoSearchInventoryDto 
} from '../schema';

export const getInventoryService = async (inventoryId: number) => {
    const { data, error, response } = await client.GET("/v1/main/inventory/inventory/{id}", {
        params: {
            query: undefined,
            header: undefined,
            path: { id: inventoryId },
            cookie: undefined,
        },
    })
    if (!data) {
        if (error) {
            return error
        } else {
            return response
        }
    }
    return data
}

export const searchInventoriesService = async (searchParams: SchemaDtoSearchInventoryDto) => {
    const { data, error, response } = await client.POST('/v1/main/inventory/inventory/search', {
        body: searchParams,
    })
    if (!data) {
        if (error) {
            return error
        } else {
            return response
        }
    }
    return data
};

export const createInventoryService = async (inventoryData: SchemaInventoryInventory) => {
    const { data, error, response } = await client.POST("/v1/main/inventory/inventory", {
        body: {
            inventory: inventoryData,
        },
    })
    if (!data) {
        if (error) {
            return error
        } else {
            return response
        }
    }
    return data
}

export const updateInventoryService = async (inventoryData: SchemaInventoryInventory) => {
    const { data, error, response } = await client.PUT("/v1/main/inventory/inventory/{id}", {
        params: {
            query: undefined,
            header: undefined,
            path: { id: inventoryData.id || -1 },
            cookie: undefined,
        },
        body: {
            inventory: inventoryData,
        },
    })
    if (!data) {
        if (error) {
            return error
        } else {
            return response
        }
    }
    return data
}

export const deleteInventoryService = async (inventoryId: number) => {
    const { data, error, response } = await client.DELETE("/v1/main/inventory/inventory/{id}",{
        params: {
            query: undefined,
            header: undefined,
            path: { id: inventoryId },
            cookie: undefined,
        },
    })
    if (!data) {
        if (error) {
            return error
        } else {
            return response
        }
    }
    return data
}

export const getInventoryViewService = async (inventoryId: number) => {
    const { data, error, response } = await client.GET("/v1/main/inventory/inventory_view/{id}", {
        params: {
            query: undefined,
            header: undefined,
            path: { id: inventoryId },
            cookie: undefined,
        },
    })
    if (!data) {
        if (error) {
            return error
        } else {
            return response
        }
    }
    return data
}

export const searchInventoryViewsService = async (searchParams: SchemaDtoSearchInventoryDto) => {
    const { data, error, response } = await client.POST('/v1/main/inventory/inventory_view/search', {
        body: searchParams,
    })
    if (!data) {
        if (error) {
            return error
        } else {
            return response
        }
    }
    return data
};
