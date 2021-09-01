import { apiWrapper } from '$lib/api/api-wrapper';
import type { User } from '$types/user';

export const updateAccount = (newUserData) => apiWrapper<User>('/account/me', {
    method: 'PATCH',
    body: newUserData,
});
