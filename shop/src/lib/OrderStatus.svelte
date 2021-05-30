<script lang="ts">
    import type { OrderStatus } from '$types/order';

    export let status: OrderStatus;
    export let lowercase = false;
</script>


{#if status === 'WAITING_FOR_ACCEPTATION'}
    {lowercase ? 'e' : 'E'}n attente
{:else if status === 'PREPARATING'}
    {lowercase ? 'e' : 'E'}n cours de préparation
{:else if status === 'DELIVERING'}
    {lowercase ? 'e' : 'E'}n cours de livraison
{:else if status === 'COMPLETED'}
    {lowercase ? 'c' : 'C'}omplétée
{:else if status === 'USER_CANCELLED'}
    {lowercase ? 'a' : 'A'}nnulée
{:else if status === 'ADMIN_CANCELLED'}
    {lowercase ? 'a' : 'A'}nnulée par un administrateur
{/if}
