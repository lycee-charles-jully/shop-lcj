import type { HomeProducts } from '$types/products';
import { apiWrapper } from '$lib/api/api-wrapper';

export const getHomeProducts = (fetch) => apiWrapper<HomeProducts>('/product/home', {
    fetch,
    validate(data, handleError) {
        if (!Array.isArray(data?.latest) || !Array.isArray(data?.popular))
            return handleError(
                'Impossibe d\'obtenir les produits. Veuillez réessayer.',
                null,
                new Error('Cannot display the products of the home page, invalid inout data'),
            );
    },
});
