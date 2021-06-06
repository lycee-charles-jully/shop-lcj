<script lang="ts">
    import type { Order } from '$types/order';
    import type { User } from '$types/user';
    import { goto } from '$app/navigation';
    import { session } from '$app/stores';
    import Meta from '$lib/Meta.svelte';
    import OrderCard from '$lib/order/OrderCard.svelte';
    import OrderPreview from '$lib/order/OrderPreview.svelte';
    import AccountLink from '$lib/account/AccountLink.svelte';
    import DisconnectPopup from '$lib/account/DisconnectPopup.svelte';
    import { onMount } from 'svelte';
    import { getPendingOrders } from '$lib/api/orders/get-pending-orders';

    let error: string | null = null;
    let orders: Order[] = [];

    onMount(async () => {
        if (!$session.user)
            return goto('/login?r=/account');

        if (($session.user as User).pendingOrders)
            getPendingOrders()
                .then(({ error: err, data }) => {
                    if (err)
                        error = err;
                    if (data)
                        orders = data;
                });
    });

    let showDisconnectPopup = false;
</script>


<Meta title="Compte"/>


<h2 class="category-title">Mon compte</h2>

<AccountLink on:click={() => showDisconnectPopup = true}>Déconnexion</AccountLink>
{#if $session.user?.role >= 2000}
    <AccountLink href="/admin" target="_self">Page Admin</AccountLink>
{/if}


{#if $session.user?.pendingOrders}

    <h2 class="category-title">Mes commandes en cours</h2>

    {#if error}
        <p class="error-message">{error}</p>
    {/if}

    {#if orders.length > 0}
        {#each orders as order}
            <OrderCard {order}/>
        {/each}
    {:else if typeof $session?.user?.pendingOrders === 'number' && $session.user.pendingOrders > 0}
        {#each new Array($session.user.pendingOrders).fill(null) as _}
            <OrderPreview/>
        {/each}
    {/if}

{/if}

<DisconnectPopup bind:show={showDisconnectPopup}/>
