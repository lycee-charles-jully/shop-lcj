<script lang="ts">
    import Popup from '$lib/Popup.svelte';
    import { imageUrl } from '$lib/image-url';
    import { currencyFormat } from '$lib/currency-format';
    import type { Product } from '$types/products';
    import AddCartBtn from '$lib/buttons/AddCartBtn.svelte';
    import QuantitySelector from '$lib/QuantitySelector.svelte';
    import { REMOTE_ENDPOINT } from '$lib/api-url';
    import { session } from '$app/stores';
    import type { CartItem } from '$types/cart';
    import type { User } from '$types/user';

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

        fetch(`${REMOTE_ENDPOINT}/v1/cart`, {
            method: 'POST',
            body: JSON.stringify({
                product: product._id,
                count: quantity,
            } as CartItem),
            credentials: 'same-origin',
            headers: [
                [ 'Content-Type', 'application/json' ],
            ],
        })
            .then(async res => {
                if (res.ok) {
                    error = null;
                    visible = false;
                    ($session.user as User).cart = [
                        ...$session.user.cart,
                        { product: product._id, count: quantity },
                    ];
                    return;
                }

                return res
                    .json()
                    .then(d => {
                        throw new Error(d.message || JSON.stringify(d));
                    });
            })
            .catch(e => error = e?.message || e)
            .finally(() => process = false);
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

    <img alt={product.name} class="product-image" src={imageUrl(product.coverImageUrl, 400)}/>

    <h1>{product.name}</h1>

    <p>
        Quantité :
        <QuantitySelector bind:quantity disabled={process}/>
    </p>

    <p>Prix total : {currencyFormat(product.price * quantity)}</p>

    {#if error}<p class="error-message">{error}</p>{/if}

    <AddCartBtn disabled={process} on:click={handleAddProduct}/>
</Popup>
