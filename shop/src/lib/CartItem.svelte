<script lang="ts">
    import type { BasicProduct } from '$types/products';
    import QuantitySelector from '$lib/layout/QuantitySelector.svelte';
    import { imageUrl } from '$lib/helpers/image-url';
    import { currencyFormat } from '$lib/helpers/currency-format';
    import { session } from '$app/stores';
    import type { User } from '$types/user';
    import { createEventDispatcher } from 'svelte';
    import { updateCartItemCount } from '$lib/api/cart/update-cart-item-count';
    import { deleteCartItem } from '$lib/api/cart/delete-cart-item';
    import { imgload } from '$lib/helpers/imgload';

    export let product: BasicProduct;
    export let count = 1;


    let invalidItemMessage: null | string;
    $: if (!product.available)
        invalidItemMessage = 'Ce produit n\'est plus disponible. Veuillez le retirer de votre panier.';
    else if (product.stockCount === 0)
        invalidItemMessage = 'Ce produit est en rupture de stock. Veuillez le retirer de votre panier.';
    else if (typeof product.stockCount === 'number' && product.stockCount < count)
        invalidItemMessage = `Il ne reste que ${product.stockCount} exemplaire${product.stockCount > 1 ? 's' : ''} de ce produit. Veuillez réduire la quantité.`;
    else
        invalidItemMessage = null;


    const dispatch = createEventDispatcher();


    function updateProductCount(ev: CustomEvent) {
        const type = ev.detail.type as 'INCREASE' | 'DECREASE';
        dispatch('countchange', count);

        updateCartItemCount(product._id, count)
            .then(({ data, error }) => {
                if (error) {
                    if (type === 'INCREASE')
                        count--;
                    else
                        count++;
                    dispatch('error', new Error(error));
                    dispatch('countchange', count);
                    return;
                }

                if (data && data.product)
                    $session.user.cart = ($session.user as User).cart.map(item => {
                        if (item.product !== data.product)
                            return item;
                        item.count = data.count;
                        return item;
                    });
            });
    }

    let deletingItem = false;

    function deleteItem() {

        if (deletingItem)
            return;
        deletingItem = true;

        deleteCartItem(product._id)
            .then(({ data, error }) => {
                if (error)
                    dispatch('error', new Error(error));
                if (data) {
                    $session.user.cart = ($session.user as User).cart.filter(i => i.product !== product._id);
                    dispatch('delete', product._id);
                }
            })
            .finally(() => deletingItem = false);
    }
</script>


<style>
    p.error-message {
        margin: var(--spacing) 0 3px;
    }

    .card {
        --card-height: 100px;
        width: 100%;
        height: var(--card-height);
        background-color: var(--white);
        margin: 0 0 var(--spacing);
        border-radius: var(--round);
        display: flex;
    }

    .card.invalid-item {
        outline: 2px solid red;
    }

    .thumbnail {
        width: var(--card-height);
        height: var(--card-height);
        border-radius: var(--round) 0 0 var(--round);
    }

    .thumbnail picture {
        width: inherit;
        height: inherit;
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
        justify-content: space-between;
        flex: 1;
    }

    .trash-icon {
        cursor: pointer;
        transform: translateY(2px);
    }
</style>


{#if invalidItemMessage}
    <p class="error-message">{invalidItemMessage}</p>
{/if}

<div class="card" class:disabled={deletingItem} class:invalid-item={invalidItemMessage}>
    <a class="thumbnail" href="/product/{product.slug}">
        <picture class="product-img" use:imgload>
            <img height="200" src={imageUrl(product.coverImageUrl, 200)} width="200"/>
        </picture>
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
                    <QuantitySelector bind:quantity={count}
                                      max={product.stockCount && product.stockCount < 10 ? product.stockCount : 10}
                                      disabled={!product.available}
                                      on:update={updateProductCount}/>
                </span>
            <img class="trash-icon" height="24" on:click={deleteItem} src="/icons/trash-highlight.svg" width="24"/>
        </div>
        <div>Prix total : {currencyFormat(product.price * count)}</div>
    </div>
</div>
