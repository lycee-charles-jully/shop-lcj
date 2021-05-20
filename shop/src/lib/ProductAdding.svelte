<script lang="ts">
    import Popup from '$lib/Popup.svelte';
    import { imageUrl } from '$lib/image-url';
    import { currencyFormat } from '$lib/currency-format';
    import type { Product } from '$types/products';
    import AddCartBtn from '$lib/buttons/AddCartBtn.svelte';
    import QuantitySelector from '$lib/QuantitySelector.svelte';

    export let visible = false;
    export let product: Product;
    export let quantity = 1;
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


<Popup backdrop on:close={() => visible = false}>
    <div class="header">
        <img alt="x"
             class="close-popup-btn"
             height="24"
             on:click={() => visible = false}
             src="/icons/cross-highlight.svg"
             width="24"/>
        <h2>Ajouter au panier</h2>
    </div>

    <img alt={product.name} class="product-image" src={imageUrl(product.coverImageUrl, 400)}/>

    <h1>{product.name}</h1>

    <p>
        Quantité :
        <QuantitySelector bind:quantity/>
    </p>

    <p>Prix total : {currencyFormat(product.price * quantity)}</p>

    <AddCartBtn/>
</Popup>
