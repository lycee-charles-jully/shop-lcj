<script lang="ts">
    import type { Recommendation } from '$types/recommendation';
    import type { CartItemPopulated } from '$types/cart';
    import PrimaryBtn from '$lib/buttons/PrimaryBtn.svelte';
    import RecommendedProductCard from './RecommendedProductCard.svelte';
    import { createEventDispatcher } from 'svelte';
    import { currencyFormat } from '$lib/currency-format';

    export let recommendations: Recommendation[];
    export let validatedRecommendations: CartItemPopulated[] = [];

    const dispatch = createEventDispatcher();
</script>


<h3>Ces produits vous sont conseillés en fonction de votre commande</h3>

{#each recommendations as recommendation}
    <RecommendedProductCard {recommendation} bind:validatedRecommendations/>
{/each}

<PrimaryBtn on:click={() => dispatch('nextstep')}>
    Valider
    (+ {currencyFormat(validatedRecommendations.reduce((prev, val) => prev + val.product.price * val.count, 0))})
</PrimaryBtn>
