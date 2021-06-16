<script context="module" lang="ts">
    import type { CategoryPopulated } from '$types/categories';
    import type { Load } from '@sveltejs/kit/types/page';
    import { getCategoriesList } from '$lib/api/categories/get-categories-list';

    export const load: Load = async ({ fetch }) => {
        const { data: categories, error, status } = await getCategoriesList(fetch);
        return {
            props: {
                categories: categories.filter(c => c.products?.length > 0),
            },
            error: error && new Error(error),
            status,
        };
    };
</script>


<script lang="ts">
    import type { CategoryPopulated } from '$types/categories';
    import Category from '$lib/product/Category.svelte';
    import CategoryCard from '$lib/product/CategoryCard.svelte';
    import Meta from '$lib/Meta.svelte';

    export let categories: CategoryPopulated[] = [];

    let productTypes = new Map<string, string>();
    $: productTypes = categories.reduce((prev, cat) =>
        prev.set(cat.productType._id, cat.productType.namePluralized), new Map(),
    );
</script>


<Meta description="Liste des catégories de produits disponibles sur Shop LCJ" title="Catégories"/>


{#each [...productTypes.keys()] as productType}
    <Category title={productTypes.get(productType)} smallCards>
        {#each categories.filter(c => c.productType._id === productType) as category}
            <CategoryCard {category}/>
        {/each}
    </Category>
{/each}

