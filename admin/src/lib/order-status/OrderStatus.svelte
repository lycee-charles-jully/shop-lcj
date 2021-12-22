<script lang="ts">
    import StatusIndicator from '$lib/order-status/StatusIndicator.svelte';

    export let status: 'WAITING_FOR_ACCEPTATION' | 'PREPARATING' | 'DELIVERING' | 'COMPLETED' | 'USER_CANCELLED' | 'ADMIN_CANCELLED';
    export let shrink = false;
</script>


<div>
    {#if status === 'WAITING_FOR_ACCEPTATION'}
        <StatusIndicator label="À confirmer" class="bg-yellow-400" {shrink}/>
    {:else if status === 'PREPARATING'}
        <StatusIndicator label="Préparation" class="bg-purple-400" {shrink}/>
    {:else if status === 'DELIVERING'}
        <StatusIndicator label="Livraison" class="bg-blue-400" {shrink}/>
    {:else if status === 'COMPLETED'}
        <StatusIndicator label="Complétée" class="bg-green-400" {shrink}/>
    {:else if status === 'USER_CANCELLED' || status === 'ADMIN_CANCELLED'}
        <StatusIndicator label="Annulée" class="bg-red-400" {shrink}/>
    {/if}
</div>
