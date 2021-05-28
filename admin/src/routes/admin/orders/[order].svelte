<script lang="ts">
    import { page } from '$app/stores';
    import OrderStatus from '$lib/OrderStatus.svelte';
    import Item from '$lib/Item.svelte';
    import { onMount } from 'svelte';
    import { REMOTE_ENDPOINT } from '$lib/api-url';
    import { currencyFormat } from '$lib/currency-format';
    import dayjs from 'dayjs';

    const orderID: string = $page.params.order;

    let orderDetails;
    let itemCount: number;
    let itemsTotalPrice: number;
    let error: string | null = null;

    onMount(() => {
        fetch(`${REMOTE_ENDPOINT}/v1/order/${orderID}`, {
            credentials: 'same-origin',
        })
            .then(async res => ({ res, data: await res.json() }))
            .then(({ res, data }) => {
                if (!res.ok)
                    throw new Error(data.message || JSON.stringify(data));
                orderDetails = data;
                itemCount = orderDetails.items.reduce((total, { count }) => total + count, 0);
                itemsTotalPrice = orderDetails.items
                    .reduce((total, { count, product }) => total + product.price * count, 0);
            })
            .catch(e => error = e.message || e);
    });
</script>


{#if error}
    <p class="text-red-600">{error}</p>
{/if}


{#if orderDetails && orderDetails._id}
    <h1 class="text-2xl font-bold mb-4 flex justify-between">
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
        Email : <a href="mailto:{orderDetails.user.email}" class="text-blue-500 underline">{orderDetails.user.email}</a><br/>
        Classe : {orderDetails.user.grade}<br/>
        Numéro Jeun'Est : {orderDetails.user.jeunestNumber}
    </p>


    <h2 class="text-xl font-bold mb-2">Historique</h2>

    <Item>
        <div class="flex items-center w-full h-6">
            [{dayjs(orderDetails.createdAt).format('DD/MM à HH:mm')}]
            {orderDetails.user.firstname} {orderDetails.user.lastname} a créé la commande, marquée comme
            <div class="inline-block ml-2">
                <OrderStatus status="WAITING_FOR_ACCEPTATION"/>
            </div>
        </div>
    </Item>
    {#each orderDetails.history as history}
        <Item>
            <div class="flex items-center w-full h-6">
                [{dayjs(history.createdAt).format('DD/MM à HH:mm')}]
                {history.user.firstname} {history.user.lastname} a marqué la commande comme
                <div class="inline-block ml-2">
                    <OrderStatus status={history.newStatus}/>
                </div>
            </div>
        </Item>
    {/each}
{:else}
    <p>
        Chargement...
    </p>
{/if}
