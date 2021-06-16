<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit/types/page';
    import { getDataForCategory } from '$lib/api/categories/get-data-for-category';

    export const load: Load = async ({ fetch, page }) => {
        const slug = page.params.slug;
        const { products, category, error, status } = await getDataForCategory(slug, fetch);

        return {
            props: {
                products,
                category,
                error,
            },
            error: status === 404 ? new Error(`Impossible de trouver la catégorie ${slug}.`) : error,
            status,
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
    export let error: string | null = null;
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


<Meta description="Liste des produits de la catégorie {category?.name} disponibles sur Shop LCJ"
      image={products[0]?.coverImageUrl}
      remoteImage
      title={category?.name}/>


{#if error}
    <p class="error-message">{error}</p>
{/if}

{#if category?.name}
    <h2>
        <img alt="<" height="24" on:click={() => window.history.back()} src="/icons/back-highlight.svg" width="24">
        {category.name}
    </h2>
{/if}

<Category>
    {#each products as product}
        <ProductCard {product}/>
    {/each}
    <!--TODO: auto-scroll when the bottom is reached-->
</Category>
