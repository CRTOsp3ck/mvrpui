import client from './api-client';
import type { 
    SchemaDtoSearchGoodsReturnNoteDto,
    SchemaDtoCreateGoodsReturnNoteDto,
    SchemaDtoUpdateGoodsReturnNoteDto 
} from '../schema';

export const getGoodsReturnNoteViewService = async (grnId: number) => {
    const { data, error, response } = await client.GET("/v1/main/sale/goods_return_note_view/{id}", {
        params: {
            query: undefined,
            header: undefined,
            path: { id: grnId },
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

export const createGoodsReturnNoteService = async (grnData: SchemaDtoCreateGoodsReturnNoteDto) => {
    const { data, error, response } = await client.POST("/v1/main/sale/goods_return_note", {
        body: grnData,
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

export const updateGoodsReturnNoteService = async (grnData: SchemaDtoUpdateGoodsReturnNoteDto) => {
    const { data, error, response } = await client.PUT("/v1/main/sale/goods_return_note/{id}", {
        params: {
            query: undefined,
            header: undefined,
            path: { id: grnData.goods_return_note?.id || -1 },
            cookie: undefined,
        },
        body: grnData,
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

export const deleteGoodsReturnNoteService = async (grnId: number) => {
    const { data, error, response } = await client.DELETE("/v1/main/sale/goods_return_note/{id}",{
        params: {
            query: undefined,
            header: undefined,
            path: { id: grnId },
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

export const searchGoodsReturnNoteService = async (searchParams: SchemaDtoSearchGoodsReturnNoteDto) => {
    const { data, error, response } = await client.POST('/v1/main/sale/goods_return_note/search', {
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

export const searchGoodsReturnNoteViewService = async (searchParams: SchemaDtoSearchGoodsReturnNoteDto) => {
    const { data, error, response } = await client.POST('/v1/main/sale/goods_return_note_view/search', {
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