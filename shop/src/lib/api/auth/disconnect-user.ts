import { apiWrapper } from '$lib/api/api-wrapper';

export const disconnectUser = () => apiWrapper<null>('/auth/logout');
