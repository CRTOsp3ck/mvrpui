import client from './api-client';
import type { 
    SchemaDtoSearchDeliveryNoteDto,
    SchemaDtoCreateDeliveryNoteDto,
    SchemaDtoUpdateDeliveryNoteDto 
} from '../schema';

export const getDeliveryNoteViewService = async (soId: number) => {
    const { data, error, response } = await client.GET("/v1/main/sale/delivery_note_view/{id}", {
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

export const createDeliveryNoteService = async (soData: SchemaDtoCreateDeliveryNoteDto) => {
    const { data, error, response } = await client.POST("/v1/main/sale/delivery_note", {
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

export const updateDeliveryNoteService = async (soData: SchemaDtoUpdateDeliveryNoteDto) => {
    const { data, error, response } = await client.PUT("/v1/main/sale/delivery_note/{id}", {
        params: {
            query: undefined,
            header: undefined,
            path: { id: soData.delivery_note?.id || -1 },
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

export const deleteDeliveryNoteService = async (soId: number) => {
    const { data, error, response } = await client.DELETE("/v1/main/sale/delivery_note/{id}",{
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

export const searchDeliveryNoteService = async (searchParams: SchemaDtoSearchDeliveryNoteDto) => {
    const { data, error, response } = await client.POST('/v1/main/sale/delivery_note/search', {
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

export const searchDeliveryNoteViewService = async (searchParams: SchemaDtoSearchDeliveryNoteDto) => {
    const { data, error, response } = await client.POST('/v1/main/sale/delivery_note_view/search', {
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