import { apiWrapper } from '$lib/api/api-wrapper';
import type { CartItemPopulated } from '$types/cart';

export const getCartItems = () => apiWrapper<CartItemPopulated[]>('/cart', {
    validate(data, handleError) {
        if (!Array.isArray(data))
            return handleError(
                'Impossible d\'obtenir votre panier. Veuillez réessayer.',
                500,
                new Error('Cannot display cart, invalid input data'),
            );
    },
});
