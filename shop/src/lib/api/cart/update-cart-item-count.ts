import type { CartItem } from '$types/cart';
import { apiWrapper } from '$lib/api/api-wrapper';

export const updateCartItemCount = (productID: string, count: number) => apiWrapper<CartItem>(`/cart/${productID}`, {
    method: 'PATCH',
    body: { count },
    validate(data, handleError) {
        if (!data.product)
            return handleError(
                'Impossible de changer la quantité de ce produit. Veuillez réessayer.',
                null,
                new Error('Cannot update the product quantity'),
            );
    },
    reqPattern: '/cart/:product',
});
