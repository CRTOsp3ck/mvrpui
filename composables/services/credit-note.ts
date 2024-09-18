import client from './api-client';
import type { 
    SchemaDtoSearchCreditNoteDto,
    SchemaDtoCreateCreditNoteDto,
    SchemaDtoUpdateCreditNoteDto 
} from '../schema';

export const getCreditNoteViewService = async (soId: number) => {
    const { data, error, response } = await client.GET("/v1/main/invoice/credit_note_view/{id}", {
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

export const createCreditNoteService = async (soData: SchemaDtoCreateCreditNoteDto) => {
    const { data, error, response } = await client.POST("/v1/main/invoice/credit_note", {
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

export const updateCreditNoteService = async (soData: SchemaDtoUpdateCreditNoteDto) => {
    const { data, error, response } = await client.PUT("/v1/main/invoice/credit_note/{id}", {
        params: {
            query: undefined,
            header: undefined,
            path: { id: soData.credit_note?.id || -1 },
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

export const deleteCreditNoteService = async (soId: number) => {
    const { data, error, response } = await client.DELETE("/v1/main/invoice/credit_note/{id}",{
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

export const searchCreditNoteService = async (searchParams: SchemaDtoSearchCreditNoteDto) => {
    const { data, error, response } = await client.POST('/v1/main/invoice/credit_note/search', {
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

export const searchCreditNoteViewService = async (searchParams: SchemaDtoSearchCreditNoteDto) => {
    const { data, error, response } = await client.POST('/v1/main/invoice/credit_note_view/search', {
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