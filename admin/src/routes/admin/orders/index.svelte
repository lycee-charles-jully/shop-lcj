<script>
    import Item from '$lib/Item.svelte';
    import OrderStatus from '$lib/OrderStatus.svelte';
    import { onMount } from 'svelte';
    import { REMOTE_ENDPOINT } from '$lib/api-url';
    import dayjs from 'dayjs';

    let orders = [];

    onMount(() => {
        fetch(`${REMOTE_ENDPOINT}/v1/order/all/pending`, {
            credentials: 'same-origin',
        })
            .then(res => res.json())
            .then(data => orders = data);
    });
</script>


<h1 class="text-2xl">Commandes</h1>

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
