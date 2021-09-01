<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit/types/page';
    import { getPendingOrders } from '$lib/api/orders/get-pending-orders';

    export const load: Load = async ({ session, fetch }) => {
        if (!session.user)
            return {
                redirect: '/login?r=/account',
                status: 302,
            };

        const { data: orders, error, status } = await getPendingOrders(fetch);

        return {
            props: {
                orders,
            },
            error: error && new Error(error),
            status,
        };
    };
</script>


<script lang="ts">
    import type { Order } from '$types/order';
    import { session } from '$app/stores';
    import Meta from '$lib/Meta.svelte';
    import OrderCard from '$lib/order/OrderCard.svelte';
    import OrderPreview from '$lib/order/OrderPreview.svelte';
    import AccountLink from '$lib/account/AccountLink.svelte';
    import DisconnectPopup from '$lib/account/DisconnectPopup.svelte';

    export let orders: Order[] = [];
    let error: string | null = null;

    let showDisconnectPopup = false;
</script>


<Meta noindex title="Compte"/>


<h2 class="category-title">Mon compte</h2>

<AccountLink href="/account/update">Modifier mes informations</AccountLink>
<AccountLink on:click={() => showDisconnectPopup = true}>Déconnexion</AccountLink>
{#if $session.user?.role >= 2000}
    <AccountLink href="/admin" target="_self">Page Admin</AccountLink>
{/if}


{#if orders.length > 0}

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
