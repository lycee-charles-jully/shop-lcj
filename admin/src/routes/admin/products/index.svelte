<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit/types/page';
    import { API_URL } from '$lib/api-url';

    export const load: Load = async ({ fetch }) => {

        const productTypes = await fetch(`${API_URL}/v1/product-type`)
            .then(res => res.json());

        return {
            props: {
                productTypes,
            },
        };
    };
</script>


<script lang="ts">
    import Item from '$lib/Item.svelte';

    export let productTypes = [];
</script>


<h1 class="text-2xl mb-4">Types de produits</h1>

{#each productTypes as productType}
    <Item href="/admin/products/{productType._id}">{productType.namePluralized}</Item>
{/each}

<a href="/admin/products/new" class="block w-full bg-white p-4 rounded-md mt-6">
    Ajouter un type de produit
</a>
