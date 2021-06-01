<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit/types/page';
    import { API_URL } from '$lib/api-url';

    export const load: Load = async ({ fetch, page }) => {

        const productTypeID: string = page.params.productType;

        const categories = await fetch(`${API_URL}/v1/category`)
            .then(res => res.json())
            .then(c => c.filter(e => e.productType._id === productTypeID));

        return {
            props: {
                productTypeID,
                categories,
            },
        };
    };
</script>


<script lang="ts">
    import Item from '$lib/Item.svelte';

    export let productTypeID: string;
    export let categories = [];
</script>


<h1 class="text-2xl mb-4">
    {#if categories.length}
        <a href="/admin/products">{categories[0].productType.namePluralized}</a> {'>'} catégories
    {:else}
        Catégories
    {/if}
</h1>

{#each categories as category}
    <Item href="/admin/products/{productTypeID}/{category.slug}"
          thumb={category.products[0]?.coverImageUrl}>
        {category.name}
    </Item>
{/each}

<a class="block w-full bg-white p-4 rounded-md mt-6" href="/admin/products/{productTypeID}/new">
    Ajouter une catégorie
</a>
