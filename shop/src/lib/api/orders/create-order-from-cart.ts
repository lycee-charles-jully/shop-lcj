import type { CartItemPopulated } from '$types/cart';
import type { Order } from '$types/order';
import { apiWrapper } from '$lib/api/api-wrapper';

export const createOrderFromCart = (recommendations: CartItemPopulated[]) => apiWrapper<Order>('/order/from-cart', {
    method: 'POST',
    body: {
        recommendations: recommendations.map(r => ({ count: r.count, product: r.product._id })),
    },
    validate(data, handleError) {
        if (!data?._id)
            return handleError(
                'Une erreur inconnue est survenue lors de la commande. Veuillez réessayer.',
                500,
                new Error('Invalid order creation response'),
            );
    },
});
