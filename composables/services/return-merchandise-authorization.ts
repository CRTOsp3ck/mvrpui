import client from './api-client';
import type { 
    SchemaDtoSearchReturnMerchandiseAuthorizationDto,
    SchemaDtoCreateReturnMerchandiseAuthorizationDto,
    SchemaDtoUpdateReturnMerchandiseAuthorizationDto 
} from '../schema';

export const getReturnMerchandiseAuthorizationViewService = async (ginId: number) => {
    const { data, error, response } = await client.GET("/v1/main/inventory/return_merchandise_authorization_view/{id}", {
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

export const createReturnMerchandiseAuthorizationService = async (ginData: SchemaDtoCreateReturnMerchandiseAuthorizationDto) => {
    const { data, error, response } = await client.POST("/v1/main/inventory/return_merchandise_authorization", {
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

export const updateReturnMerchandiseAuthorizationService = async (ginData: SchemaDtoUpdateReturnMerchandiseAuthorizationDto) => {
    const { data, error, response } = await client.PUT("/v1/main/inventory/return_merchandise_authorization/{id}", {
        params: {
            query: undefined,
            header: undefined,
            path: { id: ginData.return_merchandise_authorization?.id || -1 },
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

export const deleteReturnMerchandiseAuthorizationService = async (rmaId: number) => {
    const { data, error, response } = await client.DELETE("/v1/main/inventory/return_merchandise_authorization/{id}",{
        params: {
            query: undefined,
            header: undefined,
            path: { id: rmaId },
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

export const searchReturnMerchandiseAuthorizationService = async (searchParams: SchemaDtoSearchReturnMerchandiseAuthorizationDto) => {
    const { data, error, response } = await client.POST('/v1/main/inventory/return_merchandise_authorization/search', {
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

export const searchReturnMerchandiseAuthorizationViewService = async (searchParams: SchemaDtoSearchReturnMerchandiseAuthorizationDto) => {
    const { data, error, response } = await client.POST('/v1/main/inventory/return_merchandise_authorization_view/search', {
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