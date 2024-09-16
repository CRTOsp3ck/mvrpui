// enums.ts
import type { SchemaDtoEnumsDto } from './schema';

let cachedEnums: SchemaDtoEnumsDto | null = null;

export const getEnums = async () => {
    if (cachedEnums === null) {
        const resp: any = await listEnumsService();
        if (resp.status === 200 || resp.status === 201) {
            const data: any = resp.data
            setEnums(data.payload);
        } else if (resp.message || resp.error) {
            const msg = resp.message || resp.error
            console.log(msg || 'An error occurred while sending the request');
        }
    }
    return cachedEnums;
};

export const setEnums = (enums: SchemaDtoEnumsDto) => {
    cachedEnums = enums;
};

export const Enums = cachedEnums;