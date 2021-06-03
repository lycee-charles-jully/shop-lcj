<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit/types/page';
    import { API_URL } from '$lib/helpers/api-url';

    export const load: Load = async ({ fetch, page }) => {
        const slug = page.params.slug;
        const [ products, category ] = await Promise.all([
            fetch(`${API_URL}/v1/product?category=${slug}&sort=orderCount&limit=20`)
                .then(res => res.json()),
            fetch(`${API_URL}/v1/category/${slug}`)
                .then(res => res.json()),
        ]);
        return {
            props: {
                products,
                category,
            },
        };
    };
</script>


<script lang="ts">
    import type { Product } from '$types/products';
    import type { Category as CategoryType } from '$types/categories';
    import ProductCard from '$lib/product/ProductCard.svelte';
    import Category from '$lib/product/Category.svelte';
    import Meta from '$lib/Meta.svelte';

    export let products: Product[];
    export let category: CategoryType;
</script>


<style>
    h2 {
        display: flex;
        align-items: center;
        margin-top: 0;
    }

    h2 img {
        margin-right: var(--spacing);
        cursor: pointer;
    }
</style>


<Meta title={category.name}/>


<h2>
    <img alt="<" height="24" on:click={() => window.history.back()} src="/icons/back-highlight.svg" width="24">
    {category.name}
</h2>

<Category>
    {#each products as product}
        <ProductCard {product}/>
    {/each}
    <!--TODO: auto-scroll when the bottom is reached-->
</Category>
