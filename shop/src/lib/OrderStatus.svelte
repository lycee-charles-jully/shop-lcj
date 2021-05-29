<script lang="ts">
    import type { OrderStatus } from '$types/order';

    export let status: OrderStatus;
</script>


{#if status === 'WAITING_FOR_ACCEPTATION'}
    En attente
{:else if status === 'PREPARATING'}
    En cours de préparation
{:else if status === 'DELIVERING'}
    En cours de livraison
{:else if status === 'COMPLETED'}
    Complétée
{:else if status === 'USER_CANCELLED'}
    Annulée
{:else if status === 'ADMIN_CANCELLED'}
    Annulée par un administrateur
{/if}
