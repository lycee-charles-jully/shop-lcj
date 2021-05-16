<script>
    import { page } from '$app/stores';
    import { REMOTE_ENDPOINT } from '$lib/api-url';
    import Item from '$lib/Item.svelte';
    import { onMount } from 'svelte';

    const productTypeID = $page.params.productType;

    let categories = [];

    onMount(() => {
        fetch(`${REMOTE_ENDPOINT}/v1/category`)
            .then(res => res.json())
            .then(c => categories = c.filter(e => e.productType._id === productTypeID));
    });
</script>


<h1 class="text-2xl mb-4">
    {#if categories.length}
        <a href="/admin/products">{categories[0].productType.namePluralized}</a> {'>'} catégories
    {:else}
        Catégories
    {/if}
</h1>

{#each categories as category}
    <Item href="/admin/products/{productTypeID}/{category._id}"
          thumb={category.products[0]?.coverImageUrl}>
        {category.name}
    </Item>
{/each}

<a class="block w-full bg-white p-4 rounded-md mt-6" href="/admin/products/{productTypeID}/new">
    Ajouter une catégorie
</a>
