<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit/types/page';
    import type { User } from '$types/user';

    export const load: Load = ({ session, page }) => {
        if ((session.user as User | null)?.role === 500 && page.path !== '/verify')
            return {
                redirect: `/verify${page.path !== '/' ? `?r=${page.path}` : ''}`,
                status: 302,
            };
        return {};
    };
</script>


<script lang="ts">
    import type { User } from '$types/user';
    import '$lib/helpers/sentry';
    import * as Sentry from '@sentry/browser';
    import { refreshToken } from '$lib/api/auth/refresh-token';
    import Nav from '$lib/nav/Nav.svelte';
    import { session } from '$app/stores';
    import '../app.css';

    let loadingBarStatus = 'hidden';
    let LoadingBar;

    function showProgressBar() {
        loadingBarStatus = 'visible';
    }

    function fillProgressBar() {
        if (loadingBarStatus !== 'visible')
            return;
        loadingBarStatus = 'full';
    }

    function handleAppStart() {
        import('$lib/layout/LoadingBar.svelte')
            .then(c => LoadingBar = c.default);

        if ($session.user?.email) {
            Sentry.setUser({ email: $session.user.email });
        }
        if ($session.user && (Date.now() - new Date(($session.user as User | null)?.tokenCreatedAt).getTime()) > 86400 * 1000)
            refreshToken();
    }
</script>


<svelte:window on:sveltekit:navigation-end={fillProgressBar}
               on:sveltekit:navigation-start={showProgressBar}
               on:sveltekit:start={handleAppStart}/>


<style>
    main {
        margin: 0 0 calc(var(--header-height) * 2); /* Bottom spacing */
        padding: var(--spacing);
        width: 100%;
    }

    @media all and (min-width: 768px) {
        main {
            margin: calc(var(--header-height) * 2) auto var(--header-height); /* Top spacing */
            background-color: var(--light-gray);
            max-width: calc(1024px - var(--header-height) * 2);
            width: calc(100% - (var(--header-height) * 2));
            min-height: calc(100vh - var(--header-height) * 3);
            border-radius: var(--round);
        }
    }
</style>


<Nav/>


{#if LoadingBar && loadingBarStatus !== 'hidden'}
    <svelte:component this={LoadingBar} bind:status={loadingBarStatus}/>
{/if}


<main>
    <slot/>
</main>
