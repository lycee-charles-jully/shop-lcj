<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit/types/page';
    import { getHomeProducts } from '$lib/api/products/get-home-products';

    export const load: Load = async ({ fetch }) => {
        const { data: homeProducts, error, status } = await getHomeProducts(fetch);

        return {
            props: {
                homeProducts,
            },
            error: error && new Error(error),
            status,
        };
    };
</script>


<script lang="ts">
    import type { HomeProducts } from '$types/products';
    import Meta from '$lib/Meta.svelte';
    import Category from '$lib/product/Category.svelte';
    import ProductCard from '$lib/product/ProductCard.svelte';
    import Announce from '$lib/Announce.svelte';

    export let homeProducts: HomeProducts;
</script>


<Meta/>


{#if Array.isArray(homeProducts?.announces)}
    {#each homeProducts.announces as announce}
        <Announce message={announce.message}/>
    {/each}
{/if}


{#if Array.isArray(homeProducts?.popular)}
    <Category title="Populaire">
        {#each homeProducts.popular as product}
            <ProductCard {product}/>
        {/each}
    </Category>
{/if}


{#if Array.isArray(homeProducts?.latest)}
    <Category title="Récent">
        {#each homeProducts.latest as product}
            <ProductCard {product}/>
        {/each}
    </Category>
{/if}
