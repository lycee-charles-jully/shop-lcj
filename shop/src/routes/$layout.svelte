<script lang="ts">
    import Nav from '$lib/nav/Nav.svelte';
</script>


<style>
    main {
        padding: var(--spacing) var(--spacing) calc(var(--header-height) + var(--spacing)); /* Bottom spacing */
    }

    @media all and (min-width: 768px) {
        main {
            padding: calc(var(--header-height) + var(--spacing)) var(--spacing) var(--spacing); /* Top spacing */
        }
    }
</style>


<Nav/>

<main>
    <slot/>
</main>
