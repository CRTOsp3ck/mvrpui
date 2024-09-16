import client from './api-client';
import type { SchemaItemItem, SchemaDtoSearchItemDto } from '../schema';

// This is still fetching normal data and not view for now
// But will be converted to view in future when view is implemented
export const getItemViewService = async (itemId: number) => {
    const { data, error, response } = await client.GET("/v1/main/item/item/{id}", {
        params: {
            query: undefined,
            header: undefined,
            path: { id: itemId },
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

export const getItemService = async (itemId: number) => {
    const { data, error, response } = await client.GET("/v1/main/item/item/{id}", {
        params: {
            query: undefined,
            header: undefined,
            path: { id: itemId },
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

export const searchItemsService = async (searchParams: any) => {
    const { data, error, response } = await client.POST('/v1/main/item/item/search', {
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

export const createItemService = async (itemData: SchemaItemItem) => {
    const { data, error, response } = await client.POST("/v1/main/item/item", {
        body: {
            item: itemData,
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

export const updateItemService = async (itemData: SchemaItemItem) => {
    const { data, error, response } = await client.PUT("/v1/main/item/item/{id}", {
        params: {
            query: undefined,
            header: undefined,
            path: { id: itemData.id || -1 },
            cookie: undefined,
        },
        body: {
            item: itemData,
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

export const deleteItemService = async (itemId: number) => {
    const { data, error, response } = await client.DELETE("/v1/main/item/item/{id}",{
        params: {
            query: undefined,
            header: undefined,
            path: { id: itemId },
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