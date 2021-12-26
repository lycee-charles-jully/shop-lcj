<script context="module" lang="ts">
    import type { User } from '$types/user';
    import type { Load } from '@sveltejs/kit/types/page';
    import { getDataForOrder } from '$lib/api/orders/get-data-for-order';

    export const load: Load = async ({ session, fetch }) => {
        if (!session.user)
            return {
                redirect: `/login?r=/order`,
                status: 302,
            };

        const { recommendations, cart, error } = await getDataForOrder(fetch);

        // TODO: Fix bug where the user is redirected after completing purchase
        // if (cart.length === 0)
        //     return {
        //         redirect: '/cart',
        //         status: 302,
        //     };

        const isCartValid = cart.every(item =>
                item.product.available
                && !(typeof item.product.stockCount === 'number' && item.count > item.product.stockCount),
            )
            && (session.user as User).pendingOrders < 5;
        if (!isCartValid)
            return {
                redirect: '/cart',
                status: 302,
            };

        return {
            props: {
                recommendations,
                cart,
            },
            error: error && new Error(error),
            status: error ? 400 : 200,
        };
    };
</script>


<script lang="ts">
    import type { CartItemPopulated } from '$types/cart';
    import type { Recommendation } from '$types/recommendation';
    import type { User } from '$types/user';
    import CartConfirmation from '$lib/order/steps/CartConfirmation.svelte';
    import Eula from '$lib/order/steps/Eula.svelte';
    import OrderSucceed from '$lib/order/steps/OrderSucceed.svelte';
    import Meta from '$lib/Meta.svelte';
    import Recommendations from '$lib/order/steps/Recommendations.svelte';
    import { session } from '$app/stores';
    import { createOrderFromCart } from '$lib/api/orders/create-order-from-cart';

    export let recommendations: Recommendation[];
    export let cart: CartItemPopulated[];
    let validatedRecommendations: CartItemPopulated[] = [];
    let comment: string | null = null;

    $: if (comment?.trim() === '')
        comment = null;

    type Step = 'RECOMMENDATIONS' | 'CONFIRM_ITEMS' | 'EULA' | 'ORDERING' | 'SUCCESS' | 'ERROR'

    let step: Step = recommendations?.length > 0 ? 'RECOMMENDATIONS' : 'CONFIRM_ITEMS';

    let error: string | null = null;

    function setError(e: Error) {
        step = 'ERROR';
        error = e.message;
    }


    function order() {
        step = 'ORDERING';
        createOrderFromCart(validatedRecommendations, comment)
            .then(({ error: err }) => {
                if (err)
                    return setError(new Error(err));
                ($session.user as User).cart = [];
                ($session.user as User).pendingOrders++;
                step = 'SUCCESS';
            });
    }

</script>


<Meta noindex title="Passer la commande"/>


<h1>Passer la commande</h1>

{#if step === 'RECOMMENDATIONS'}
    <Recommendations
            {recommendations}
            on:nextstep={() => step = 'CONFIRM_ITEMS'}
            bind:validatedRecommendations/>
{:else if step === 'CONFIRM_ITEMS'}
    <CartConfirmation {cart} {validatedRecommendations}
                      bind:comment
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
