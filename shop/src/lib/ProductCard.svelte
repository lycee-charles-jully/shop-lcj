<script lang="ts">
    import type { BasicProduct } from '$types/products';
    import { currencyFormat } from '$lib/currency-format';
    import { imageUrl } from '$lib/image-url';
    import { session } from '$app/stores';

    export let product: BasicProduct;
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


<a class="card" href="/product/{product.slug}">
    <img alt={product.name} class="cover" src={imageUrl(product.coverImageUrl, 200)}/>
    <div class="body">
        <span class="name">{product.name}</span>
        <div class="bottom-bar">
            <span class="text-gradient">{currencyFormat(product.price)}</span>
            {#if $session.user?.cart?.find(i => i.product === product._id)}
                <img alt="v" src="/icons/cart-highlight.svg" width="20" height="20"/>
            {:else}
                <img alt="+" src="/icons/add-cart.svg" width="20" height="20"/>
            {/if}
        </div>
    </div>
</a>
