import client from './api-client';
import type { 
    SchemaDtoSearchSalesOrderDto,
    SchemaDtoCreateSalesOrderDto,
    SchemaDtoUpdateSalesOrderDto 
} from '../schema';

export const getSalesOrderViewService = async (soId: number) => {
    const { data, error, response } = await client.GET("/v1/main/sale/sales_order_view/{id}", {
        params: {
            query: undefined,
            header: undefined,
            path: { id: soId },
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

export const createSalesOrderService = async (soData: SchemaDtoCreateSalesOrderDto) => {
    const { data, error, response } = await client.POST("/v1/main/sale/sales_order", {
        body: soData,
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

export const updateSalesOrderService = async (soData: SchemaDtoUpdateSalesOrderDto) => {
    const { data, error, response } = await client.PUT("/v1/main/sale/sales_order/{id}", {
        params: {
            query: undefined,
            header: undefined,
            path: { id: soData.sales_order?.id || -1 },
            cookie: undefined,
        },
        body: soData,
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

export const deleteSalesOrderService = async (soId: number) => {
    const { data, error, response } = await client.DELETE("/v1/main/sale/sales_order/{id}",{
        params: {
            query: undefined,
            header: undefined,
            path: { id: soId },
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

export const searchSalesOrderService = async (searchParams: SchemaDtoSearchSalesOrderDto) => {
    const { data, error, response } = await client.POST('/v1/main/sale/sales_order/search', {
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

export const searchSalesOrderViewService = async (searchParams: SchemaDtoSearchSalesOrderDto) => {
    const { data, error, response } = await client.POST('/v1/main/sale/sales_order_view/search', {
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