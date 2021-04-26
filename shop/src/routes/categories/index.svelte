<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit/types/page';
    import { API_URL } from '$lib/api-url';

    export const load: Load = async ({ fetch }) => {
        const categories = await fetch(`${API_URL}/v1/category`)
            .then(res => res.json());
        return {
            props: {
                categories,
            },
        };
    };
</script>


<script lang="ts">
    import type { CategoryPopulated } from '$types/categories';
    import Category from '$lib/Category.svelte';
    import CategoryCard from '$lib/CategoryCard.svelte';

    export let categories: CategoryPopulated[] = [];

    let productTypes = new Map<string, string>();
    $: productTypes = categories.reduce((prev, cat) =>
        prev.set(cat.productType._id, cat.productType.namePluralized), new Map(),
    );
</script>


{#each [...productTypes.keys()] as productType}
    <Category title={productTypes.get(productType)} smallCards>
        {#each categories.filter(c => c.productType._id === productType) as category}
            <CategoryCard {category}/>
        {/each}
    </Category>
{/each}

