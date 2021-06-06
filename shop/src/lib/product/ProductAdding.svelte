<script lang="ts">
    import type { User } from '$types/user';
    import Popup from '$lib/layout/Popup.svelte';
    import { imageUrl } from '$lib/helpers/image-url';
    import { currencyFormat } from '$lib/helpers/currency-format';
    import type { Product } from '$types/products';
    import Button from '$lib/layout/Button.svelte';
    import QuantitySelector from '$lib/layout/QuantitySelector.svelte';
    import { session } from '$app/stores';
    import { addProductToCart } from '$lib/api/cart/add-product-to-cart';

    export let visible = false;
    export let product: Product;
    export let quantity = 1;

    let error: string | null = null;

    let process = false;


    function handleAddProduct() {
        if (process)
            return;

        process = true;
        error = null;

        addProductToCart(product._id, quantity)
            .then(({ error: err, data }) => {
                process = false;
                if (err)
                    return error = err;
                visible = false;
                ($session.user as User).cart = data;
            });
    }
</script>


<style>
    .header {
        display: flex;
        align-items: center;
        width: 100%;
    }

    .close-popup-btn {
        cursor: pointer;
        height: 30px;
    }

    .header h2 {
        display: inline-block;
        font-size: 1.2rem;
        margin: 0 0 0 var(--spacing);
    }

    .product-image {
        display: block;
        width: 100%;
        height: auto;
        margin: var(--spacing) 0;
    }

    h1 {
        font-size: 1.6rem;
    }
</style>


<Popup backdrop on:close={() => !process && (visible = false)}>
    <div class="header">
        <img alt="x"
             class="close-popup-btn"
             height="24"
             on:click={() => !process && (visible = false)}
             src="/icons/cross-highlight.svg"
             width="24"/>
        <h2>Ajouter au panier</h2>
    </div>

    <img src={imageUrl(product.coverImageUrl, 500)} alt={product.name} class="product-image" height="500" width="500"/>

    <h1>{product.name}</h1>

    <p>
        Quantité :
        <QuantitySelector bind:quantity disabled={process}/>
    </p>

    <p>Prix total : {currencyFormat(product.price * quantity)}</p>

    {#if error}<p class="error-message">{error}</p>{/if}

    <Button disabled={process} icon="cart-add-white.svg" on:click={handleAddProduct}>
        Ajouter au panier
    </Button>
</Popup>
