<script lang="ts">
    import { statusColors } from '$lib/status-colors';

    export let status: 'WAITING_FOR_ACCEPTATION' | 'PREPARATING' | 'DELIVERING' | 'COMPLETED' | 'USER_CANCELLED' | 'ADMIN_CANCELLED';

    let color = statusColors.get(status);
</script>


<style>
    div {
        @apply rounded inline-block px-2 py-1 whitespace-nowrap;
    }
</style>


{#if status === 'WAITING_FOR_ACCEPTATION'}
    <div class="bg-{color}">À confirmer</div>
{:else if status === 'PREPARATING'}
    <div class="bg-{color}">Préparation</div>
{:else if status === 'DELIVERING'}
    <div class="bg-{color}">Livraison</div>
{:else if status === 'COMPLETED'}
    <div class="bg-{color}">Complétée</div>
{:else if status === 'USER_CANCELLED' || status === 'ADMIN_CANCELLED'}
    <div class="bg-{color}">Annulée</div>
{/if}
