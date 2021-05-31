<script lang="ts">
    import type { Recommendation } from '$types/recommendation';
    import type { CartItemPopulated } from '$types/cart';
    import { imageUrl } from '$lib/helpers/image-url';
    import { currencyFormat } from '$lib/helpers/currency-format';
    import Button from '$lib/layout/Button.svelte';
    import QuantitySelector from '$lib/layout/QuantitySelector.svelte';

    export let recommendation: Recommendation;
    export let validatedRecommendations: CartItemPopulated[] = [];

    let count = 0;


    function addProduct() {
        count = 1;
        validatedRecommendations = [
            ...validatedRecommendations,
            { count, product: recommendation.recommendedProduct },
        ];
    }

    function removeProduct() {
        count = 0;
        validatedRecommendations = validatedRecommendations
            .filter(({ product }: CartItemPopulated) => product._id !== recommendation.recommendedProduct._id);
    }

    function increaseCount() {
        count++;
        updateCount();
    }

    function decreaseCount() {
        count--;
        updateCount();
    }

    function updateCount() {
        validatedRecommendations = validatedRecommendations.map(item => {
            if (item.product._id !== recommendation.recommendedProduct._id)
                return item;
            item.count = count;
            return item;
        });
    }
</script>


<style>
    .container {
        width: 100%;
        background-color: var(--white);
        border-radius: var(--round);
        padding: var(--spacing);
        margin: var(--spacing) 0;
    }

    .product {
        width: 100%;
        display: flex;
        margin: var(--spacing) 0;
    }

    .product img {
        height: 100px;
        width: 100px;
    }

    @media all and (min-width: 440px) {
        .product img {
            height: 120px;
            width: 120px;
        }
    }

    .product-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .product-info span {
        margin: var(--spacing);
    }

    .btn-container {
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .trash {
        padding: 4px;
        height: 30px;
        width: 30px;
        cursor: pointer;
    }
</style>


<div class="container">
    <span>{recommendation.message}</span>
    <div class="product">
        <img src={imageUrl(recommendation.recommendedProduct.coverImageUrl, 200)} height="200" width="200"/>
        <div class="product-info">
            <span>{recommendation.recommendedProduct.name}</span>
            <span>{currencyFormat(recommendation.recommendedProduct.price)} l'unité</span>
        </div>
    </div>
    <div class="btn-container">
        {#if count <= 0}
            <Button nomargin on:click={addProduct}>Ajouter au panier</Button>
        {:else}
            <div>
                Quantité :
                <QuantitySelector
                        on:increase={increaseCount}
                        on:decrease={decreaseCount}/>
            </div>
            <img src="/icons/trash-highlight.svg" height="22" width="22" class="trash" on:click={removeProduct}/>
        {/if}
    </div>
</div>