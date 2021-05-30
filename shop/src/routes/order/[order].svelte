<script lang="ts">
    import type { Order } from '$types/order';
    import type { Product } from '$types/products';
    import { page } from '$app/stores';
    import Meta from '$lib/Meta.svelte';
    import OrderStatus from '$lib/order/OrderStatus.svelte';
    import { onMount } from 'svelte';
    import { imageUrl } from '$lib/helpers/image-url';
    import { currencyFormat } from '$lib/helpers/currency-format';
    import { REMOTE_ENDPOINT } from '$lib/helpers/api-url';
    import dayjs from 'dayjs';

    const orderID = $page.params.order as string;
    let order: Order;
    let itemCount: number;
    let itemsTotalPrice: number;
    let error: string | null = null;

    let title: string;
    $: title = order?.createdAt ? `Commande du ${dayjs(order.createdAt).format('DD/MM/YYYY')}` : 'Commande';

    onMount(() => {
        fetch(`${REMOTE_ENDPOINT}/v1/order/me/${orderID}`)
            .then(async res => ({ res, data: await res.json() }))
            .then(({ res, data }) => {
                if (!res.ok)
                    throw new Error(data.message || JSON.stringify(data));
                order = data;
                itemCount = order.items.reduce((total, { count }) => total + count, 0);
                itemsTotalPrice = order.items
                    .reduce((total, { count, product }) => total + (product as Product).price * count, 0);
            })
            .catch(e => {
                console.error(e);
                error = e.message || e;
            });
    });
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
