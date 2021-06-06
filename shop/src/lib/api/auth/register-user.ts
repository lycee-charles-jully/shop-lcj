import type { User } from '$types/user';
import { apiWrapper } from '$lib/api/api-wrapper';

export const registerUser = (credentials) => apiWrapper<User>('/auth/register', {
    method: 'POST',
    body: credentials,
    validate(data: any, handleError, res) {
        if (res.status === 409) {
            if (data.message?.match(/jeunestNumber/))
                return handleError('Ce numéro de carte Jeun\'Est est déjà utilisé. Si il vous appartient, veuillez contacter l\'administration.', 409);
            if (data.message?.match(/email/))
                return handleError('Cet email est déjà utilisé.', 409);
            return handleError(data.message, 409, new Error('Unknown register error'));
        }

        if (!data._id)
            return handleError(
                'Impossible d\'obtenir les informations de votre compte. Veuillez rafraichir la page et réessayer.',
                null,
                new Error('Cannot get user information when registering, invalid response data'),
            );
    },
    allowedStatus: 409,
});
