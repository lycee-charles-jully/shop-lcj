<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { REMOTE_ENDPOINT } from '$lib/api-url';
    import Item from '$lib/Item.svelte';

    const productTypeID: string = $page.params.productType;
    const categorySlug: string = $page.params.category;

    let products = [];

    let category: string, productType: string;

    onMount(() => {
        fetch(`${REMOTE_ENDPOINT}/v1/product?limit=20&category=${categorySlug}&nonAvailable`)
            .then(res => res.json())
            .then(p => products = p);
        fetch(`${REMOTE_ENDPOINT}/v1/category`)
            .then(res => res.json())
            .then(categories => {
                const { name, productType: { name: productTypeName } } = categories.find(c => c.slug === categorySlug);
                category = name;
                productType = productTypeName;
            });
    });
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
