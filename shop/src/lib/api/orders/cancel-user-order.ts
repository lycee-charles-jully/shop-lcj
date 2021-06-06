import type { Order } from '$types/order';
import { apiWrapper } from '$lib/api/api-wrapper';

export const cancelUserOrder = (id: string, reason: string) => apiWrapper<Order>(`/order/me/${id}`, {
    body: reason ? { reason } : {},
    method: 'DELETE',
    validate(data, handleError) {
        if (!data?._id)
            return handleError(
                'Impossible de récupérer les détails de la commande. Veuillez rafraichir la page.',
                null,
                new Error('Cannot get the updated order'),
            );
    },
});
