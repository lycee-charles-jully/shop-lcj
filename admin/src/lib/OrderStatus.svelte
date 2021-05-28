<script lang="ts">
    export let status: 'WAITING_FOR_ACCEPTATION' | 'PREPARATING' | 'DELIVERING' | 'COMPLETED' | 'USER_CANCELLED' | 'ADMIN_CANCELLED';
</script>


<style>
    div {
        @apply rounded inline-block px-2 py-1 whitespace-nowrap;
    }
</style>


{#if status === 'WAITING_FOR_ACCEPTATION'}
    <div class="bg-yellow-400">À confirmer</div>
{:else if status === 'PREPARATING'}
    <div class="bg-purple-400">Préparation</div>
{:else if status === 'DELIVERING'}
    <div class="bg-blue-400">Livraison</div>
{:else if status === 'COMPLETED'}
    <div class="bg-green-400">Complétée</div>
{:else if status === 'USER_CANCELLED' || status === 'ADMIN_CANCELLED'}
    <div class="bg-red-400">Annulée</div>
{/if}
