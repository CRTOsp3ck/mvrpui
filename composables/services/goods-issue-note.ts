import client from './api-client';
import type { 
    SchemaDtoSearchGoodsIssueNoteDto,
    SchemaDtoCreateGoodsIssueNoteDto,
    SchemaDtoUpdateGoodsIssueNoteDto 
} from '../schema';

export const getGoodsIssueNoteViewService = async (ginId: number) => {
    const { data, error, response } = await client.GET("/v1/main/inventory/goods_issue_note_view/{id}", {
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

export const createGoodsIssueNoteService = async (ginData: SchemaDtoCreateGoodsIssueNoteDto) => {
    const { data, error, response } = await client.POST("/v1/main/inventory/goods_issue_note", {
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

export const updateGoodsIssueNoteService = async (ginData: SchemaDtoUpdateGoodsIssueNoteDto) => {
    const { data, error, response } = await client.PUT("/v1/main/inventory/goods_issue_note/{id}", {
        params: {
            query: undefined,
            header: undefined,
            path: { id: ginData.goods_issue_note?.id || -1 },
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

export const deleteGoodsIssueNoteService = async (ginId: number) => {
    const { data, error, response } = await client.DELETE("/v1/main/inventory/goods_issue_note/{id}",{
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

export const searchGoodsIssueNoteService = async (searchParams: SchemaDtoSearchGoodsIssueNoteDto) => {
    const { data, error, response } = await client.POST('/v1/main/inventory/goods_issue_note/search', {
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

export const searchGoodsIssueNoteViewService = async (searchParams: SchemaDtoSearchGoodsIssueNoteDto) => {
    const { data, error, response } = await client.POST('/v1/main/inventory/goods_issue_note_view/search', {
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