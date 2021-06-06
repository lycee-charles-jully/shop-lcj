import type { CartItem } from '$types/cart';
import { apiWrapper } from '$lib/api/api-wrapper';

export const addProductToCart = (product: string, count: number) => apiWrapper<CartItem[]>('/cart', {
    method: 'POST',
    body: {
        product,
        count,
    },
    validate(data, handleError, res) {
        if (res.status === 409)
            return handleError(
                'Cet article est déjà dans votre panier.',
                409,
            );
        if (!Array.isArray(data))
            return handleError(
                'Impossible de récupérer le panier à jour, veuillez rafraichir la page.',
                null,
                new Error('Cannot get updated cart'),
            );
    },
    allowedStatus: 409,
});
