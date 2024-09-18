import client from './api-client';
import type { 
    SchemaDtoSearchInvoiceDto,
    SchemaDtoCreateInvoiceDto,
    SchemaDtoUpdateInvoiceDto 
} from '../schema';

export const getSalesInvoiceViewService = async (soId: number) => {
    const { data, error, response } = await client.GET("/v1/main/invoice/invoice_view/{id}", {
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

export const createSalesInvoiceService = async (invData: SchemaDtoCreateInvoiceDto) => {
    const { data, error, response } = await client.POST("/v1/main/invoice/invoice", {
        body: invData,
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

export const updateSalesInvoiceService = async (invData: SchemaDtoUpdateInvoiceDto) => {
    const { data, error, response } = await client.PUT("/v1/main/invoice/invoice/{id}", {
        params: {
            query: undefined,
            header: undefined,
            path: { id: invData.invoice?.id || -1 },
            cookie: undefined,
        },
        body: invData,
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

export const deleteSalesInvoiceService = async (soId: number) => {
    const { data, error, response } = await client.DELETE("/v1/main/invoice/invoice/{id}",{
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

export const searchSalesInvoiceService = async (searchParams: SchemaDtoSearchInvoiceDto) => {
    const { data, error, response } = await client.POST('/v1/main/invoice/invoice/search', {
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

export const searchSalesInvoiceViewService = async (searchParams: SchemaDtoSearchInvoiceDto) => {
    const { data, error, response } = await client.POST('/v1/main/invoice/invoice_view/search', {
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