<script lang="ts">
    import type { BasicProduct } from '$types/products';
    import QuantitySelector from '$lib/QuantitySelector.svelte';
    import { imageUrl } from '$lib/image-url';
    import { currencyFormat } from '$lib/currency-format';

    export let product: BasicProduct | null = null;
    export let count = 1;
</script>


<style>
    .card {
        --card-height: 100px;
        width: 100%;
        height: var(--card-height);
        background-color: var(--white);
        margin: 0 0 var(--spacing);
        border-radius: var(--round);
        display: flex;
    }

    .thumbnail {
        width: var(--card-height);
        height: var(--card-height);
        border-radius: var(--round) 0 0 var(--round);
    }

    .body {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: var(--spacing);
    }

    .body > * {
        line-height: 20px;
    }

    h2 {
        margin: 0;
        font-size: 18px;
    }

    h2 a {
        color: var(--black);
    }

    .quantity-select {
        display: flex;
        align-items: center;
        flex: 1;
    }

    .gray-bg {
        background-color: var(--light-gray);
        color: var(--light-gray);
        user-select: none;
    }

    @media all and (min-width: 768px) {
        .gray-bg {
            background-color: var(--dark-gray);
            color: var(--dark-gray);
        }
    }
</style>


{#if product}

    <div class="card">
        <a href="/product/{product.slug}">
            <img src={imageUrl(product.coverImageUrl, 200)} class="thumbnail gray-bg"/>
        </a>

        <div class="body">
            <h2>
                <a href="/product/{product?.slug}">
                    {product.name}
                </a>
            </h2>
            <div class="quantity-select" style="transform: translateY(-2px)">
            <span>
                Quantité :
                <QuantitySelector bind:quantity={count}/>
            </span>
            </div>
            <div>Prix total : {currencyFormat(product.price * count)}</div>
        </div>
    </div>

{:else}

    <div class="card">
        <div class="thumbnail gray-bg"/>

        <div class="body">
            <h2 class="gray-bg">easter egg haha</h2>
            <div class="quantity-select">
                <h2 class="gray-bg" style="width: 100%">easter egg haha</h2>
            </div>
            <h2 class="gray-bg">easter egg haha</h2>
        </div>
    </div>

{/if}
