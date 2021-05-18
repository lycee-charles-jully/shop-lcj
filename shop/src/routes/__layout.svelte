<script lang="ts">
    import Nav from '$lib/nav/Nav.svelte';
    import '../app.css';
    import { REMOTE_ENDPOINT } from '$lib/api-url';
    import { session } from '$app/stores';


    function handleAppStart() {
        if ($session.user && (Date.now() - new Date($session.user?.tokenCreatedAt).getTime()) > 86400 * 1000)
            fetch(`${REMOTE_ENDPOINT}/v1/auth/refresh`, {
                credentials: 'same-origin',
            });
    }
</script>


<svelte:window on:sveltekit:start={handleAppStart}/>


<style>
    main {
        margin: 0 0 var(--header-height); /* Bottom spacing */
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

<main>
    <slot/>
</main>
