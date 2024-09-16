import client from './api-client';
import type { 
    SchemaDtoSearchStockCountSheetDto,
    SchemaDtoCreateStockCountSheetDto,
    SchemaDtoUpdateStockCountSheetDto 
} from '../schema';

export const getStockCountSheetViewService = async (ginId: number) => {
    const { data, error, response } = await client.GET("/v1/main/inventory/stock_count_sheet_view/{id}", {
        params: {
            query: undefined,
            header: undefined,
            path: { id: ginId },
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

export const createStockCountSheetService = async (ginData: SchemaDtoCreateStockCountSheetDto) => {
    const { data, error, response } = await client.POST("/v1/main/inventory/stock_count_sheet", {
        body: ginData,
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

export const updateStockCountSheetService = async (ginData: SchemaDtoUpdateStockCountSheetDto) => {
    const { data, error, response } = await client.PUT("/v1/main/inventory/stock_count_sheet/{id}", {
        params: {
            query: undefined,
            header: undefined,
            path: { id: ginData.stock_count_sheet?.id || -1 },
            cookie: undefined,
        },
        body: ginData,
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

export const deleteStockCountSheetService = async (ginId: number) => {
    const { data, error, response } = await client.DELETE("/v1/main/inventory/stock_count_sheet/{id}",{
        params: {
            query: undefined,
            header: undefined,
            path: { id: ginId },
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

export const searchStockCountSheetService = async (searchParams: SchemaDtoSearchStockCountSheetDto) => {
    const { data, error, response } = await client.POST('/v1/main/inventory/stock_count_sheet/search', {
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

export const searchStockCountSheetViewService = async (searchParams: SchemaDtoSearchStockCountSheetDto) => {
    const { data, error, response } = await client.POST('/v1/main/inventory/stock_count_sheet_view/search', {
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