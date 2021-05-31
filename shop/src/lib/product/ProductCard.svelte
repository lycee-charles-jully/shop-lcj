<script lang="ts">
    import type { BasicProduct } from '$types/products';
    import { currencyFormat } from '$lib/helpers/currency-format';
    import { imageUrl } from '$lib/helpers/image-url';
    import { session } from '$app/stores';
    import ProductAdding from './ProductAdding.svelte';
    import { goto } from '$app/navigation';

    export let product: BasicProduct;

    let showBuyPopup = false;


    function handleQuickAdd() {
        if (!$session.user)
            goto(`/login?r=/product/${product.slug}`);
        else
            showBuyPopup = true;
    }


    function goToProductPage(ev: CustomEvent) {
        if ((ev.target as HTMLElement).classList.contains('add-cart-btn'))
            ev.preventDefault();
    }
</script>


<style>
    .card {
        color: var(--black);
        background-color: var(--white);
        max-width: 250px;
        border-radius: var(--round);
        display: flex;
        flex-direction: column;
    }

    .cover {
        width: 100%;
        height: auto;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: var(--round) var(--round) 0 0;
    }

    .body {
        padding: var(--short-spacing);
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .bottom-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .name {
        margin-bottom: var(--short-spacing);
        display: inline-block;
    }
</style>


<a class="card" href="/product/{product.slug}" on:click={goToProductPage}>
    <img src={imageUrl(product.coverImageUrl, 200)} alt={product.name} class="cover" height="200" width="200"/>
    <div class="body">
        <span class="name">{product.name}</span>
        <div class="bottom-bar">
            <span class="text-gradient">{currencyFormat(product.price)}</span>
            {#if $session.user?.cart?.find(i => i.product === product._id)}
                <a href="/cart">
                    <img alt="v" src="/icons/cart-highlight.svg" width="20" height="20"/>
                </a>
            {:else}
                <img alt="+"
                     src="/icons/add-cart.svg"
                     width="20" height="20"
                     on:click={handleQuickAdd}
                     class="add-cart-btn"/>
            {/if}
        </div>
    </div>
</a>


{#if showBuyPopup}
    <ProductAdding bind:visible={showBuyPopup} {product}/>
{/if}
