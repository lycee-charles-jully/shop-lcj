<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit/types/page';
    import { browser } from '$app/env';
    import { API_URL } from '$lib/api-url';


    export const load: Load = async ({ fetch, page }) => {
        const slug = page.params.slug;
        const product = await fetch(`${API_URL}/v1/product/${slug}${browser ? '?stat' : ''}`)
            .then(res => res.json());
        return {
            props: {
                product,
            },
        };
    };
</script>


<script lang="ts">
    import type { Product } from '$types/products';
    import ProductImages from '$lib/ProductImages.svelte';
    import { currencyFormat } from '$lib/currency-format';

    export let product: Product;
</script>


<style>
    .header img, .header h1 {
        display: inline-block;
    }

    .header img {
        cursor: pointer;
        height: 30px;
        width: 30px;
        transform: translateY(4px);
    }

    .header h1 {
        margin: 0 0 var(--spacing) 0;
    }

    @media all and (min-width: 768px) {
        .body {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-gap: var(--spacing);
        }
    }

</style>


<div class="header">
    <img alt="<" height="16" on:click={() => window.history.back()} src="/icons/back-highlight.svg" width="16">
    <h1 class="title">{product.name}</h1>
</div>

<div class="body">
    <ProductImages images={[product.coverImageUrl, ...product.imagesUrls]} productName={product.name}/>

    <div class="content">
        <span class="title text-gradient">{currencyFormat(product.price)}</span>
        <p>{product.description}</p>
    </div>
</div>