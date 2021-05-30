<script lang="ts">
    import type { Order } from '$types/order';
    import OrderStatus from '$lib/OrderStatus.svelte';
    import dayjs from 'dayjs';

    export let order: Order;
</script>


<style>
    .container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--spacing);
        background-color: var(--white);
        padding: var(--spacing);
        border-radius: var(--round);
        cursor: pointer;
    }

    .body {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .header {
        font-weight: bold;
    }

    .chevron {
        height: 30px;
        width: 30px;
    }
</style>


<div class="container">
    <!-- TODO: display product images -->
    <div class="body">
        <span class="header">Commande du {dayjs(order.createdAt).format('DD/MM/YYYY')}</span>
        <span><OrderStatus status={order.status}/></span>
    </div>
    <img alt=">" class="chevron" height="24" src="/icons/chevron-right.svg" width="24"/>
</div>
