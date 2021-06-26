<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit/types/page';
    import { getProductsList } from '$lib/api/products/get-products-list';

    export const load: Load = async ({ fetch }) => {

        const { data: products, error, status } = await getProductsList(0, fetch);

        return {
            props: { products },
            error: error && new Error(error),
            status,
        };
    };
</script>


<script lang="ts">
    import type { Product } from '$types/products';
    import Category from '$lib/product/Category.svelte';
    import ProductCard from '$lib/product/ProductCard.svelte';
    import Meta from '$lib/Meta.svelte';
    import { onMount } from 'svelte';

    export let products: Product[] = [];

    let bottomElement;
    let currentOffset = 20;
    let loading = false;
    let fullyLoaded = false;

    onMount(() => {
        const observer = new IntersectionObserver(onBottomReached, {
            root: document.querySelector('#svelte'),
            threshold: 1,
            rootMargin: '400px',
        });
        observer.observe(bottomElement);
    });

    async function onBottomReached(entries: IntersectionObserverEntry[]) {
        if (!entries[0].isIntersecting || loading || fullyLoaded)
            return;
        loading = true;
        const { data } = await getProductsList(currentOffset);
        if (data.length < 20)
            fullyLoaded = true;
        currentOffset += 20;
        loading = false;
        products = [ ...products, ...data ];
    }
</script>


<Meta description="Liste de tous les produits disponibles sur Shop LCJ" title="Liste des produits"/>


<Category>
    {#each products as product}
        <ProductCard {product}/>
    {/each}
</Category>

<!-- This element is used to determine when the bottom is reached, to load more products -->
<span bind:this={bottomElement}/>

{#if !fullyLoaded}
    <p>Chargement...</p>
{/if}
