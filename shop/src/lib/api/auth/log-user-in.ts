import type { User } from '$types/user';
import { apiWrapper } from '$lib/api/api-wrapper';

export const logUserIn = (credentials) => apiWrapper<User>('/auth/login', {
    method: 'POST',
    body: credentials,
    validate(data, handleError, res) {
        if (res.status === 401)
            return handleError('Email ou mot de passe invalide.', 401);
        if (!data._id)
            return handleError(
                'Impossible d\'obtenir les informations de votre compte. Veuillez rafraichir la page et réessayer.',
                null,
                new Error('Cannot get user information when logging in, invalid response data'),
            );
    },
    allowedStatus: 401,
});
