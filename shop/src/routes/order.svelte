<script lang="ts">
    import type { CartItemPopulated } from '$types/cart';
    import type { Recommendation } from '$types/recommendation';
    import type { User } from '$types/user';
    import CartConfirmation from '$lib/order/CartConfirmation.svelte';
    import Eula from '$lib/order/Eula.svelte';
    import OrderSucceed from '$lib/order/OrderSucceed.svelte';
    import { onMount } from 'svelte';
    import { REMOTE_ENDPOINT } from '$lib/api-url';
    import Meta from '$lib/Meta.svelte';
    import Recommendations from '$lib/order/Recommendations.svelte';
    import { session } from '$app/stores';
    import { goto } from '$app/navigation';

    let step: 'LOADING' | 'RECOMMENDATIONS' | 'CONFIRM_ITEMS' | 'EULA' | 'ORDERING' | 'SUCCESS' | 'ERROR' = 'LOADING';

    let recommendations: Recommendation[];
    let cart: CartItemPopulated[];
    let validatedRecommendations: CartItemPopulated[] = [];

    onMount(() => {
        if (($session.user as User).cart.length === 0)
            return goto('/cart');

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


    let error: string | null = null;

    function setError(e: Error) {
        step = 'ERROR';
        error = e.message;
    }


    async function order() {
        step = 'ORDERING';
        await fetch(`${REMOTE_ENDPOINT}/v1/order/from-cart`, {
            method: 'POST',
            body: JSON.stringify({
                recommendations: validatedRecommendations.map(r => ({ count: r.count, product: r.product._id })),
            }),
            credentials: 'include',
            headers: [
                [ 'Content-Type', 'application/json' ],
            ],
        })
            .then(async res => ({ res, data: await res.json() }))
            .then(({ res, data }) => {
                if (!res.ok)
                    throw new Error(data.message || JSON.stringify(data));
                ($session.user as User).cart = [];
                step = 'SUCCESS';
            })
            .catch(e => setError(e));
    }

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
    <Eula on:nextstep={order}/>
{:else if step === 'ORDERING'}
    Commande en cours...
{:else if step === 'SUCCESS'}
    <OrderSucceed/>
{:else if step === 'ERROR'}
    <h3 class="error-message">Une erreur est survenue</h3>
    <p class="error-message">{error}</p>
    <a href="/cart">Retour au panier</a>
{/if}
