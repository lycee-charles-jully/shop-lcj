<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit/types/page';
    import { API_URL } from '$lib/helpers/api-url';

    export const load: Load = async ({ fetch, page }) => {
        const slug = page.params.slug;
        const products = await fetch(`${API_URL}/v1/product?category=${slug}&sort=orderCount&limit=20`)
            .then(res => res.json());
        // TODO: get category title and display it
        return {
            props: {
                products,
            },
        };
    };
</script>


<script lang="ts">
    import type { Product } from '$types/products';
    import ProductCard from '$lib/product/ProductCard.svelte';
    import Category from '$lib/product/Category.svelte';

    export let products: Product[];
</script>


<!--TODO: add navigation button to go back-->
<Category>
    {#each products as product}
        <ProductCard {product}/>
    {/each}
    <!--TODO: auto-scroll when the bottom is reached-->
</Category>
