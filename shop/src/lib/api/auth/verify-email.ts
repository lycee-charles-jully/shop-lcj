import { apiWrapper } from '$lib/api/api-wrapper';
import type { User } from '$types/user';

export const verifyEmail = (code: string) => apiWrapper<User>('/auth/verify', {
    method: 'POST',
    body: { code },
    allowedStatus: 401,
    validate(data: any, handleError, res) {
        if (res.status === 401)
            return handleError(data?.message);
        if (!(data as User).email)
            return handleError(
                'Impossible d\'obtenir les informations de votre compte. Veuillez rafraichir la page et réessayer.',
                null,
                new Error('Cannot get user information when verifying email, invalid response data'),
            );
    },
});
