import { apiWrapper } from '$lib/api/api-wrapper';
import type { Order } from '$types/order';

export const getPendingOrders = () => apiWrapper<Order[]>('/order/me/pending', {
    validate(data, handleError) {
        if (!Array.isArray(data))
            return handleError(
                'Impossible d\'obtenir vos commandes. Veuillez réessayer',
                500,
                new Error('Cannot display user pending orders, invalid input data'));
    },
});
