<script lang="ts">
    import Item from '$lib/Item.svelte';
    import OrderStatus from '$lib/OrderStatus.svelte';
    import OrderModeSelect from '../../../lib/OrderModeSelect.svelte';
    import { onMount } from 'svelte';
    import { REMOTE_ENDPOINT } from '$lib/api-url';
    import dayjs from 'dayjs';

    let orders = [];
    let error: string | null = null;

    function fetchOrders(mode: OrderMode) {
        if (disabled)
            return;
        disabled = true;
        error = null;
        let status;
        switch (mode) {
            case 'all':
                status = '';
                break;
            case 'validate':
                status = '&states=WAITING_FOR_ACCEPTATION';
                break;
            case 'pending':
                status = '&states=PREPARATING,DELIVERING';
                break;
            case 'completed':
                status = '&states=COMPLETED';
                break;
            case 'cancelled':
                status = '&states=USER_CANCELLED,ADMIN_CANCELLED';
                break;
        }
        fetch(`${REMOTE_ENDPOINT}/v1/order?limit=50${status}`)
            .then(async res => ({ res, data: await res.json() }))
            .then(({ res, data }) => {
                if (!res.ok)
                    throw new Error(data.message || JSON.stringify(data));
                if (!Array.isArray(data))
                    throw new Error('Impossible de récupérer les commandes');
                orders = data;
            })
            .catch(e => {
                orders = [];
                error = e.message || e;
            })
            .finally(() => disabled = false);
    }

    type OrderMode = 'all' | 'validate' | 'pending' | 'completed' | 'cancelled';

    let orderMode: OrderMode = 'all';
    let disabled = false;

    $: fetchOrders(orderMode);
</script>


<h1 class="text-2xl">Commandes</h1>

<div class="flex my-4 max-w-full overflow-x-auto">
    <OrderModeSelect bind:orderMode {disabled} mode="all">Toutes les commandes</OrderModeSelect>
    <OrderModeSelect bind:orderMode {disabled} mode="validate">À valider</OrderModeSelect>
    <OrderModeSelect bind:orderMode {disabled} mode="pending">En cours</OrderModeSelect>
    <OrderModeSelect bind:orderMode {disabled} mode="completed">Complétées</OrderModeSelect>
    <OrderModeSelect bind:orderMode {disabled} mode="cancelled">Annulées</OrderModeSelect>
</div>

{#if error}
    <p class="text-red-600 mb-4">{error}</p>
{/if}

{#if disabled}
    Chargement...
{:else}
    {#each orders as order}
        <Item href="/admin/orders/{order._id}">
            <div class="flex items-center justify-between w-full h-6">
                <span>
                    Commande de {order.user.firstname} {order.user.lastname}
                    du {dayjs(order.createdAt).format('DD/MM à HH:mm')}
                </span>
                <OrderStatus status={order.status}/>
            </div>
        </Item>
    {/each}
{/if}
