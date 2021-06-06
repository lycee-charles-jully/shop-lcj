import { apiWrapper } from '$lib/api/api-wrapper';
import type { CartItemPopulated } from '$types/cart';
import type { Recommendation } from '$types/recommendation';

export const getDataForOrder = async () => {
    let recommendations: Recommendation[], cart: CartItemPopulated[], error: string | null = null;

    [ recommendations, cart ] = await Promise.all([
        apiWrapper<Recommendation[]>('/recommendation', {
            validate(data, handleError) {
                if (!Array.isArray(data))
                    return handleError(
                        'Recommendations invalides, veuillez réessayer.',
                        null,
                        new Error('Invalid recommendations'),
                    );
            },
        })
            .then(({ data, error: err }) => {
                if (err && !error)
                    error = err;
                return data;
            }),
        apiWrapper<CartItemPopulated[]>('/cart', {
            validate(data, handleError) {
                if (!Array.isArray(data))
                    return handleError(
                        'Impossible de récupérer les objets du panier, veuillez réessayer.',
                        null,
                        new Error('Invalid cart'),
                    );
            },
        })
            .then(({ data, error: err }) => {
                if (err)
                    error = err;
                return data;
            }),
    ]);

    return { recommendations, cart, error };
};
