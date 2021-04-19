import { writable } from 'svelte/store';

export interface AppState {}

const defaultState: AppState = {};

export let state = writable<AppState>(defaultState);
