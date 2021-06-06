import type { Order } from '$types/order';
import { apiWrapper } from '$lib/api/api-wrapper';

export const getOrderDetails = (id: string) => apiWrapper<Order>(`/order/me/${id}`, {
    reqPattern: '/order/me/:slug',
    validate(data, handleError) {
        if (!data?._id)
            return handleError(
                'Impossible de récupérer les informations de la commande. Veuillez réessayer.',
                500,
                new Error('Cannot display details of an order, invalid input data'),
            );
    },
});
