import { browser } from '$app/env';

export const API_URL = browser ? import.meta.env.VITE_REMOTE_API_URL : import.meta.env.VITE_LOCAL_API_URL;
