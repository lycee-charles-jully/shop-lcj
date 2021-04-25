import type { AppState } from '$lib/state/appState';
import type { Writable } from 'svelte/store';

export function updateMobileState(state: Writable<AppState>, currentState: AppState) {
    let previousWidth = -1;
    if (typeof window !== 'undefined')
        window.addEventListener('resize', ev => {
            const width = window.innerWidth;
            if (width !== previousWidth)
                state.update(s => ({ ...s, mobile: isMobile() }));
        });
}


export const isMobile = () => typeof window !== 'undefined' ? window.innerWidth < 768 : false;
