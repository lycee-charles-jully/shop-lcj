<script lang="ts">
    import { statusColors } from '$lib/status-colors';

    export let status: 'WAITING_FOR_ACCEPTATION' | 'PREPARATING' | 'DELIVERING' | 'COMPLETED' | 'USER_CANCELLED' | 'ADMIN_CANCELLED';

    let color;
    $: color = statusColors.get(status);
</script>


<style>
    div {
        @apply rounded inline-block px-2 py-1 whitespace-nowrap;
    }
</style>


<div class="bg-{color}">
    {#if status === 'WAITING_FOR_ACCEPTATION'}
        À confirmer
    {:else if status === 'PREPARATING'}
        Préparation
    {:else if status === 'DELIVERING'}
        Livraison
    {:else if status === 'COMPLETED'}
        Complétée
    {:else if status === 'USER_CANCELLED' || status === 'ADMIN_CANCELLED'}
        Annulée
    {/if}
</div>
