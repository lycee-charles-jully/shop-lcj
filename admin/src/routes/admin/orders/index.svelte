<script lang="ts">
    import Item from '$lib/Item.svelte';
    import OrderStatus from '$lib/order-status/OrderStatus.svelte';
    import OrderModeSelect from '$lib/OrderModeSelect.svelte';
    import { REMOTE_ENDPOINT } from '$lib/api-url';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { browser } from '$app/env';
    import dayjs from 'dayjs';

    let orders = [];
    let error: string | null = null;

    function fetchOrders(mode: OrderMode) {
        if (disabled)
            return;
        disabled = true;
        error = null;
        if (browser) {
            const currentMode = ($page.query as URLSearchParams).get('mode');
            if (mode === 'all' && currentMode !== null)
                goto($page.path, { replaceState: true });
            else if (mode !== 'all' && currentMode !== mode)
                goto(`?mode=${mode}`, { replaceState: true });
        }
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


    function getDefaultOrderMode(): OrderMode {
        const queryOrderMode = ($page.query as URLSearchParams).get('mode');
        if (!queryOrderMode || ![ 'validate', 'pending', 'completed', 'cancelled' ].includes(queryOrderMode))
            return 'all';
        else
            return queryOrderMode as OrderMode;
    }

    type OrderMode = 'all' | 'validate' | 'pending' | 'completed' | 'cancelled';

    let orderMode: OrderMode = getDefaultOrderMode();
    let disabled = false;

    $: fetchOrders(orderMode);
</script>


<h1 class="text-2xl">Commandes</h1>


<div class="lg:flex hidden my-4">
    <OrderModeSelect bind:orderMode {disabled} mode="all">Toutes les commandes</OrderModeSelect>
    <OrderModeSelect bind:orderMode {disabled} mode="validate">À valider</OrderModeSelect>
    <OrderModeSelect bind:orderMode {disabled} mode="pending">En cours</OrderModeSelect>
    <OrderModeSelect bind:orderMode {disabled} mode="completed">Complétées</OrderModeSelect>
    <OrderModeSelect bind:orderMode {disabled} last mode="cancelled">Annulées</OrderModeSelect>
</div>

<div class="my-4 lg:hidden">
    <span class="mr-1">Afficher :</span>
    <select bind:value={orderMode} class="bg-gray-600 px-2 py-1 rounded">
        <option value="all">Toutes les commandes</option>
        <option value="validate">Commandes à valider</option>
        <option value="pending">Commandes en cours</option>
        <option value="completed">Commandes complétées</option>
        <option value="cancelled">Commandes annulées</option>
    </select>
</div>


{#if error}
    <p class="text-red-500 mb-4">{error}</p>
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
                <OrderStatus status={order.status} shrink/>
            </div>
        </Item>
    {/each}
{/if}
