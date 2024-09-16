// enumsService.ts
import client from './api-client';
import type { SchemaDtoEnumsDto } from '../schema';

export const listEnumsService = async (): Promise<SchemaDtoEnumsDto | Error | Response> => {
    const { data, error, response } = await client.GET("/v1/enum", {
        params: {
            query: undefined,
            header: undefined,
            cookie: undefined,
        },
    });

    if (!data) {
        if (error) {
            return error;
        } else {
            return response;
        }
    }
    
    return data;
};