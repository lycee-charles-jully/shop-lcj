<script lang="ts">
    import Nav from '$lib/nav/Nav.svelte';
    import '../app.css';
</script>


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
