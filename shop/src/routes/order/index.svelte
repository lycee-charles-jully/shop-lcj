<script lang="ts">
    import type { CartItemPopulated } from '$types/cart';
    import type { Recommendation } from '$types/recommendation';
    import type { User } from '$types/user';
    import CartConfirmation from '$lib/order/steps/CartConfirmation.svelte';
    import Eula from '$lib/order/steps/Eula.svelte';
    import OrderSucceed from '$lib/order/steps/OrderSucceed.svelte';
    import { onMount } from 'svelte';
    import Meta from '$lib/Meta.svelte';
    import Recommendations from '$lib/order/steps/Recommendations.svelte';
    import { session } from '$app/stores';
    import { goto } from '$app/navigation';
    import { getDataForOrder } from '$lib/api/orders/get-data-for-order';
    import { createOrderFromCart } from '$lib/api/orders/create-order-from-cart';

    let step: 'LOADING' | 'RECOMMENDATIONS' | 'CONFIRM_ITEMS' | 'EULA' | 'ORDERING' | 'SUCCESS' | 'ERROR' = 'LOADING';

    let recommendations: Recommendation[];
    let cart: CartItemPopulated[];
    let validatedRecommendations: CartItemPopulated[] = [];

    onMount(() => {
        if (($session.user as User).cart.length === 0)
            return goto('/cart');

        getDataForOrder()
            .then(({ cart: c, recommendations: r, error: e }) => {
                cart = c;
                recommendations = r;
                if (recommendations && recommendations.length > 0)
                    step = 'RECOMMENDATIONS';
                else if (recommendations)
                    step = 'CONFIRM_ITEMS';
                if (e)
                    setError(new Error(e));
            });
    });


    let error: string | null = null;

    function setError(e: Error) {
        step = 'ERROR';
        error = e.message;
    }


    function order() {
        step = 'ORDERING';
        createOrderFromCart(validatedRecommendations)
            .then(({ error: err }) => {
                if (err)
                    return setError(new Error(err));
                ($session.user as User).cart = [];
                ($session.user as User).pendingOrders++;
                step = 'SUCCESS';
            });
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
