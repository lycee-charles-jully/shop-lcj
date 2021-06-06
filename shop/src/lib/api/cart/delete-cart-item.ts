import { apiWrapper } from '$lib/api/api-wrapper';
import type { CartItem } from '$types/cart';

export const deleteCartItem = (productID: string) => apiWrapper<CartItem[]>(`/cart/${productID}`, {
    method: 'DELETE',
    validate(data, handleError) {
        if (!Array.isArray(data))
            return handleError(
                'Impossible de récupérer le panier à jour. Veuillez rafraichir la page.',
                null,
                new Error('Cannot get updated cart'),
            );
    },
    reqPattern: '/cart/:product',
});
