<script lang="ts">
    import type { CartItemPopulated } from '$types/cart';
    import Button from '$lib/layout/Button.svelte';
    import { currencyFormat } from '$lib/helpers/currency-format';
    import { imageUrl } from '$lib/helpers/image-url';
    import { createEventDispatcher } from 'svelte';
    import { goto } from '$app/navigation';
    import { imgload } from '$lib/helpers/imgload';

    export let cart: CartItemPopulated[] = [];
    export let validatedRecommendations: CartItemPopulated[] = [];
    export let comment: string | null;

    const dispatch = createEventDispatcher();

    let items: CartItemPopulated[] = [];
    $: items = [ ...cart, ...validatedRecommendations ];

    let totalPrice = 0;
    $: totalPrice = items.reduce((total, item) => total + item.product.price * item.count, 0);
</script>


<style>
    .product {
        --card-height: 100px;
        display: flex;
        height: var(--card-height);
        margin: var(--spacing) 0;
        background-color: var(--white);
        border-radius: var(--round);
    }

    .product picture {
        height: var(--card-height);
        width: var(--card-height);
        border-radius: var(--round) 0 0 var(--round);
    }

    .product-body {
        display: flex;
        flex-direction: column;
        padding: var(--spacing);
        justify-content: center;
    }

    .product-body span {
        margin: calc(var(--spacing) / 2) 0;
    }

    .bold {
        font-weight: bold;
    }

    h4 {
        margin-top: var(--short-spacing);
    }

    textarea {
        width: 100%;
        min-height: 50px;
        height: 100px;
        max-height: 300px;
        resize: vertical;
        margin: 0 0 calc(var(--spacing) * 2);
    }
</style>


<h3>Récapitulatif de votre commande</h3>

{#each items as item}
    <div class="product">
        <picture class="product-img" use:imgload>
            <img src={imageUrl(item.product.coverImageUrl, 200)} height="200" width="200"/>
        </picture>
        <div class="product-body">
            <span>{item.product.name}</span>
            <span>
                <span class:bold={item.count > 1}>{item.count}</span>x
                {currencyFormat(item.product.price)}
                = {currencyFormat(item.count * item.product.price)}
            </span>
        </div>
    </div>
{/each}

<h4>Total : {currencyFormat(totalPrice)}</h4>

<h3>Ajouter un message sur la commande (facultatif)</h3>
<textarea bind:value={comment}/>

<Button nomargin on:click={() => dispatch('nextstep')}>
    C'est tout bon !
</Button>

<Button on:click={() => goto('cart')} type="secondary">
    Retour au panier
</Button>
