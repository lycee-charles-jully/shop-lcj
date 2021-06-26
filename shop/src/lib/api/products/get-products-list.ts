import type { Product } from '$types/products';
import { apiWrapper } from '$lib/api/api-wrapper';

export const getProductsList = (offset = 0, fetch?: any) => apiWrapper<Product[]>(`/product?limit=20&offset=${offset}&sort=name`, {
    fetch,
    validate(data, handleError) {
        if (!Array.isArray(data))
            return handleError(
                'Impossibe d\'obtenir les produits. Veuillez réessayer.',
                null,
                new Error('Cannot get some products on the produts list, invalid inout data'),
            );
    },
    reqPattern: '/product',
});
