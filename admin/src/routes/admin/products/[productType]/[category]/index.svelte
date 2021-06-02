<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit/types/page';
    import { API_URL } from '$lib/api-url';

    export const load: Load = async ({ fetch, page }) => {
        const productTypeID: string = page.params.productType;
        const categorySlug: string = page.params.category;

        try {
            const [ products, { category, productType } ] = await Promise.all([
                fetch(`${API_URL}/v1/product?limit=20&category=${categorySlug}&nonAvailable`)
                    .then(res => res.json()),
                fetch(`${API_URL}/v1/category`)
                    .then(res => res.json())
                    .then(categories => {
                        if (!Array.isArray(categories))
                            return {
                                category: undefined,
                                productType: undefined,
                            };
                        const { name: category, productType: { name: productType } } =
                            categories?.find(c => c.slug === categorySlug);
                        return {
                            category,
                            productType,
                        };
                    }),
            ]);

            return {
                props: {
                    products,
                    category,
                    productType,
                    productTypeID,
                    categorySlug,
                },
            };
        } catch (e) {
            return {
                status: 404,
                error: 'Impossible de trouver la catégorie',
            };
        }
    };
</script>


<script lang="ts">
    import Item from '$lib/Item.svelte';

    export let products = [];
    export let category: string;
    export let productType: string;
    export let productTypeID: string;
    export let categorySlug: string;
</script>


<h1 class="text-2xl mb-4">
    {#if category && productType}
        <a href="/admin/products">{productType}</a> {'>'}
        <a href="/admin/products/{productTypeID}">{category}</a> {'>'}
        produits
    {:else}
        Produits
    {/if}
</h1>

{#each products as product}
    <Item href="/admin/products/{productTypeID}/{categorySlug}/{product.slug}"
          thumb={product.coverImageUrl}>
        {product.name}
    </Item>
{/each}

<a class="block w-full bg-white p-4 rounded-md mt-6" href="/admin/products/{productTypeID}/{categorySlug}/new">
    Ajouter un produit
</a>
