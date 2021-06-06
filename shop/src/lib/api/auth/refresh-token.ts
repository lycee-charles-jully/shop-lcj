import { apiWrapper } from '$lib/api/api-wrapper';

export const refreshToken = () => apiWrapper('/auth/refresh');
