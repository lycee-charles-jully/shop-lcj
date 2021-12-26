<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit/types/page';
    import { browser } from '$app/env';
    import { getProductDetails } from '$lib/api/products/get-product-details';


    export const load: Load = async ({ fetch, page }) => {
        const slug = page.params.slug;
        const { data: product, error, status } = await getProductDetails(fetch, slug, browser);
        return {
            props: {
                product,
            },
            error: error && new Error(error),
            status,
        };
    };
</script>


<script lang="ts">
    import type { Product } from '$types/products';
    import ProductImages from '$lib/product/ProductImages.svelte';
    import { currencyFormat } from '$lib/helpers/currency-format';
    import Button from '$lib/layout/Button.svelte';
    import ProductAdding from '$lib/product/ProductAdding.svelte';
    import { session } from '$app/stores';
    import { goto } from '$app/navigation';
    import Meta from '$lib/Meta.svelte';
    import { sanitize } from '$lib/helpers/sanitize';

    export let product: Product;

    let showBuyPopup = false;
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


<Meta description={product.description}
      image={product.coverImageUrl}
      remoteImage
      title={product.name}/>


<div class="header">
    <img alt="<" height="16" on:click={() => window.history.back()} src="/icons/back-highlight.svg" width="16">
    <h1 class="title">{product.name}</h1>
</div>

<div class="body">
    <ProductImages images={[product.coverImageUrl, ...product.imagesUrls]} productName={product.name}/>

    <div class="content">
        <span class="title text-gradient">{currencyFormat(product.price)}</span>
        <p>{@html sanitize(product.description).replace(/\n/g, '<br/>')}</p>
    </div>
</div>


{#if $session.user?.cart?.find(item => item.product === product._id)}
    <!-- TODO: more control (view and change count, remove) -->
    <p>Ce produit est déja dans <a href="/cart">votre panier</a>.</p>
{:else if !product.available}
    <p>Ce produit n'est pas disponible.</p>
{:else if product.stockCount === 0}
    <p>Ce produit est en rupture de stock.</p>
{:else}
    <Button on:click={() => $session.user
        ? showBuyPopup = true
        : goto(`/login?r=/product/${product.slug}`)}
            icon="cart-add-white.svg">
        Ajouter au panier
    </Button>
{/if}


{#if showBuyPopup}
    <ProductAdding bind:visible={showBuyPopup} {product}/>
{/if}
