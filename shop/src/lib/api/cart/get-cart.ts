import { apiWrapper } from '$lib/api/api-wrapper';
import type { CartItemPopulated } from '$types/cart';
import type { ServerFetch } from '@sveltejs/kit';

export const getCartItems = (fetch?: ServerFetch) => apiWrapper<CartItemPopulated[]>('/cart', {
    fetch,
    validate(data, handleError) {
        if (!Array.isArray(data))
            return handleError(
                'Impossible d\'obtenir votre panier. Veuillez réessayer.',
                500,
                new Error('Cannot display cart, invalid input data'),
            );
    },
});
