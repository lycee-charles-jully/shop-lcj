// import { isMobile, updateMobileState } from '$lib/state/updateMobileState';
import { writable } from 'svelte/store';

export interface AppState {
    /** Defines if the app is in mobile or in desktop mode */
    // mobile: boolean,
}

const currentState: AppState = {
    // mobile: isMobile(),
};

export let appState = writable<AppState>(currentState);


// Triggers

// updateMobileState(appState, currentState);
