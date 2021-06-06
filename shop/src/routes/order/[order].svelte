<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit/types/page';

    export const load: Load = ({ session, page }) => {
        if (!session.user)
            return {
                redirect: `/login?r=/order/${page.params.order}`,
                status: 302,
            };
        return {};
    };
</script>


<script lang="ts">
    import type { Order } from '$types/order';
    import type { Product } from '$types/products';
    import type { User } from '$types/user';
    import { page } from '$app/stores';
    import Meta from '$lib/Meta.svelte';
    import OrderStatus from '$lib/order/OrderStatus.svelte';
    import Popup from '$lib/layout/Popup.svelte';
    import Button from '$lib/layout/Button.svelte';
    import { onMount } from 'svelte';
    import { imageUrl } from '$lib/helpers/image-url';
    import { currencyFormat } from '$lib/helpers/currency-format';
    import dayjs from 'dayjs';
    import { session } from '$app/stores';
    import { cancelUserOrder } from '$lib/api/orders/cancel-user-order';
    import { getOrderDetails } from '$lib/api/orders/get-order-details';

    const orderID = $page.params.order as string;
    let order: Order;
    let itemCount: number;
    let itemsTotalPrice: number;
    let error: string | null = null;

    let title: string;
    $: title = order?.createdAt ? `Commande du ${dayjs(order.createdAt).format('DD/MM/YYYY')}` : 'Commande';

    onMount(() => {
        getOrderDetails(orderID)
            .then(({ data, error: err }) => {
                if (err)
                    error = err;
                if (data?._id)
                    populateOrderData(data);
            });
    });


    let canCancelOrder;
    $: canCancelOrder = order?.status
        && (order.status === 'WAITING_FOR_ACCEPTATION' || order.status === 'PREPARATING' || order.status === 'DELIVERING')
        && dayjs(order.createdAt).add(2, 'days').isAfter(new Date());


    function populateOrderData(data: Order) {
        order = data;
        itemCount = order.items.reduce((total, { count }) => total + count, 0);
        itemsTotalPrice = order.items
            .reduce((total, { count, product }) => total + (product as Product).price * count, 0);
    }


    let isCancelPopupVisible = false;
    let cancelReason = '';
    let cancellingOrder = false;
    let cancelError: string | null = null;

    function showCancelPopup() {
        cancelReason = '';
        cancelError = null;
        isCancelPopupVisible = true;
    }

    function hideCancelPopup() {
        if (cancellingOrder)
            return;
        isCancelPopupVisible = false;
    }

    function cancelOrder() {
        if (cancellingOrder)
            return;
        cancellingOrder = true;
        cancelError = null;

        cancelUserOrder(orderID, cancelReason)
            .then(({ data, error: err }) => {
                if (err)
                    cancelError = err;
                if (data?._id) {
                    populateOrderData(data);
                    ($session.user as User).pendingOrders--;
                    cancellingOrder = false;
                    hideCancelPopup();
                }
                cancellingOrder = false;
            });
    }
</script>


<style>
    h1 {
        margin-top: 0;
    }

    h1 img {
        height: 30px;
        width: 30px;
        cursor: pointer;
        transform: translateY(4px);
    }

    .product {
        --card-height: 50px;
        margin-bottom: calc(var(--spacing) / 2);
        height: var(--card-height);
        width: 100%;
        display: flex;
        background-color: var(--white);
        border-radius: var(--round);
        color: var(--black);
    }

    .product img {
        height: var(--card-height);
        width: var(--card-height);
        border-radius: var(--round) 0 0 var(--round);
    }

    .product-body {
        display: flex;
        align-items: center;
        padding: var(--spacing);
        flex: 1;
    }

    .cancel-btn {
        padding: var(--spacing);
        margin-bottom: var(--spacing);
        text-align: center;
        border: 0;
        border-radius: var(--round);
        outline: none;
        color: var(--white);
        background-color: #ef4444;
        cursor: pointer;
        width: 100%;
        font-size: 1rem;
    }

    .cancel-area {
        width: 100%;
        resize: vertical;
        min-height: 50px;
        padding: var(--spacing);
        border: 1px solid var(--primary);
        border-radius: var(--round);
        outline: none;
    }

    .history {
        width: 100%;
        padding: var(--spacing);
        background-color: var(--white);
        border-radius: var(--round);
        margin-bottom: calc(var(--spacing) / 2);
    }
</style>


<Meta {title}/>


<h1>
    <img height="24" on:click={() => window.history.back()} src="/icons/back-highlight.svg" width="24">
    {title}
</h1>

{#if error}
    <p class="error-message">{error}</p>
{/if}

{#if !order}
    Chargement...
{:else}
    <h3>Détails</h3>

    {#each order.items as { product, count }}
        <a class="product" href="/product/{product.slug}">
            <img src={imageUrl(product.coverImageUrl, 200)} height="200" width="200"/>
            <div class="product-body">
                <span>
                    <b>{count}x</b> {product.name} ({currencyFormat(product.price)} pièce)
                </span>
            </div>
        </a>
    {/each}

    Total : {itemCount} produit{itemCount > 1 ? 's' : ''} pour {currencyFormat(itemsTotalPrice)}


    {#if canCancelOrder}
        <h3>Actions</h3>

        <!-- TODO: dynamic update of the remaining time for cancelling -->
        <button class="cancel-btn" on:click={showCancelPopup}>
            Annuler la commande
        </button>
    {/if}


    <h3>Historique</h3>

    <div class="history">
        [{dayjs(order.createdAt).format('DD/MM à HH:mm')}] Commande effectuée
    </div>
    {#each order.history as { createdAt, newStatus }}
        <div class="history">
            [{dayjs(createdAt).format('DD/MM à HH:mm')}] Commande
            <OrderStatus status={newStatus} lowercase/>
        </div>
    {/each}
{/if}


{#if isCancelPopupVisible}
    <Popup backdrop on:close={hideCancelPopup}>
        <h1>
            <img height="24" on:click={hideCancelPopup} src="/icons/cross-highlight.svg" width="24">
            Annuler la commande
        </h1>
        <p>
            Êtes-vous sur de vouloir annuler cette commande ?
            Si tel est le cas, veuillez donner une raison dans l'encadré ci-desous.
        </p>
        {#if cancelError}
            <p class="error-message">{cancelError}</p>
        {/if}
        <form on:submit|preventDefault={cancelOrder}>
            <textarea disabled={cancellingOrder} class="cancel-area" bind:value={cancelReason}/>
            <Button disabled={cancellingOrder}>Annuler la commande</Button>
        </form>
        <Button nomargin type="secondary" on:click={hideCancelPopup} disabled={cancellingOrder}>Retour</Button>
    </Popup>
{/if}
