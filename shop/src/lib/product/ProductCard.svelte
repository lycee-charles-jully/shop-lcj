<script lang="ts">
    import type { BasicProduct } from '$types/products';
    import { currencyFormat } from '$lib/helpers/currency-format';
    import { imageUrl } from '$lib/helpers/image-url';
    import { session } from '$app/stores';
    import ProductAdding from './ProductAdding.svelte';
    import { goto } from '$app/navigation';
    import { imgload } from '$lib/helpers/imgload';

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
        position: relative;
        color: var(--black);
        background-color: var(--white);
        max-width: 250px;
        width: 100%;
        border-radius: var(--round);
        display: flex;
        flex-direction: column;
        justify-self: center;
    }

    .stock-display {
        --display-background: rgba(0, 0, 0, .4);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        background: var(--display-background);
        z-index: 2;
        border-radius: var(--round) var(--round) 0 0;
        color: white;
        text-align: center;
        padding-top: 2px;
        font-weight: bold;
        text-shadow: 0 0 1px black;
    }

    .stock-display::after {
        content: "";
        position: absolute;
        height: 5px;
        width: 100%;
        top: 100%;
        left: 0;
        background: linear-gradient(var(--display-background), transparent);
    }

    .cover {
        width: 100%;
        border-radius: var(--round) var(--round) 0 0;
        padding-top: 100%;
    }

    .out-of-stock {
        filter: grayscale(.8);
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

    {#if product.stockCount !== null && product.stockCount <= 5}
        <div class="stock-display">
            {#if product.stockCount <= 0}
                Rupture de stock
            {:else}
                {product.stockCount} restant{product.stockCount > 1 ? 's' : ''}
            {/if}
        </div>
    {/if}

    <picture class="product-img cover" class:out-of-stock={product.stockCount === 0} use:imgload>
        <img alt={product.name} height="200" loading="lazy" src={imageUrl(product.coverImageUrl, 200)} width="200"/>
    </picture>

    <div class="body">
        <span class="name">{product.name}</span>
        <div class="bottom-bar">
            <span class="text-gradient">{currencyFormat(product.price)}</span>
            {#if product.stockCount === null || product.stockCount > 0}
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
            {/if}
        </div>
    </div>

</a>


{#if showBuyPopup}
    <ProductAdding bind:visible={showBuyPopup} {product}/>
{/if}
