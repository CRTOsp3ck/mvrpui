import client from './api-client';
import type { SchemaDtoSearchInventoryTransactionDto } from '../schema';

export const searchInventoryTransactionService = async (searchParams: SchemaDtoSearchInventoryTransactionDto) => {
    const { data, error, response } = await client.POST('/v1/main/inventory/inventory_transaction/search', {
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

export const searchAllInventoryTransactionService = async (searchParams: SchemaDtoSearchInventoryTransactionDto) => {
    const { data, error, response } = await client.POST('/v1/ext/inventory/inventory_transaction/search_all', {
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