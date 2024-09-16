import client from './api-client';
import type { SchemaEntityEntity, SchemaDtoSearchEntityDto } from '../schema';

// This is still fetching normal data and not view for now
// But will be converted to view in future when view is implemented
export const getEntityViewService = async (entityId: number) => {
    const { data, error, response } = await client.GET("/v1/main/entity/entity/{id}", {
        params: {
            query: undefined,
            header: undefined,
            path: { id: entityId },
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

export const getEntityService = async (entityId: number) => {
    const { data, error, response } = await client.GET("/v1/main/entity/entity/{id}", {
        params: {
            query: undefined,
            header: undefined,
            path: { id: entityId },
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

export const searchEntitiesService = async (searchParams: any) => {
    const { data, error, response } = await client.POST('/v1/main/entity/entity/search', {
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

export const createEntityService = async (entityData: SchemaEntityEntity) => {
    const { data, error, response } = await client.POST("/v1/main/entity/entity", {
        body: {
            entity: entityData,
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

export const updateEntityService = async (entityData: SchemaEntityEntity) => {
    const { data, error, response } = await client.PUT("/v1/main/entity/entity/{id}", {
        params: {
            query: undefined,
            header: undefined,
            path: { id: entityData.id || -1 },
            cookie: undefined,
        },
        body: {
            entity: entityData,
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

export const deleteEntityService = async (entityId: number) => {
    const { data, error, response } = await client.DELETE("/v1/main/entity/entity/{id}",{
        params: {
            query: undefined,
            header: undefined,
            path: { id: entityId },
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