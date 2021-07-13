<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit/types/page';
    import { API_URL } from '$lib/api-url';

    export const load: Load = async ({ fetch }) => {
        const categories: any[] = await fetch(`${API_URL}/v1/category`)
            .then(res => res.json());
        return {
            props: {
                productTypes: [
                    ...new Set(categories.map(c => JSON.stringify(c.productType))),
                ].map(c => JSON.parse(c)),
            },
        };
    };
</script>


<script>
    import '../../app.css';
    import Nav from '$lib/nav/Nav.svelte';

    export let productTypes = [];
</script>


<style>
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>


<svelte:head>
    <title>Panneau d'admin - Shop-lcj</title>
</svelte:head>


<Nav {productTypes}/>

<main class="sm:p-4 p-1 mx-auto max-w-5xl flex-1">
    <slot/>
</main>
