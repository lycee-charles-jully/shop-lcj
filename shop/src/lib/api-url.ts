import { browser } from '$app/env';

export const LOCAL_ENDPOINT = import.meta.env.VITE_LOCAL_API_URL;
export const REMOTE_ENDPOINT = import.meta.env.VITE_REMOTE_API_URL;

export const API_URL = browser ? REMOTE_ENDPOINT : LOCAL_ENDPOINT;
