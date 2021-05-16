<script lang="ts">
    import ProductType from '../../../lib/product-type/ProductType.svelte';
    import { onMount } from 'svelte';
    import { REMOTE_ENDPOINT } from '$lib/api-url';

    let productTypes = [];

    onMount(() => {
        fetch(`${REMOTE_ENDPOINT}/v1/product-type`)
            .then(res => res.json())
            .then(p => productTypes = p);
    });
</script>


<h1 class="text-2xl mb-4">Types de produits</h1>

{#each productTypes as productType}
    <ProductType {...productType}/>
{/each}

<a href="/admin/products/new" class="block w-full bg-white p-4 rounded-md mt-6">
    Ajouter un type de produit
</a>
