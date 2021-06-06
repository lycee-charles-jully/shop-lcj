import type { Product } from '$types/products';
import { apiWrapper } from '$lib/api/api-wrapper';

export const getProductDetails = (fetch, slug: string, stat: boolean = false) => apiWrapper<Product>(`/product/${slug}${stat ? '?stat' : ''}`, {
    fetch,
    reqPattern: '/product/:slug',
    validate(data, handleError, res) {
        if (res.status === 404)
            return handleError(`Impossible de trouver le produit, ${slug} n'est pas un identifiant valide`, 404);
        if (!data?._id)
            return handleError(
                'Impossible d\'obtenir les détails de ce produit. Veuillez réessayer.',
                res.status,
                new Error('Cannot display product details, invalid input data'),
            );
    },
    allowedStatus: 404,
});
