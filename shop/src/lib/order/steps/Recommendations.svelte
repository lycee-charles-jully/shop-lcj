<script lang="ts">
    import type { Recommendation } from '$types/recommendation';
    import type { CartItemPopulated } from '$types/cart';
    import Button from '$lib/layout/Button.svelte';
    import RecommendedProductCard from '$lib/order/steps/RecommendedProductCard.svelte';
    import { createEventDispatcher } from 'svelte';
    import { currencyFormat } from '$lib/helpers/currency-format';

    export let recommendations: Recommendation[];
    export let validatedRecommendations: CartItemPopulated[] = [];

    const dispatch = createEventDispatcher();
</script>


<h3>Ces produits vous sont conseillés en fonction de votre commande</h3>

{#each recommendations as recommendation}
    <RecommendedProductCard {recommendation} bind:validatedRecommendations/>
{/each}

<Button on:click={() => dispatch('nextstep')}>
    Valider
    (+ {currencyFormat(validatedRecommendations.reduce((prev, val) => prev + val.product.price * val.count, 0))})
</Button>
