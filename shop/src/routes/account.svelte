<script lang="ts">
    import type { Order } from '$types/order';
    import type { User } from '$types/user';
    import { goto } from '$app/navigation';
    import { session } from '$app/stores';
    import Meta from '$lib/Meta.svelte';
    import OrderCard from '$lib/OrderCard.svelte';
    import OrderPreview from '$lib/OrderPreview.svelte';
    import { onMount } from 'svelte';
    import { REMOTE_ENDPOINT } from '$lib/api-url';

    let error: string | null = null;
    let orders: Order[] = [];

    onMount(() => {
        if (!$session.user)
            return goto('/login?r=/account');

        if (($session.user as User).pendingOrders)
            fetch(`${REMOTE_ENDPOINT}/v1/order/me/pending`, {
                credentials: 'same-origin',
            })
                .then(async res => ({ res, data: await res.json() }))
                .then(({ res, data }) => {
                    if (!res.ok)
                        throw new Error(data.message || JSON.stringify(data));
                    if (!Array.isArray(data))
                        throw new Error('Réponse du serveur invalide');
                    orders = data;
                })
                .catch(e => {
                    console.error(e);
                    error = e;
                });
    });
</script>


<Meta title="Compte"/>


{#if $session.user?.pendingOrders}

    <h2 class="category-title">Mes commandes en cours</h2>

    {#if error}
        <p class="error-message">{error}</p>
    {/if}

    {#if orders.length > 0}
        {#each orders as order}
            <OrderCard {order}/>
        {/each}
    {:else if typeof $session?.user?.pendingOrders === 'number'}
        {#each new Array($session.user.pendingOrders).fill(null) as _}
            <OrderPreview/>
        {/each}
    {/if}

{/if}
