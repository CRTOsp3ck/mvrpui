import client from './api-client';
import type { 
    SchemaDtoSearchSalesQuotationDto,
    SchemaDtoCreateSalesQuotationDto,
    SchemaDtoUpdateSalesQuotationDto 
} from '../schema';

export const getSalesQuotationViewService = async (sqId: number) => {
    const { data, error, response } = await client.GET("/v1/main/sale/sales_quotation_view/{id}", {
        params: {
            query: undefined,
            header: undefined,
            path: { id: sqId },
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

export const createSalesQuotationService = async (sqData: SchemaDtoCreateSalesQuotationDto) => {
    const { data, error, response } = await client.POST("/v1/main/sale/sales_quotation", {
        body: sqData,
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

export const updateSalesQuotationService = async (sqData: SchemaDtoUpdateSalesQuotationDto) => {
    const { data, error, response } = await client.PUT("/v1/main/sale/sales_quotation/{id}", {
        params: {
            query: undefined,
            header: undefined,
            path: { id: sqData.sales_quotation?.id || -1 },
            cookie: undefined,
        },
        body: sqData,
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

export const deleteSalesQuotationService = async (sqId: number) => {
    const { data, error, response } = await client.DELETE("/v1/main/sale/sales_quotation/{id}",{
        params: {
            query: undefined,
            header: undefined,
            path: { id: sqId },
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

export const searchSalesQuotationService = async (searchParams: SchemaDtoSearchSalesQuotationDto) => {
    const { data, error, response } = await client.POST('/v1/main/sale/sales_quotation/search', {
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

export const searchSalesQuotationViewService = async (searchParams: SchemaDtoSearchSalesQuotationDto) => {
    const { data, error, response } = await client.POST('/v1/main/sale/sales_quotation_view/search', {
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