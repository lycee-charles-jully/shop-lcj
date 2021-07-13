<script lang="ts">
    import { page } from '$app/stores';
    import OrderStatus from '$lib/OrderStatus.svelte';
    import Item from '$lib/Item.svelte';
    import NextStatus from '$lib/NextStatus.svelte';
    import InputContainer from '$lib/InputContainer.svelte';
    import Popup from '$lib/Popup.svelte';
    import { onMount } from 'svelte';
    import { REMOTE_ENDPOINT } from '$lib/api-url';
    import { currencyFormat } from '$lib/currency-format';
    import dayjs from 'dayjs';

    const orderID: string = $page.params.order;

    let orderDetails;
    let itemCount: number;
    let itemsTotalPrice: number;
    let nextStatus: string;
    let error: string | null = null;
    let loading: boolean = false;

    onMount(() => {
        loading = true;
        error = null;
        fetch(`${REMOTE_ENDPOINT}/v1/order/${orderID}`, {
            credentials: 'same-origin',
        })
            .then(async res => ({ res, data: await res.json() }))
            .then(({ res, data }) => {
                if (!res.ok)
                    throw new Error(data.message || JSON.stringify(data));
                injectRawOrder(data);
            })
            .catch(e => error = e.message || e)
            .finally(() => loading = false);
    });


    function injectRawOrder(data) {
        orderDetails = data;
        itemCount = orderDetails.items.reduce((total, { count }) => total + count, 0);
        itemsTotalPrice = orderDetails.items
            .reduce((total, { count, product }) => total + product.price * count, 0);
        if (orderDetails.status === 'WAITING_FOR_ACCEPTATION')
            nextStatus = 'PREPARATING';
        else if (orderDetails.status === 'PREPARATING')
            nextStatus = 'DELIVERING';
        else if (orderDetails.status === 'DELIVERING')
            nextStatus = 'COMPLETED';
    }

    let cancelReason = '';
    let cancelPopupVisible = false;

    function showCancelPopup() {
        cancelReason = '';
        cancelPopupVisible = true;
    }

    function cancelOrder() {
        if (loading)
            return;
        loading = true;
        error = null;
        fetch(`${REMOTE_ENDPOINT}/v1/order/${orderID}/state`, {
            method: 'PATCH',
            body: JSON.stringify({
                state: 'ADMIN_CANCELLED',
                comment: cancelReason || undefined,
            }),
            headers: [
                [ 'Content-Type', 'application/json' ],
            ],
            credentials: 'same-origin',
        })
            .then(async res => ({ res, data: await res.json() }))
            .then(({ res, data }) => {
                if (!res.ok)
                    throw new Error(data.message || JSON.stringify(data));
                injectRawOrder(data);
                cancelPopupVisible = false;
            })
            .catch(e => error = e.message || e)
            .finally(() => loading = false);
    }

    function nextOrderState() {
        if (loading)
            return;
        loading = true;
        error = null;
        fetch(`${REMOTE_ENDPOINT}/v1/order/${orderID}/state`, {
            method: 'PATCH',
            body: JSON.stringify({
                state: nextStatus,
            }),
            headers: [
                [ 'Content-Type', 'application/json' ],
            ],
            credentials: 'same-origin',
        })
            .then(async res => ({ res, data: await res.json() }))
            .then(({ res, data }) => {
                if (!res.ok)
                    throw new Error(data.message || JSON.stringify(data));
                injectRawOrder(data);
            })
            .catch(e => error = e.message || e)
            .finally(() => loading = false);
    }
</script>


{#if error}
    <p class="text-red-500 mb-4">{error}</p>
{/if}


{#if orderDetails && orderDetails._id}
    <h1 class="text-2xl font-bold mb-4 flex justify-between items-center">
        <span>
            Commande de {orderDetails.user.firstname} {orderDetails.user.lastname}
            du {dayjs(orderDetails.createdAt).format('DD/MM à HH:mm')}
        </span>
        <span class="font-medium text-xl">
            <OrderStatus status={orderDetails.status}/>
        </span>
    </h1>


    <h2 class="text-xl font-bold mb-2">Détails de la commande</h2>

    {#each orderDetails.items as { count, product }}
        <Item thumb={product.coverImageUrl}
              href="/product/{product.slug}"
              target="_blank">
            <b>{count} x</b> {product.name} ({currencyFormat(product.price)} pièce)
        </Item>
    {/each}

    <p class="mb-4">Total : {itemCount} produits pour {currencyFormat(itemsTotalPrice)}</p>


    <h2 class="text-xl font-bold mb-2">Détail du client</h2>

    <p class="mb-4">
        Identité : {orderDetails.user.firstname} {orderDetails.user.lastname}<br/>
        Email :
        <a href="mailto:{orderDetails.user.email}"
           class="text-blue-400 underline print:text-black print:no-underline">
            {orderDetails.user.email}
        </a><br/>
        Classe : {orderDetails.user.grade}<br/>
        Téléphone :
        <a href="tel:{orderDetails.user.phone}"
           class="text-blue-400 underline print:text-black print:no-underline">
            {orderDetails.user.phone}
        </a><br/>
        Numéro Jeun'Est : {orderDetails.user.jeunestNumber}
    </p>


    <div class="print:hidden mb-4">
        <h2 class="text-xl font-bold mb-2">Actions</h2>

        <button class="bg-indigo-600 text-white rounded px-4 py-2 mb-1" on:click={() => window.print()}
                disabled={loading}>
            Imprimer
        </button>

        {#if orderDetails.status !== 'ADMIN_CANCELLED' && orderDetails.status !== 'USER_CANCELLED' && orderDetails.status !== 'COMPLETED'}
            <NextStatus currentStatus={orderDetails.status} on:click={nextOrderState} disabled={loading}/>

            <button class="bg-red-500 text-white rounded px-4 py-2 mb-1" on:click={showCancelPopup} disabled={loading}>
                Annuler la commande
            </button>
        {/if}
    </div>


    <h2 class="text-xl font-bold mb-2">Historique</h2>

    <div class="block w-full bg-gray-600 rounded-md my-2 p-4 print:p-0 print:my-1">
        <div class="flex items-center w-full h-6">
            [{dayjs(orderDetails.createdAt).format('DD/MM à HH:mm')}]
            {orderDetails.user.firstname} {orderDetails.user.lastname} a créé la commande, marquée comme
            <div class="inline-block ml-2 print:ml-1">
                <OrderStatus status="WAITING_FOR_ACCEPTATION"/>
            </div>
        </div>
    </div>
    {#each orderDetails.history as history}
        <div class="block w-full bg-gray-600 rounded-md my-2 p-4 print:p-0 print:my-1">
            <div class="flex items-center w-full h-6">
                [{dayjs(history.createdAt).format('DD/MM à HH:mm')}]
                {history.user.firstname} {history.user.lastname} a marqué la commande comme
                <div class="inline-block ml-2 print:ml-1">
                    <OrderStatus status={history.newStatus}/>
                </div>
            </div>
            {#if history.comment}
                <div class="mt-1 print:mt-0">
                    {#if history.newStatus === 'USER_CANCELLED' || history.newStatus === 'ADMIN_CANCELLED'}
                        Raison :
                    {:else}
                        Commentaire :
                    {/if}
                    <span class="whitespace-pre">{history.comment}</span>
                </div>
            {/if}
        </div>
    {/each}
{:else}
    <p>
        Chargement...
    </p>
{/if}


{#if cancelPopupVisible}
    <Popup title="Annuler la commande" on:close={() => !loading && (cancelPopupVisible = false)}>
        <form on:submit|preventDefault={cancelOrder}>
            <InputContainer let:id label="Motif (optionnel)">
                <textarea {id}
                          class="w-full rounded p-2 border border-transparent focus:border-blue-500 outline-none bg-gray-600 text-gray-100 h-40 scroll"
                          bind:value={cancelReason}/>
            </InputContainer>
            <button class="w-full text-white bg-red-500 rounded p-2 outline-none">Annuler</button>
        </form>

        <button class="w-full border border-red-600 rounded p-2 mt-4 outline-none"
                on:click={() => !loading && (cancelPopupVisible = false)}>
            Retour
        </button>
    </Popup>
{/if}
