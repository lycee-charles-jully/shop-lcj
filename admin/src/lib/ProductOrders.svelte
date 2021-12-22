<script>
    import { API_URL } from '$lib/api-url';
    import OrderStatus from '$lib/order-status/OrderStatus.svelte';
    import dayjs from 'dayjs';
    import { onMount } from 'svelte';

    export let productID;

    let loading = true;
    let error = null;
    let orders = [];

    onMount(() => {
        fetch(`${API_URL}/v1/order/product/${productID}`)
            .then(async res => ({ res, data: await res.json() }))
            .then(({ res, data }) => {
                if (!res.ok)
                    throw new Error(data.message || JSON.stringify(data));
                orders = data;
            })
            .catch(err => {
                console.error(err);
                error = err.message || err;
            })
            .finally(() => {
                loading = false;
            });
    });
</script>


{#if error}
    <p class="text-red-500">{error}</p>
{:else if loading}
    <p>Chargement...</p>
{:else}
    {#each orders as order (order._id)}
        <a class="bg-gray-700 mt-2 p-2 sm:p-4 rounded block flex justify-between items-center"
           href="/admin/orders/{order._id}">
            <span>
            <b>{order.count}x</b> de {order.user.firstname} {order.user.lastname}
                le {dayjs(order.createdAt).format('DD/MM/YY')}
            </span>
            <OrderStatus status={order.status} shrink/>
        </a>
    {/each}
{/if}
