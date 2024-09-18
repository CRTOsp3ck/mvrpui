import client from './api-client';
import type { 
    SchemaDtoSearchPaymentReceiptDto,
    SchemaDtoCreatePaymentReceiptDto,
    SchemaDtoUpdatePaymentReceiptDto 
} from '../schema';

export const getPaymentReceiptViewService = async (soId: number) => {
    const { data, error, response } = await client.GET("/v1/main/invoice/payment_receipt_view/{id}", {
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

export const createPaymentReceiptService = async (soData: SchemaDtoCreatePaymentReceiptDto) => {
    const { data, error, response } = await client.POST("/v1/main/invoice/payment_receipt", {
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

export const updatePaymentReceiptService = async (soData: SchemaDtoUpdatePaymentReceiptDto) => {
    const { data, error, response } = await client.PUT("/v1/main/invoice/payment_receipt/{id}", {
        params: {
            query: undefined,
            header: undefined,
            path: { id: soData.payment_receipt?.id || -1 },
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

export const deletePaymentReceiptService = async (soId: number) => {
    const { data, error, response } = await client.DELETE("/v1/main/invoice/payment_receipt/{id}",{
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

export const searchPaymentReceiptService = async (searchParams: SchemaDtoSearchPaymentReceiptDto) => {
    const { data, error, response } = await client.POST('/v1/main/invoice/payment_receipt/search', {
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

export const searchPaymentReceiptViewService = async (searchParams: SchemaDtoSearchPaymentReceiptDto) => {
    const { data, error, response } = await client.POST('/v1/main/invoice/payment_receipt_view/search', {
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