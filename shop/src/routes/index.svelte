<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit/types/page';
    import { API_URL } from '$lib/api-url';

    export const load: Load = async ({ fetch }) => {
        // TODO: handle error
        const homeProducts = await fetch(`${API_URL}/v1/product/home`).then(res => res.json());
        return {
            props: { homeProducts },
        };
    };
</script>


<script lang="ts">
    import type { HomeProducts } from '../types/products';
    import Meta from '$lib/Meta.svelte';
    import Category from '$lib/Category.svelte';
    import ProductCard from '$lib/ProductCard.svelte';

    export let homeProducts: HomeProducts;
</script>


<Meta/>


<Category title="Populaire">
    {#each homeProducts.popular as product}
        <ProductCard {product}/>
    {/each}
</Category>


<Category title="Récent">
    {#each homeProducts.latest as product}
        <ProductCard {product}/>
    {/each}
</Category>
