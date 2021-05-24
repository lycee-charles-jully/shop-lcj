<script lang="ts">
    import type { CartItemPopulated } from '$types/cart';
    import type { Recommendation } from '$types/recommendation';
    import CartConfirmation from '$lib/order/CartConfirmation.svelte';
    import Eula from '../lib/order/Eula.svelte';
    import { onMount } from 'svelte';
    import { REMOTE_ENDPOINT } from '$lib/api-url';
    import Meta from '$lib/Meta.svelte';
    import Recommendations from '$lib/order/Recommendations.svelte';

    let step: 'LOADING' | 'RECOMMENDATIONS' | 'CONFIRM_ITEMS' | 'EULA' | 'CONFIRMATION' = 'LOADING';

    let recommendations: Recommendation[];
    let cart: CartItemPopulated[];
    let validatedRecommendations: CartItemPopulated[] = [];

    onMount(() => {
        Promise.all([
            fetch(`${REMOTE_ENDPOINT}/v1/recommendation`, { credentials: 'include' })
                .then(res => res.json())
                .then(data => recommendations = data),
            fetch(`${REMOTE_ENDPOINT}/v1/cart`, { credentials: 'include' })
                .then(res => res.json())
                .then(data => cart = data),
        ])
            .then(() => {
                if (recommendations.length > 0)
                    step = 'RECOMMENDATIONS';
                else
                    step = 'CONFIRM_ITEMS';
            });
    });

</script>


<Meta title="Passer la commande"/>


<h1>Passer la commande</h1>

{#if step === 'LOADING'}
    Chargement...
{:else if step === 'RECOMMENDATIONS'}
    <Recommendations
            {recommendations}
            on:nextstep={() => step = 'CONFIRM_ITEMS'}
            bind:validatedRecommendations/>
{:else if step === 'CONFIRM_ITEMS'}
    <CartConfirmation {cart} {validatedRecommendations}
                      on:nextstep={() => step = 'EULA'}/>
{:else if step === 'EULA'}
    <Eula on:nextstep={() => step = 'CONFIRMATION'}/>
{/if}
